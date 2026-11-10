import { LocaleKey } from './zhCN';

const enUS: Record<LocaleKey, string> = {
  'home.tag': 'Category',
  'home.tabGroup': 'Tab group',
  'home.tab': 'Tab',
  'home.stagingArea': 'Staging area',
  'home.tabGroupList': 'Saved groups',
  'home.date.today': 'Today',
  'home.date.yesterday': 'Yesterday',
  'home.date.unknown': 'Unknown date',
  'home.date.starred': 'Starred',
  'home.expand': 'Expand {name}',
  'home.collapse': 'Collapse {name}',
  'home.expandAll': 'Expand all',
  'home.collapseAll': 'Collapse all',
  'home.addTag': 'New category',
  'home.clearAll': 'Clear all',
  'home.recoverAll': 'Restore all',
  'home.emptyTip': 'Nothing here yet',
  'home.searchTagAndGroup': 'Search categories and groups',
  'home.searchTabAndUrl': 'Search titles and URLs',
  'home.moveAllGroupTo': 'Move all groups to…',
  'home.createTabGroup': 'New tab group',
  'home.helpInfo': 'Help',
  'home.removeTitle': 'Delete item?',
  'home.removeDesc': 'Delete this {type}?',
  'home.clearTitle': 'Clear this list?',
  'home.clearDesc': 'Delete all items in this list?',
  'home.dedupTitle': 'Remove duplicates?',
  'home.dedupDesc': 'Remove duplicate items from this list?',
  'home.recoverTitle': 'Restore item?',
  'home.recoverDesc': 'Restore this {type} to your saved tabs?',
  'home.recoverAllDesc': 'Restore all items from the recycle bin?',
  'home.copyLinks': 'Copy links',

  'home.tag.remove': 'Delete category',
  'home.tag.recover': 'Restore',
  'home.tag.countInfo': 'Category totals',
  'home.tag.lock': 'Lock category',
  'home.tag.unlock': 'Unlock category',
  'home.tag.open': 'Open tabs in category',

  'home.tabGroup.add': 'New tab group',
  'home.tabGroup.remove': 'Delete group',
  'home.tabGroup.restore': 'Open tabs',
  'home.tabGroup.lock': 'Lock group',
  'home.tabGroup.unlock': 'Unlock group',
  'home.tabGroup.star': 'Star group',
  'home.tabGroup.unstar': 'Unstar group',
  'home.tabGroup.recover': 'Restore',
  'home.tabGroup.open': 'Open tabs in group',
  'home.tabGroup.addGroupBefore': 'New group above',
  'home.tabGroup.addGroupAfter': 'New group below',
  'home.tabGroup.tabsSortAsc': 'Sort titles A–Z',
  'home.tabGroup.tabsSortDesc': 'Sort titles Z–A',

  'home.tabGroup.count': '{count, plural, =0 {No groups} one {# group} other {# groups}}',
  'home.tabGroup.name': 'Group name',
  'home.tabGroup.createTime': 'Created',
  'home.tab.count': '{count, plural, =0 {No tabs} one {# tab} other {# tabs}}',
  'home.tab.selectedCount':
    '{count, plural, =0 {No tabs selected} one {# tab selected} other {# tabs selected}}',
  'home.tab.name': 'Name',
  'home.tab.url': 'URL',
  'home.tab.removeSelected': `Are you sure you want to remove {count, plural,
    =0 {no tabs}
    one {the tab}
    other {these # tabs}
  }?`,

  'home.createSnapshot': 'Save snapshot',
  'home.createSnapshot.tip': 'Save a snapshot of the currently open tabs',
  'home.restoreSnapshot': 'Restore snapshot',

  'home.getPermission.tabGroups': 'Allow browser tab group access',
  'home.getPermission.tabGroups.tip':
    'Allow NiceTab to work with your browser’s tab groups.',

  'home.displayPinnedTabs': 'Show pinned tabs',

  'home.help.tip.userGuide': 'For more information, please refer to the {userGuide}.',
  'home.help.reminder.start':
    'For security reasons, Firefox may not allow privileged URLs such as:',
  'home.help.reminder.list': `
    <li>chrome: URLs</li>
    <li>javascript: URLs</li>
    <li>data: URLs</li>
    <li>file: URLs</li>
    <li>Firefox's privileged about: URLs (e.g. about:config, about:addons, about:debugging). Non-privileged URLs (e.g. about:blank) are allowed.</li>
  `,
  'home.help.reminder.end':
    'If the URL of a page matches any of the above cases, opening the tab may not work. Please manually copy the URL to open it.',

  'home.help.content':
    '<li>Use the sidebar to browse categories and groups. The middle list shows saved tabs in the selected category. The panel on the right shows tabs open in the current browser window.</li><li>Drag saved tabs to reorder them or move them between groups. Drag onto a group in the sidebar to move across categories, or use “Move to”.</li><li>Drag open tabs or entire browser groups from the right panel into your saved list. You can select several tabs at once.</li><li>Locked groups protect their saved tabs from deletion or removal. You can still add tabs to them. Unlock a group before deleting it.</li><li>Starred groups stay above other groups in their category. Moving a group into or out of the starred section changes its star status.</li><li>The Staging area stays at the top of the sidebar. Tabs are saved there unless you choose another destination.</li><li>Opening a saved group opens its tabs in the browser. Your settings control whether those entries stay in NiceTab afterward; locked entries are kept.</li><li><strong>Click</strong> to open a tab and switch to it. <strong>Alt + click</strong> opens it in the background by default. You can change these keys in Settings.</li><li>Group sorting applies to unstarred groups in the selected category. You can also reorder categories and groups by dragging or using the shortcuts below.</li>',
  'home.help.hotkey.1':
    'These shortcuts work on the saved tabs page. Browser-wide shortcuts are also available for actions such as',
  'home.help.hotkey.2': '. To change them, open the browser’s extension settings and ',
  'home.help.hotkey.modify': 'edit keyboard shortcuts',
  'home.help.hotkey.modifyTip':
    'Shortcut changes take effect immediately. Switch browser tabs to refresh shortcut labels in the context menu.',

  'home.moveTo.missingTip': 'Choose a {type}',
  'home.moveTo.copyLabel': 'Copy instead of move',
  'home.moveTo.copyTip':
    'Keep the originals and add copies to the destination category or group.',
  'home.moveTo.mergeLabel': 'Merge duplicates',
  'home.moveTo.mergeTip.1':
    'When moving tabs, merge matching URLs in the destination group.',
  'home.moveTo.mergeTip.2':
    'When moving groups, merge groups with the same name in the destination category.',
  'home.tip.tooManyTabs': 'This large list loads as you scroll.',
  'home.tip.addScope':
    'The next version will add new features that require additional authorization. Once the new version is released, the NiceTab extension will be automatically disabled. If you want to continue using it, please manually enable it.',
  'home.tip.multiSelection':
    'Shift-click the first item, then Shift-click the last item to select a range. This also works in the saved tab list.',
};

export default enUS;
