const zhCN = {
  'importExport.import': '导入',
  'importExport.export': '导出',
  'importExport.moduleTitle':
    '{action, select, import {导入标签页} export {导出标签页} other {导入与导出标签页}}',
  'importExport.formatType':
    '{action, select, import {导入格式} export {导出格式} other {格式}}',
  'importExport.formatType.optionLabel': `{label}`,

  'importExport.importMode': '导入方式',
  'importExport.importMode.optionLabel':
    '{label, select, Append {新增项目} Overwrite {覆盖现有数据} Merge {与现有数据合并} other {新增项目}}',
  'importExport.importContent': '导入内容',
  'importExport.importFromText': '从文本导入',
  'importExport.importFromFile': '从文件导入',
  'importExport.importFromHTML': '从 HTML 导入',
  'importExport.importSuccess': '导入完成',
  'importExport.importFailed': '导入失败，请检查内容是否符合所选格式。',
  'importExport.settingsModuleTitle': '导入与导出偏好设置',

  'importExport.exportContent': '导出内容',
  'importExport.getContent': '生成导出内容',
  'importExport.copy': '复制到剪贴板',
  'importExport.exportToFile': '下载文件',
  'importExport.saveAsHtml': '保存为 HTML',
  'importExport.CopySuccess': '已复制到剪贴板',
  'importExport.CopyFailed': '复制失败',
};

export type LocaleKey = keyof typeof zhCN;

export default zhCN;
