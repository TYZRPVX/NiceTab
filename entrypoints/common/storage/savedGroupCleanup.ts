import dayjs from 'dayjs';
import type { GroupItem, SettingsProps, TagItem } from '~/entrypoints/types';
import Store from './instanceStore';

export function savedGroupRetentionDays(settings: SettingsProps) {
  const days = Number(settings.savedGroupRetentionDays ?? 90);
  return Number.isFinite(days) ? Math.min(3650, Math.max(1, Math.floor(days))) : 90;
}

export function isExpiredSavedGroup(
  tag: TagItem,
  group: GroupItem,
  days: number,
  now: number,
) {
  if (tag.isLocked || group.isLocked || group.isStarred || !group.createTime)
    return false;
  const created = dayjs(group.createTime);
  if (!created.isValid()) return false;
  // Dayjs otherwise normalizes impossible dates such as February 30.
  const datePart = /^(\d{4}-\d{2}-\d{2})(?:$|[ T])/.exec(group.createTime)?.[1];
  if (datePart && dayjs(datePart).format('YYYY-MM-DD') !== datePart) return false;
  if (
    /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/.test(group.createTime) &&
    created.format('YYYY-MM-DD HH:mm:ss') !== group.createTime.replace('T', ' ')
  )
    return false;
  return dayjs(now).diff(created, 'day') >= days;
}

function groupKey(tag: TagItem, group: GroupItem) {
  return JSON.stringify([tag.tagId, group.groupId]);
}

// One scalar guard for background work. Candidate references and fresh storage reads
// live only for this run; no cache or additional full model is retained by the page.
let running = false;

export async function cleanupSavedGroups(now = Date.now()): Promise<number> {
  if (running) return 0;
  running = true;
  try {
    const settings = await Store.settingsUtils.getSettings();
    if (settings.autoCleanupSavedGroups === false) return 0;
    const days = savedGroupRetentionDays(settings);
    const key = Store.tabListUtils.storageKey;
    const candidates = new Map<string, GroupItem>();
    for (const tag of (await storage.getItem<TagItem[]>(key)) || []) {
      for (const group of tag.groupList) {
        if (isExpiredSavedGroup(tag, group, days, now)) {
          candidates.set(groupKey(tag, group), group);
        }
      }
    }
    if (!candidates.size) return 0;

    const unchangedCandidate = (tag: TagItem, group: GroupItem) => {
      const original = candidates.get(groupKey(tag, group));
      return (
        original !== undefined &&
        isExpiredSavedGroup(tag, group, days, now) &&
        JSON.stringify(original) === JSON.stringify(group)
      );
    };
    const settingsUnchanged = async () => {
      const latest = await Store.settingsUtils.getSettings();
      return (
        latest.autoCleanupSavedGroups !== false &&
        savedGroupRetentionDays(latest) === days
      );
    };
    if (!(await settingsUnchanged())) return 0;

    // Re-read before archiving, so groups edited or protected during the scan are skipped.
    const archive: TagItem[] = [];
    for (const tag of (await storage.getItem<TagItem[]>(key)) || []) {
      const groupList = tag.groupList.filter(group => unchangedCandidate(tag, group));
      if (groupList.length) archive.push({ ...tag, groupList });
    }
    if (!archive.length) return 0;
    const archivedIds = new Set(
      archive.flatMap(tag => tag.groupList.map(group => groupKey(tag, group))),
    );
    // Never remove a source group until the complete recovery copy is persisted.
    await Store.recycleBinUtils.addTags(archive);

    if (!(await settingsUnchanged())) return 0;
    const latest = (await storage.getItem<TagItem[]>(key)) || [];
    let removed = 0;
    for (const tag of latest) {
      tag.groupList = tag.groupList.filter(group => {
        if (!archivedIds.has(groupKey(tag, group)) || !unchangedCandidate(tag, group))
          return true;
        removed++;
        return false;
      });
    }
    // Keep categories, even when all their groups have expired.
    if (removed) await Store.tabListUtils.setTagList(latest);
    return removed;
  } finally {
    running = false;
  }
}
