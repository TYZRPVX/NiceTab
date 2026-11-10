import { LocaleKey } from './zhCN';

const zhTW: Record<LocaleKey, string> = {
  'home.tag': '分類',
  'home.tabGroup': '分頁群組',
  'home.tab': '分頁',
  'home.stagingArea': '中繼站',
  'home.tabGroupList': '已儲存群組',
  'home.date.today': '今天',
  'home.date.yesterday': '昨天',
  'home.date.unknown': '未知日期',
  'home.date.starred': '星標',
  'home.expand': '展開{name}',
  'home.collapse': '收合{name}',
  'home.expandAll': '全部展開',
  'home.collapseAll': '全部收合',
  'home.addTag': '新增分類',
  'home.clearAll': '清空全部',
  'home.recoverAll': '全部還原',
  'home.emptyTip': '尚無內容',
  'home.searchTagAndGroup': '搜尋分類與群組',
  'home.searchTabAndUrl': '搜尋標題與網址',
  'home.moveAllGroupTo': '移動全部群組至…',
  'home.createTabGroup': '新增分頁群組',
  'home.helpInfo': '使用說明',
  'home.removeTitle': '刪除項目？',
  'home.removeDesc': '確定刪除此{type}？',
  'home.clearTitle': '清空清單？',
  'home.clearDesc': '確定刪除此清單中的全部項目？',
  'home.dedupTitle': '移除重複項目？',
  'home.dedupDesc': '確定移除此清單中的重複項目？',
  'home.recoverTitle': '還原項目？',
  'home.recoverDesc': '將此{type}還原至已儲存清單？',
  'home.recoverAllDesc': '還原資源回收筒中的全部項目？',
  'home.copyLinks': '複製連結',

  'home.tag.remove': '刪除分類',
  'home.tag.recover': '還原',
  'home.tag.countInfo': '分類統計',
  'home.tag.lock': '鎖定分類',
  'home.tag.unlock': '解除鎖定分類',
  'home.tag.open': '開啟分類中的分頁',

  'home.tabGroup.add': '新增分頁群組',
  'home.tabGroup.remove': '刪除群組',
  'home.tabGroup.restore': '開啟群組內分頁',
  'home.tabGroup.lock': '鎖定群組',
  'home.tabGroup.unlock': '解除鎖定群組',
  'home.tabGroup.star': '為群組加上星號',
  'home.tabGroup.unstar': '移除群組星號',
  'home.tabGroup.recover': '還原',
  'home.tabGroup.open': '開啟群組內分頁',
  'home.tabGroup.addGroupBefore': '在上方新增群組',
  'home.tabGroup.addGroupAfter': '在下方新增群組',
  'home.tabGroup.tabsSortAsc': '依標題遞增排序',
  'home.tabGroup.tabsSortDesc': '依標題遞減排序',
  'home.tabGroup.count': '{count} 個群組',
  'home.tabGroup.name': '群組名稱',
  'home.tabGroup.createTime': '建立時間',
  'home.tab.count': '{count} 個分頁',
  'home.tab.name': '名稱',
  'home.tab.url': '網址',
  'home.tab.selectedCount': '已選取 {count} 個分頁',
  'home.tab.removeSelected': `您確定要刪除{count, plural,
    =0 {分頁}
    =1 {這個分頁}
    other {這#個分頁}
  }嗎？`,

  'home.createSnapshot': '儲存快照',
  'home.createSnapshot.tip': '為目前已開啟分頁儲存快照',
  'home.restoreSnapshot': '還原快照',
  'home.getPermission.tabGroups': '允許存取瀏覽器分頁群組',
  'home.getPermission.tabGroups.tip':
    '授權後，NiceTab 可以使用瀏覽器的原生分頁群組功能。',
  'home.displayPinnedTabs': '顯示釘選分頁',

  'home.help.tip.userGuide': '更多信息請檢視{userGuide}。',
  'home.help.reminder.start':
    '出於安全原因，在 Firefox 中，可能不允许使用特權 URL，例如：',
  'home.help.reminder.list': `
    <li>chrome: URLs</li>
    <li>javascript: URLs</li>
    <li>data: URLs</li>
    <li>file: URLs</li>
    <li>Firefox 的特權 about: URLs (e.g. about:config, about:addons, about:debugging). 非特權 URL（例如 about:blank）是允許的。</li>
  `,
  'home.help.reminder.end':
    '如果頁面連結符合上述場景，點擊連結可能無法開啟頁面，請手動複製連結進行訪問。',

  'home.help.content':
    '<li>左側瀏覽分類和群組，中間顯示所選分類的已儲存分頁，右側面板顯示目前瀏覽器視窗中開啟的分頁。</li><li>拖曳已儲存分頁可調整順序或跨群組移動；拖曳至左側群組可跨分類移動，也可使用「移動至」。</li><li>將右側已開啟的分頁或整個瀏覽器分頁群組拖入已儲存清單，即可儲存；支援一次選取多個分頁。</li><li>鎖定的群組會保護群組內分頁，防止刪除或移出，但仍可加入分頁。刪除群組前需先解除鎖定。</li><li>加上星號的群組排在分類頂端。將群組移入或移出星號區域，會相應加上或移除星號。</li><li>中繼站固定顯示在左側頂端。未指定其他位置時，分頁會儲存到中繼站。</li><li>開啟群組會在瀏覽器中開啟群組內分頁。是否繼續保留於 NiceTab 由設定決定；鎖定項目會保留。</li><li><strong>點擊</strong>開啟並切換至分頁；預設按住 <strong>Alt 再點擊</strong>可在背景開啟。可在設定中變更按鍵。</li><li>群組排序僅作用於目前分類中未加星號的群組。也可拖曳分類與群組，或使用下方快捷鍵調整順序。</li>',
  'home.help.hotkey.1': '以上快捷鍵在已儲存分頁中使用。部分操作另有瀏覽器快捷鍵，例如',
  'home.help.hotkey.2': '。如需調整，請前往瀏覽器的擴充功能設定',
  'home.help.hotkey.modify': '修改鍵盤快捷鍵',
  'home.help.hotkey.modifyTip':
    '快捷鍵變更後立即生效。切換瀏覽器分頁後，右鍵選單中的快捷鍵提示會更新。',

  'home.moveTo.missingTip': '請選擇{type}',
  'home.moveTo.copyLabel': '複製並保留原項目',
  'home.moveTo.copyTip': '保留原項目，在目標分類或群組中建立副本。',
  'home.moveTo.mergeLabel': '合併重複項目',
  'home.moveTo.mergeTip.1': '移動分頁時，合併目標群組中網址相同的分頁。',
  'home.moveTo.mergeTip.2': '移動群組時，合併目標分類中的同名群組。',
  'home.tip.tooManyTabs': '清單較長，會隨捲動顯示內容。',
  'home.tip.addScope':
    '下一個版本將添加快速鍵等功能，需要新增授權，新版本發布後可能會自動停用，如需繼續使用請手動起用。',
  'home.tip.multiSelection':
    '按住 Shift 點擊起始項，再按住 Shift 點擊結束項，即可選取整個範圍。已儲存分頁清單也支援此操作。',
};

export default zhTW;
