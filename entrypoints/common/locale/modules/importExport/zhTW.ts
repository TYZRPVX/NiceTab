import { LocaleKey } from './zhCN';

const zhTW: Record<LocaleKey, string> = {
  'importExport.import': '匯入',
  'importExport.export': '匯出',
  'importExport.moduleTitle':
    '{action, select, import {匯入分頁} export {匯出分頁} other {匯入與匯出分頁}}',
  'importExport.formatType':
    '{action, select, import {匯入格式} export {匯出格式} other {格式}}',
  'importExport.formatType.optionLabel': '{label}',
  'importExport.importMode': '匯入方式',
  'importExport.importMode.optionLabel':
    '{label, select, Append {新增項目} Overwrite {覆寫現有資料} Merge {與現有資料合併} other {新增項目}}',
  'importExport.importContent': '匯入內容',
  'importExport.importFromText': '從文字匯入',
  'importExport.importFromFile': '從檔案匯入',
  'importExport.importFromHTML': '從 HTML 匯入',
  'importExport.importSuccess': '匯入完成',
  'importExport.importFailed': '匯入失敗，請確認內容是否符合所選格式。',
  'importExport.settingsModuleTitle': '匯入與匯出偏好設定',
  'importExport.exportContent': '匯出內容',
  'importExport.getContent': '產生匯出內容',
  'importExport.copy': '複製到剪貼簿',
  'importExport.exportToFile': '下載檔案',
  'importExport.saveAsHtml': '儲存為 HTML',
  'importExport.CopySuccess': '已複製到剪貼簿',
  'importExport.CopyFailed': '複製失敗',
};

export default zhTW;
