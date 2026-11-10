const zhCN = {
  'settings.block.common': '通用',
  'settings.block.sendTabs': '保存标签页',
  'settings.block.openTabs': '打开已保存标签页',
  'settings.block.tabSort': '标签页排序',
  'settings.block.pageTitleConfig': '标题别名',
  'settings.block.globalSearch': '全局搜索',
  'settings.block.otherActions': '其他操作',
  'settings.block.display': '显示与菜单',
  'settings.block.newtab': '新标签页',
  'settings.block.autoSync': '自动同步',
  'settings.block.sync': '同步',
  'settings.confirmTipContent': '更改尚未保存，仍要离开吗？',
  'settings.language': '语言{mark}',
  'settings.themeType': '主题{mark}',
  'settings.openAdminTabAfterBrowserLaunch': '启动浏览器时打开 NiceTab？',
  'settings.openAdminTabAfterBrowserLaunch.yes': '打开 NiceTab',
  'settings.openAdminTabAfterBrowserLaunch.no': '不自动打开',
  'settings.openAdminTabAfterWindowCreated': '新建窗口时打开 NiceTab？',
  'settings.openAdminTabAfterWindowCreated.yes': '打开 NiceTab',
  'settings.openAdminTabAfterWindowCreated.no': '不自动打开',
  'settings.autoPinAdminTab': '固定 NiceTab 管理页{mark}',
  'settings.autoPinAdminTab.yes': '固定在所在窗口（推荐）',
  'settings.autoPinAdminTab.no': '不固定',
  'settings.restoreSnapshotAfterBrowserLaunch': '启动时从快照恢复标签页？',
  'settings.autoCreateSnapshotInterval': '自动保存快照的间隔（分钟）',
  'settings.autoCleanupSavedGroups': '自动清理旧标签组？',
  'settings.autoCleanupSavedGroups.description':
    '每天检查所有分类，将超过保留期限的标签组移入回收站。星标组、锁定组及锁定分类中的组始终保留。按创建时间计算，打开或编辑不会延长期限；从回收站还原会重置创建时间。移入回收站后按回收站保留期限处理。',
  'settings.savedGroupRetentionDays': '标签组保留时间（1–3650 天）',
  'settings.recycleRetentionDays': '回收站保留时间（1–365 天）',

  /* 发送标签页配置 */
  'settings.showSendTargetModal': '每次保存时选择存放位置？',
  'settings.showSendTargetModal.tooltip':
    '关闭后，标签页直接保存到中转站。无法显示位置选择框的页面也会使用中转站。',
  'settings.allowSendPinnedTabs': '保存时包含固定标签页{mark}',
  'settings.allowSendPinnedTabs.yes': '包含固定标签页',
  'settings.allowSendPinnedTabs.no': '跳过固定标签页（推荐）',
  'settings.excludeDomainsForSending': '保存时跳过这些网站',
  'settings.excludeDomainsForSending.tooltip':
    '用空格或换行分隔多个域名，也支持正则表达式。',
  'settings.excludeDomainsForSending.placeholder': '输入域名，用空格或换行分隔',
  'settings.openAdminTabAfterSendTabs':
    '保存后显示 NiceTab（保存全部标签页时始终显示）{mark}',
  'settings.openAdminTabAfterSendTabs.yes': '显示 NiceTab',
  'settings.openAdminTabAfterSendTabs.no': '不切换到 NiceTab',
  'settings.closeTabsAfterSendTabs': '保存标签页后{mark}',
  'settings.closeTabsAfterSendTabs.yes': '关闭原标签页',
  'settings.closeTabsAfterSendTabs.no': '保留原标签页',
  'settings.keepAudibleTabsOpen': '正在播放声音的标签页{mark}',
  'settings.keepAudibleTabsOpen.tooltip':
    '保存后需要关闭标签页时，保留正在发声的标签页；它们仍会保存到 NiceTab。已静音的标签页和无声视频不受此保护。',
  'settings.keepAudibleTabsOpen.yes': '保留打开（推荐）',
  'settings.keepAudibleTabsOpen.no': '按关闭设置处理',
  'settings.actionAutoCloseFlags': '仅在执行以下操作后关闭原标签页',
  'settings.actionAutoCloseFlags.tooltip':
    '仅在上方选择“保留原标签页”时生效。勾选的操作会在保存后关闭原标签页，仍遵循播放声音标签页的保护设置。',
  'settings.createNewGroupOnSendSingleTab': '保存单个标签页时新建标签组？',
  'settings.createNewGroupOnSendSingleTab.tooltip':
    '关闭后，使用目标分类中第一个未星标且未锁定的标签组；没有符合条件的组时新建。手动指定的标签组优先。',
  'settings.allowDuplicateTabs': '保存或合并时的重复标签页{mark}',
  'settings.allowDuplicateTabs.yes': '保留重复项',
  'settings.allowDuplicateTabs.no': '按网址去重',
  'settings.allowDuplicateGroups': '保存时遇到同名标签组{mark}',
  'settings.allowDuplicateGroups.yes': '保留独立标签组',
  'settings.allowDuplicateGroups.no': '在目标分类内合并',

  /* 打开标签页配置 */
  'settings.restoreInNewWindow': '在新窗口打开标签组{mark}',
  'settings.deleteAfterRestore': '打开已保存标签页后{mark}',
  'settings.deleteAfterRestore.yes': '从 NiceTab 移除（保留锁定项）',
  'settings.deleteAfterRestore.no': '保留在 NiceTab（推荐）',
  'settings.discardWhenOpenTabs': '批量打开标签页时启用休眠{mark}',
  'settings.silentOpenTabModifierKey': '按住此键点击，在后台打开标签页',
  'settings.openTabModifierKey': '按住此键点击，打开并切换到标签页',
  'settings.openTabModifierKey.tooltip':
    '两种打开方式使用相同按键时，会打开并切换到该标签页。',
  'settings.openingTabsOrder': '批量打开标签页的顺序',
  'settings.unnamedGroupRestoreAsGroup': '将未命名标签组打开为浏览器标签组？',
  'settings.namedGroupRestoreAsGroup': '将已命名标签组打开为浏览器标签组？',

  /* 当前窗口标签页排序配置 */
  'settings.tabSortDomainOrderMode': '标签页排序时的网站顺序{mark}',
  'settings.tabSortDomainOrderMode.tooltip':
    '按完整网站域名分组，组内按标题升序排列。浏览器标签组（包括 Vivaldi Tab Stack）仅在组内排序，不跨组移动；固定标签页不参与。',
  'settings.tabSortDomainOrderMode.alphabetical': '按域名字母排序（推荐）',
  'settings.tabSortDomainOrderMode.custom': '自定义网站优先级',
  'settings.tabSortCustomDomainList': '网站优先级列表',
  'settings.tabSortCustomDomainList.tooltip':
    '每行一个域名。主域名（如 example.com）包含其子域名；完整域名（如 docs.example.com）仅匹配该网站。未列出的网站按字母顺序排在后面。',
  'settings.tabSortCustomDomainList.placeholder': 'example.com\ngithub.com',

  /* 页面标题配置 */
  'settings.pageTitleConfig': '标题别名',
  'settings.pageTitleConfig.drawerTitle': '标题别名',
  'settings.pageTitleConfig.description':
    '自定义标题在 NiceTab 中的显示方式，不改变已保存的标题、复制链接或导出内容。首个匹配网址的规则生效，搜索同时匹配原始标题与别名。删除规则后恢复原始显示。',
  'settings.pageTitleConfig.importPresets': '添加休闲网站预设',
  'settings.pageTitleConfig.presetsAdded': '已新增 {count} 条规则',
  'settings.pageTitleConfig.presetsExist': '所有预设规则均已添加',
  'settings.pageTitleConfig.presetsFailed': '规则保存失败，请重试',

  /* 全局搜索配置 */
  'settings.globalSearchDeleteAfterOpen': '打开搜索结果后',
  'settings.globalSearchDeleteAfterOpen.yes': '从 NiceTab 移除（保留锁定项）',
  'settings.globalSearchDeleteAfterOpen.no': '保留在 NiceTab（推荐）',

  /* 其他操作配置 */
  'settings.deleteUnlockedEmptyGroup': '清空标签组后{mark}',
  'settings.deleteUnlockedEmptyGroup.yes': '删除空组（保留锁定组）',
  'settings.deleteUnlockedEmptyGroup.no': '保留空组',
  'settings.confirmBeforeDeletingTabs': '删除已保存标签页前确认？',
  'settings.confirmBeforeDeletingGroups': '删除已保存标签组前确认？',
  'settings.linkTemplate': '复制链接的格式模板',
  'settings.linkTemplate.placeholder': '默认格式',
  'settings.linkTemplate.tooltip': '使用 Mustache 模板自定义复制链接的格式。',
  'settings.tabCountThreshold': '启用虚拟滚动的标签页数量',
  'settings.tabCountThreshold.tooltip':
    '分类中的已保存标签页超过此数量后，仅渲染滚动位置附近的列表内容，以保持操作流畅。',
  'settings.groupInsertPosition': '新增或移动标签组的位置',
  'settings.groupInsertPosition.tooltip': '将标签组放在目标分类的顶部或底部。',
  'settings.tabInsertPosition': '新增或移动标签页的位置',
  'settings.tabInsertPosition.tooltip': '将标签页放在目标标签组的顶部或底部。',

  /* 展示配置 */
  'settings.groupActionBtnStyle': '标签页与标签组的按钮样式',
  'settings.groupActionBtnsCommonlyUsed': '标签组快捷操作',
  'settings.groupActionBtnsCommonlyUsed.tooltip':
    '每个标签组旁最多显示三个选中的操作，其余操作收起到“更多”菜单。',
  'settings.showOpenedTabCount': '在扩展图标上显示已打开标签页数量？',
  'settings.showPageContextMenus': '在网页右键菜单中显示 NiceTab？',
  'settings.contextMenuConfig': '右键菜单操作',
  'settings.contextMenuConfig.tooltip':
    '勾选要显示的操作，拖动调整顺序。前五项直接显示，其余收起到“更多”菜单。',
  'settings.popupModuleDisplays': '扩展弹出面板内容',
  'settings.popupModuleDisplays.tooltip':
    '点击扩展图标时显示选中的内容。如果全部取消勾选，点击图标将直接保存当前窗口的全部标签页。',
  'settings.autoExpandHomeTree': '打开列表时展开全部分类和标签组？',
  'settings.newTabDisplay': '新标签页内容',
  'settings.newTabDisplay.tooltip':
    '选择新建标签页时显示的内容。选择浏览器默认页面可停用 NiceTab 新标签页。',
  'settings.newTabDisplay.homePage': 'NiceTab 已保存标签页',
  'settings.newTabDisplay.niceNewtab': 'NiceTab 新标签页',
  'settings.newTabDisplay.default': '浏览器默认页面',
  'settings.pageWidthType': '内容区宽度',
  'settings.pageWidthType.fixed': '固定宽度',
  'settings.pageWidthType.responsive': '随窗口调整',
  'settings.showTabTitleTooltip': '悬停时显示完整标题？',

  /* 同步配置 */
  'settings.remoteSyncWithSettings': '同步已保存标签页时包含偏好设置？',
  'settings.autoSync': '开启自动同步？',
  'settings.autoSyncTimeUnit': '同步间隔单位',
  'settings.autoSyncTimeUnit.m': '分钟',
  'settings.autoSyncTimeUnit.h': '小时',
  'settings.autoSyncInterval': '同步间隔（{unit}）',
  'settings.autoSyncTimeRanges': '自动同步时段',
  'settings.autoSyncTimeRanges.addRange': '添加时段',
  'settings.autoSyncType': '同步方式',
  'settings.autoSyncType.tooltip':
    '合并会汇总本地与远程数据，不会同步删除操作。如需将本地删除结果同步到远程，请手动上传并覆盖远程数据。',
  'settings.syncType.autoPullMerge': '自动：下载并合并到本地',
  'settings.syncType.autoPullForce': '自动：下载并覆盖本地数据',
  'settings.syncType.autoPushMerge': '自动：合并后上传',
  'settings.syncType.autoPushForce': '自动：上传并覆盖远程数据',
  'settings.syncType.manualPullMerge': '手动：下载并合并到本地',
  'settings.syncType.manualPullForce': '手动：下载并覆盖本地数据',
  'settings.syncType.manualPushMerge': '手动：合并后上传',
  'settings.syncType.manualPushForce': '手动：上传并覆盖远程数据',
};

export type LocaleKey = keyof typeof zhCN;

export default zhCN;
