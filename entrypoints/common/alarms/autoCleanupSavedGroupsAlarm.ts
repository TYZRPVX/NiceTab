import type { SettingsProps } from '~/entrypoints/types';
import { settingsUtils } from '../storage';
import { cleanupSavedGroups } from '../storage/savedGroupCleanup';
import CommonAlarm from './utils';

export const AUTO_CLEANUP_SAVED_GROUPS_ALARM_KEY = 'auto-cleanup-saved-groups';

class AutoCleanupSavedGroupsAlarm extends CommonAlarm {
  // Only pending scheduling work is held; resolved promises retain no tab data.
  private scheduling = Promise.resolve();

  constructor() {
    super(AUTO_CLEANUP_SAVED_GROUPS_ALARM_KEY);
  }

  create(reset = false) {
    this.scheduling = this.scheduling
      .catch(() => undefined)
      .then(async () => {
        const settings = await settingsUtils.getSettings();
        if (settings.autoCleanupSavedGroups === false) {
          await this.clearAlarm();
          return;
        }
        if (reset) await this.clearAlarm();
        // Preserve an existing alarm across service worker restarts to avoid postponing it.
        await this.createAlarm({ delayInMinutes: 1, periodInMinutes: 24 * 60 });
      });
    return this.scheduling;
  }

  checkReset(settings: SettingsProps, oldSettings: SettingsProps) {
    if (
      settings.autoCleanupSavedGroups !== oldSettings.autoCleanupSavedGroups ||
      settings.savedGroupRetentionDays !== oldSettings.savedGroupRetentionDays
    ) {
      return this.create(true);
    }
    return Promise.resolve();
  }
}

export const autoCleanupSavedGroupsAlarm = new AutoCleanupSavedGroupsAlarm();

export async function onAutoCleanupSavedGroupsAlarm() {
  try {
    await cleanupSavedGroups();
  } catch {
    // Do not log saved titles or URLs. A failed run is retried at the next daily alarm.
    console.error(
      'NiceTab saved-group cleanup failed; source groups remain recoverable.',
    );
  }
}
