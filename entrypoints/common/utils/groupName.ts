import type { GroupItem, TabItem, TagItem } from '~/entrypoints/types';
import { UNNAMED_GROUP, UNNAMED_TAG } from '~/entrypoints/common/constants';

const legacyGeneratedNamePattern = /^[GT]_\d{8}_\d{2}:\d{2}:\d{2}_\d+$/;

export const isLegacyGeneratedName = (name?: string) =>
  !!name && legacyGeneratedNamePattern.test(name);

type GroupNameSource = Pick<GroupItem, 'groupName'> & {
  tabList?: Pick<TabItem, 'title'>[];
  previewTitle?: string;
};

export const getAutomaticGroupName = (tabList?: Pick<TabItem, 'title'>[]) =>
  tabList?.find(tab => tab.title?.trim())?.title?.trim() || UNNAMED_GROUP;

/** Replaces the former G_timestamp_id label with the saved group's first tab title. */
export const getDisplayGroupName = ({
  groupName,
  tabList,
  previewTitle,
}: GroupNameSource) => {
  const name = groupName?.trim();
  if (!name || !isLegacyGeneratedName(name)) return name || UNNAMED_GROUP;

  return previewTitle?.trim() || getAutomaticGroupName(tabList);
};

export const getDisplayTagName = ({ tagName }: Pick<TagItem, 'tagName'>) => {
  const name = tagName?.trim();
  return !name || isLegacyGeneratedName(name) ? UNNAMED_TAG : name;
};

/** Updates old automatic names before persisting the list again. */
export const normalizeLegacyGeneratedNames = (tagList: TagItem[]) => {
  let changed = false;

  for (const tag of tagList) {
    const tagName = getDisplayTagName(tag);
    if (tag.tagName !== tagName) {
      tag.tagName = tagName;
      changed = true;
    }

    for (const group of tag.groupList || []) {
      const groupName = getDisplayGroupName(group);
      if (group.groupName !== groupName) {
        group.groupName = groupName;
        changed = true;
      }
    }
  }

  return changed;
};
