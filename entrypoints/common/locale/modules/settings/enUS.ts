import { LocaleKey } from './zhCN';

const enUS: Record<LocaleKey, string> = {
  'settings.block.common': 'General',
  'settings.block.sendTabs': 'Saving tabs',
  'settings.block.openTabs': 'Opening saved tabs',
  'settings.block.tabSort': 'Tab sorting',
  'settings.block.pageTitleConfig': 'Title aliases',
  'settings.block.globalSearch': 'Global search',
  'settings.block.otherActions': 'Other actions',
  'settings.block.display': 'Appearance and menus',
  'settings.block.newtab': 'New tab page',
  'settings.block.autoSync': 'Automatic sync',
  'settings.block.sync': 'Sync',
  'settings.confirmTipContent': 'Leave without saving your changes?',
  'settings.language': 'Language{mark}',
  'settings.themeType': 'Theme{mark}',
  'settings.openAdminTabAfterBrowserLaunch': 'Open NiceTab when the browser starts?',
  'settings.openAdminTabAfterBrowserLaunch.yes': 'Open NiceTab',
  'settings.openAdminTabAfterBrowserLaunch.no': 'Do not open automatically',
  'settings.openAdminTabAfterWindowCreated': 'Open NiceTab in new windows?',
  'settings.openAdminTabAfterWindowCreated.yes': 'Open NiceTab',
  'settings.openAdminTabAfterWindowCreated.no': 'Do not open automatically',
  'settings.autoPinAdminTab': 'Pin the NiceTab tab',
  'settings.autoPinAdminTab.yes': 'Pin in its window (recommended)',
  'settings.autoPinAdminTab.no': 'Leave unpinned',
  'settings.restoreSnapshotAfterBrowserLaunch':
    'Restore tabs from the saved snapshot on startup?',
  'settings.autoCreateSnapshotInterval': 'Save a snapshot every (minutes)',
  'settings.autoCleanupSavedGroups': 'Automatically clean up old saved groups?',
  'settings.autoCleanupSavedGroups.description':
    'Checks all categories daily. Groups older than the retention period move to the recycle bin. Starred groups, locked groups and groups in locked categories are kept. Age is based on creation time; opening or editing a group does not extend it. Restoring a group resets its creation time. Recycled items follow the recycle bin retention setting.',
  'settings.savedGroupRetentionDays': 'Keep saved groups for (1–3650 days)',
  'settings.recycleRetentionDays': 'Keep deleted items for (1–365 days)',

  /* 发送标签页配置 */
  'settings.showSendTargetModal': 'Choose where to save tabs each time?',
  'settings.showSendTargetModal.tooltip':
    'If disabled, tabs go to the Staging area. Pages that cannot show the destination dialog also use the Staging area.',
  'settings.allowSendPinnedTabs': 'Include pinned tabs when saving',
  'settings.allowSendPinnedTabs.yes': 'Include pinned tabs',
  'settings.allowSendPinnedTabs.no': 'Skip pinned tabs (recommended)',
  'settings.excludeDomainsForSending': 'Sites to skip when saving',
  'settings.excludeDomainsForSending.tooltip':
    'Separate domains with spaces or line breaks. Regular expressions are also supported.',
  'settings.excludeDomainsForSending.placeholder':
    'Enter domains, separated by spaces or line breaks',
  'settings.openAdminTabAfterSendTabs':
    'Show NiceTab after saving (Save all tabs always shows it)',
  'settings.openAdminTabAfterSendTabs.yes': 'Show NiceTab',
  'settings.openAdminTabAfterSendTabs.no': 'Do not switch to NiceTab',
  'settings.closeTabsAfterSendTabs': 'After saving tabs',
  'settings.closeTabsAfterSendTabs.yes': 'Close the original tabs',
  'settings.closeTabsAfterSendTabs.no': 'Keep the original tabs open',
  'settings.keepAudibleTabsOpen': 'Tabs playing sound{mark}',
  'settings.keepAudibleTabsOpen.tooltip':
    'When tabs would close after saving, keep those playing sound open. They are still saved to NiceTab. Muted tabs and silent videos are not protected.',
  'settings.keepAudibleTabsOpen.yes': 'Keep open (recommended)',
  'settings.keepAudibleTabsOpen.no': 'Follow the closing settings',
  'settings.actionAutoCloseFlags': 'Close original tabs for these actions only',
  'settings.actionAutoCloseFlags.tooltip':
    'Applies when “Keep the original tabs open” is selected above. Checked actions close tabs after saving them. The setting for tabs playing sound still applies.',
  'settings.createNewGroupOnSendSingleTab': 'Create a new group when saving one tab?',
  'settings.createNewGroupOnSendSingleTab.tooltip':
    'If disabled, use the first group in the destination category that is neither starred nor locked. If none exists, create a group. A group you explicitly select takes priority.',
  'settings.allowDuplicateTabs': 'Duplicate tabs when saving or merging',
  'settings.allowDuplicateTabs.yes': 'Keep duplicates',
  'settings.allowDuplicateTabs.no': 'Remove duplicate URLs',
  'settings.allowDuplicateGroups': 'Groups with the same name when saving',
  'settings.allowDuplicateGroups.yes': 'Keep separate groups',
  'settings.allowDuplicateGroups.no': 'Merge within the destination category',

  /* 打开标签页配置 */
  'settings.restoreInNewWindow': 'Open groups in a new window?',
  'settings.deleteAfterRestore': 'After opening saved tabs',
  'settings.deleteAfterRestore.yes': 'Remove from NiceTab (keep locked items)',
  'settings.deleteAfterRestore.no': 'Keep in NiceTab (recommended)',
  'settings.discardWhenOpenTabs': 'Put tabs to sleep when opening a group?',
  'settings.silentOpenTabModifierKey': 'Hold this key to open a tab in the background',
  'settings.openTabModifierKey': 'Hold this key to open and switch to a tab',
  'settings.openTabModifierKey.tooltip':
    'If both actions use the same key, NiceTab opens the tab and switches to it.',
  'settings.openingTabsOrder': 'Order when opening multiple tabs',
  'settings.unnamedGroupRestoreAsGroup': 'Open unnamed groups as browser tab groups?',
  'settings.namedGroupRestoreAsGroup': 'Open named groups as browser tab groups?',

  /* 当前窗口标签页排序配置 */
  'settings.tabSortDomainOrderMode': 'Site order when sorting tabs{mark}',
  'settings.tabSortDomainOrderMode.tooltip':
    'Sort unpinned tabs by site, then by title within each site. Browser tab groups, including Vivaldi Tab Stacks, are sorted internally; tabs never move between groups.',
  'settings.tabSortDomainOrderMode.alphabetical': 'Alphabetical (recommended)',
  'settings.tabSortDomainOrderMode.custom': 'Custom site priority',
  'settings.tabSortCustomDomainList': 'Site priority list',
  'settings.tabSortCustomDomainList.tooltip':
    'Enter one domain per line. A root domain such as example.com includes its subdomains; a full hostname such as docs.example.com matches only that site. Other sites follow alphabetically.',
  'settings.tabSortCustomDomainList.placeholder': 'example.com\ngithub.com',

  /* 页面标题配置 */
  'settings.pageTitleConfig': 'Title aliases',
  'settings.pageTitleConfig.drawerTitle': 'Title aliases',
  'settings.pageTitleConfig.description':
    'Change how titles appear in NiceTab without changing saved titles, copied links or exports. The first matching URL rule applies. Search finds both original titles and aliases. Remove a rule to show the original titles again.',
  'settings.pageTitleConfig.importPresets': 'Add entertainment site presets',
  'settings.pageTitleConfig.presetsAdded': 'Added {count} rules',
  'settings.pageTitleConfig.presetsExist': 'All preset rules are already added',
  'settings.pageTitleConfig.presetsFailed': 'Could not save rules. Please try again.',

  /* 全局搜索配置 */
  'settings.globalSearchDeleteAfterOpen': 'After opening a search result',
  'settings.globalSearchDeleteAfterOpen.yes': 'Remove from NiceTab (keep locked items)',
  'settings.globalSearchDeleteAfterOpen.no': 'Keep in NiceTab (recommended)',

  /* 其他操作配置 */
  'settings.deleteUnlockedEmptyGroup': 'When a group becomes empty',
  'settings.deleteUnlockedEmptyGroup.yes': 'Remove the group (keep locked groups)',
  'settings.deleteUnlockedEmptyGroup.no': 'Keep the group',
  'settings.confirmBeforeDeletingTabs': 'Ask before deleting saved tabs?',
  'settings.confirmBeforeDeletingGroups': 'Ask before deleting saved groups?',
  'settings.linkTemplate': 'Template for copied links',
  'settings.linkTemplate.placeholder': 'Default format',
  'settings.linkTemplate.tooltip': 'Customize copied links with a Mustache template.',
  'settings.tabCountThreshold': 'Use virtual scrolling above this tab count',
  'settings.tabCountThreshold.tooltip':
    'Above this number of saved tabs in a category, load only the visible part of the list as you scroll to keep it responsive.',
  'settings.groupInsertPosition': 'Where to place added or moved groups',
  'settings.groupInsertPosition.tooltip':
    'Place groups at the top or bottom of the destination category.',
  'settings.tabInsertPosition': 'Where to place added or moved tabs',
  'settings.tabInsertPosition.tooltip':
    'Place tabs at the top or bottom of the destination group.',

  /* 展示配置 */
  'settings.groupActionBtnStyle': 'Tab and group action buttons',
  'settings.groupActionBtnsCommonlyUsed': 'Quick actions for groups',
  'settings.groupActionBtnsCommonlyUsed.tooltip':
    'Show up to three selected actions beside each group. Other actions appear under More.',
  'settings.showOpenedTabCount': 'Show the open tab count on the extension icon?',
  'settings.showPageContextMenus': 'Show NiceTab in the page context menu?',
  'settings.contextMenuConfig': 'Context menu actions',
  'settings.contextMenuConfig.tooltip':
    'Choose actions and drag to reorder them. The first five appear in the main menu; the rest appear under More.',
  'settings.popupModuleDisplays': 'Extension popup sections',
  'settings.popupModuleDisplays.tooltip':
    'Clicking the extension icon shows the selected sections. If none are selected, clicking it saves all tabs in the current window instead.',
  'settings.autoExpandHomeTree': 'Expand all categories and groups on opening NiceTab?',
  'settings.newTabDisplay': 'New tab page',
  'settings.newTabDisplay.tooltip':
    'Choose what appears when you open a new tab. Select the browser default to stop using a NiceTab new tab page.',
  'settings.newTabDisplay.homePage': 'NiceTab saved tabs',
  'settings.newTabDisplay.niceNewtab': 'NiceTab new tab page',
  'settings.newTabDisplay.default': 'Browser default',
  'settings.pageWidthType': 'Content width',
  'settings.pageWidthType.fixed': 'Fixed width',
  'settings.pageWidthType.responsive': 'Fit the window',
  'settings.showTabTitleTooltip': 'Show the full title on hover?',

  /* 自动同步配置 */
  'settings.remoteSyncWithSettings': 'Include preferences when syncing saved tabs?',
  'settings.autoSync': 'Sync automatically?',
  'settings.autoSyncTimeUnit': 'Sync interval unit',
  'settings.autoSyncTimeUnit.m': 'Minutes',
  'settings.autoSyncTimeUnit.h': 'Hours',
  'settings.autoSyncInterval': 'Sync every ({unit})',
  'settings.autoSyncTimeRanges': 'Sync during these times',
  'settings.autoSyncTimeRanges.addRange': 'Add time range',
  'settings.autoSyncType': 'Sync method',
  'settings.autoSyncType.tooltip':
    'Merging combines local and remote data; it does not sync deletions. To apply local deletions remotely, use a manual upload that replaces remote data.',
  'settings.syncType.autoPullMerge': 'Automatic: download and merge',
  'settings.syncType.autoPullForce': 'Automatic: download and replace local data',
  'settings.syncType.autoPushMerge': 'Automatic: merge and upload',
  'settings.syncType.autoPushForce': 'Automatic: upload and replace remote data',
  'settings.syncType.manualPullMerge': 'Manual: download and merge',
  'settings.syncType.manualPullForce': 'Manual: download and replace local data',
  'settings.syncType.manualPushMerge': 'Manual: merge and upload',
  'settings.syncType.manualPushForce': 'Manual: upload and replace remote data',
};

export default enUS;
