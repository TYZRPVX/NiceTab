const zhCN = {
  'home.tag': '分类',
  'home.tabGroup': '标签组',
  'home.tab': '标签页',
  'home.stagingArea': '中转站',
  'home.tabGroupList': '已保存标签组',
  'home.date.today': '今天',
  'home.date.yesterday': '昨天',
  'home.date.unknown': '未知日期',
  'home.date.starred': '星标',
  'home.expand': '展开{name}',
  'home.collapse': '折叠{name}',
  'home.expandAll': '全部展开',
  'home.collapseAll': '全部折叠',
  'home.addTag': '新建分类',
  'home.clearAll': '清空全部',
  'home.recoverAll': '全部还原',
  'home.emptyTip': '暂无内容',
  'home.searchTagAndGroup': '搜索分类和标签组',
  'home.searchTabAndUrl': '搜索标题和网址',
  'home.moveAllGroupTo': '移动全部标签组到…',
  'home.createTabGroup': '新建标签组',
  'home.helpInfo': '使用帮助',
  'home.removeTitle': '删除项目？',
  'home.removeDesc': '确定删除此{type}？',
  'home.clearTitle': '清空列表？',
  'home.clearDesc': '确定删除此列表中的全部项目？',
  'home.dedupTitle': '移除重复项？',
  'home.dedupDesc': '确定移除此列表中的重复项？',
  'home.recoverTitle': '还原项目？',
  'home.recoverDesc': '将此{type}还原到已保存列表？',
  'home.recoverAllDesc': '还原回收站中的全部项目？',
  'home.copyLinks': '复制链接',

  'home.tag.remove': '删除分类',
  'home.tag.recover': '还原',
  'home.tag.countInfo': '分类统计',
  'home.tag.lock': '锁定分类',
  'home.tag.unlock': '解锁分类',
  'home.tag.open': '打开分类中的标签页',

  'home.tabGroup.add': '新建标签组',
  'home.tabGroup.remove': '删除标签组',
  'home.tabGroup.restore': '打开组内标签页',
  'home.tabGroup.lock': '锁定标签组',
  'home.tabGroup.unlock': '解锁标签组',
  'home.tabGroup.star': '星标标签组',
  'home.tabGroup.unstar': '取消星标',
  'home.tabGroup.recover': '还原',
  'home.tabGroup.open': '打开组内标签页',
  'home.tabGroup.addGroupBefore': '在上方新建标签组',
  'home.tabGroup.addGroupAfter': '在下方新建标签组',
  'home.tabGroup.tabsSortAsc': '按标题升序排列',
  'home.tabGroup.tabsSortDesc': '按标题降序排列',

  'home.tabGroup.count': '{count} 个标签组',
  'home.tabGroup.name': '标签组名称',
  'home.tabGroup.createTime': '创建时间',
  'home.tab.count': '{count} 个标签页',
  'home.tab.name': '名称',
  'home.tab.url': '网址',
  'home.tab.selectedCount': '已选择 {count} 个标签页',
  'home.tab.removeSelected': `您确定要删除{count, plural,
    =0 {标签页}
    =1 {这个标签页}
    other {这#个标签页}
  }吗？`,

  'home.createSnapshot': '保存快照',
  'home.createSnapshot.tip': '为当前已打开标签页保存快照',
  'home.restoreSnapshot': '恢复快照',

  'home.getPermission.tabGroups': '允许访问浏览器标签组',
  'home.getPermission.tabGroups.tip': '授权后，NiceTab 可以使用浏览器的原生标签组功能。',

  'home.displayPinnedTabs': '显示固定标签页',

  'home.help.tip.userGuide': '更多信息请查看{userGuide}。',
  'home.help.reminder.start':
    '出于安全原因，在 Firefox 中，可能不允许使用特权 URL，例如：',
  'home.help.reminder.list': `
    <li>chrome: URL</li>
    <li>javascript: URL</li>
    <li>data: URL</li>
    <li>file: URL</li>
    <li>Firefox 的特权 about: URL（例如，about:config、about:addons、about:debugging）。非特权 URL（例如 about:blank）是允许的</li>
  `,
  'home.help.reminder.end':
    '如果页面链接符合上述场景，点击链接可能无法打开页面，请手动复制链接进行访问。',

  'home.help.content':
    '<li>左侧浏览分类和标签组，中间显示所选分类的已保存标签页，右侧面板显示当前浏览器窗口中打开的标签页。</li><li>拖动已保存标签页可调整顺序或跨组移动；拖到左侧标签组可跨分类移动，也可使用“移动到”。</li><li>将右侧已打开的标签页或整个浏览器标签组拖入已保存列表，即可保存；支持一次选择多个标签页。</li><li>锁定的标签组会保护组内标签页，防止删除或移出，但仍可加入标签页。删除标签组前需先解锁。</li><li>星标标签组排在分类顶部。将标签组移入或移出星标区域，会相应添加或取消星标。</li><li>中转站固定显示在左侧顶部。未指定其他位置时，标签页会保存到中转站。</li><li>打开标签组会在浏览器中打开组内标签页。是否继续保留在 NiceTab 中由设置决定；锁定项会保留。</li><li><strong>单击</strong>打开并切换到标签页；默认按住 <strong>Alt 再单击</strong>可在后台打开。可在设置中修改按键。</li><li>标签组排序仅作用于当前分类中未星标的组。也可拖动分类和标签组，或使用下方快捷键调整顺序。</li>',
  'home.help.hotkey.1': '以上快捷键在已保存标签页中使用。部分操作另有浏览器快捷键，例如',
  'home.help.hotkey.2': '。如需调整，请前往浏览器的扩展设置',
  'home.help.hotkey.modify': `修改快捷键`,
  'home.help.hotkey.modifyTip':
    '快捷键修改后立即生效。切换浏览器标签页后，右键菜单中的快捷键提示会更新。',

  'home.moveTo.missingTip': '请选择{type}',
  'home.moveTo.copyLabel': '复制，保留原项目',
  'home.moveTo.copyTip': '保留原项目，在目标分类或标签组中创建副本。',
  'home.moveTo.mergeLabel': '合并重复项',
  'home.moveTo.mergeTip.1': '移动标签页时，合并目标标签组中网址相同的标签页。',
  'home.moveTo.mergeTip.2': '移动标签组时，合并目标分类中的同名标签组。',
  'home.tip.tooManyTabs': '列表较长，将随滚动显示内容。',
  'home.tip.addScope':
    '下一个版本将添加快捷键等功能，需要新增授权，新版本发布后可能会自动停用，如需继续使用请手动启用。',
  'home.tip.multiSelection':
    '按住 Shift 点击起始项，再按住 Shift 点击结束项，即可选中整个范围。已保存标签页列表也支持此操作。',
};

export type LocaleKey = keyof typeof zhCN;

export default zhCN;
