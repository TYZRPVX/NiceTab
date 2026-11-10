import { LocaleKey } from './zhCN';

const zhTW: Record<LocaleKey, string> = {
  'sync.settings': '同步設定',
  'sync.autoSync': '自動同步',
  'sync.syncing': '正在同步',
  'sync.noAccessToken': '請先新增存取權杖。',
  'sync.noGithubToken': '請先新增 GitHub 存取權杖。',
  'sync.noGiteeToken': '請先新增 Gitee 存取權杖。',
  'sync.syncType.auto': '自動同步',
  'sync.syncType.autoPullMerge': '自動：下載並合併至本機',
  'sync.syncType.autoPullForce': '自動：下載並覆寫本機資料',
  'sync.syncType.autoPushMerge': '自動：合併後上傳',
  'sync.syncType.autoPushForce': '自動：上傳並覆寫遠端資料',
  'sync.syncType.manualPullMerge': '手動：下載並合併至本機',
  'sync.syncType.manualPullForce': '手動：下載並覆寫本機資料',
  'sync.syncType.manualPushMerge': '手動：合併後上傳',
  'sync.syncType.manualPushForce': '手動：上傳並覆寫遠端資料',
  'sync.lastSyncTime': '上次同步時間',
  'sync.lastSyncType': '上次同步方式',
  'sync.lastSyncResult': '上次同步結果',
  'sync.syncTime': '同步時間',
  'sync.syncType': '同步方式',
  'sync.syncResult': '同步結果',
  'sync.actionTip': '確認同步操作',
  'sync.actionTip.manualPullForce':
    '以遠端資料覆寫本機資料？僅存在於本機的項目將被移除。',
  'sync.actionTip.manualPushForce':
    '以本機資料覆寫遠端資料？僅存在於遠端的項目將被移除。',
  'sync.tip.auto': '自動合併本機與遠端資料，再上傳合併結果。',
  'sync.tip.autoPullMerge': '自動下載遠端資料並合併至本機。',
  'sync.tip.autoPullForce': '自動以遠端資料覆寫本機資料。',
  'sync.tip.autoPushMerge': '自動合併本機與遠端資料，再上傳合併結果。',
  'sync.tip.autoPushForce': '自動以本機資料覆寫遠端資料。',
  'sync.tip.manualPullMerge': '下載遠端資料並合併至本機。',
  'sync.tip.manualPullForce': '以遠端資料覆寫本機資料。',
  'sync.tip.manualPushMerge': '合併本機與遠端資料，再上傳合併結果。',
  'sync.tip.manualPushForce': '以本機資料覆寫遠端資料。',
  'sync.tip.resetStatus': '重設同步狀態',
  'sync.tip.tokenChange': '變更存取權杖會清空此裝置上的 {type} 同步紀錄。',
  // "sync.tip.contentTooLarge": "遠程文件内容太大，返回的内容被 gist API 截斷了，取消合併到本地",
  'sync.tip.syncHistory': '保留最近 50 筆同步紀錄，也可隨時手動清空。',
  'sync.tip.supportTip':
    '在裝置間同步已儲存分頁。如需同時同步偏好設定，請在設定中啟用「同步已儲存分頁時包含偏好設定」。',
  'sync.getYourToken': '取得或管理存取權杖',
  'sync.syncHistory': '同步紀錄',
  'sync.noSyncHistory': '尚無同步紀錄',
  'sync.clearSyncHistory': '清空同步紀錄',
  'sync.removeDesc': '刪除此同步設定？',
  'sync.noWebdavConnectionUrl': '請先填寫 WebDAV 伺服器網址。',
  'sync.pushToAllRemotes': '覆寫所有遠端儲存空間的資料',
  'sync.reason.contentTooLarge': '檔案過大，Gist API 傳回的內容不完整，已取消合併。',
  'sync.reason.authFailed': '驗證失敗，請檢查認證資訊。',
  'sync.connectionName': '連線名稱',
  'sync.connectionUrl': 'WebDAV 伺服器網址',
  'sync.username': '使用者名稱',
  'sync.password': '密碼',
  'sync.addConfig': '新增連線',
  'sync.tip.connectionName': '為此 WebDAV 連線設定一個容易辨識的名稱。',
  'sync.tip.directory':
    'WebDAV 伺服器上的資料夾，支援多層路徑，例如 <strong>/dir/subdir</strong>。',
  'sync.tip.filename':
    '同步檔案名稱，例如 <strong>nicetab-sync.txt</strong>，可使用任意副檔名。',

  // 備份相關
  'sync.bakFilename': '備份檔案名稱',
  'sync.tip.bakFilenameGists': '用於資料還原的遠端備份檔案名稱。',
  'sync.bakDirectory': '備份資料夾',
  'sync.tip.bakDirectory':
    'WebDAV 伺服器上的備份資料夾，例如 <strong>/dir/subdir</strong>。',
};

export default zhTW;
