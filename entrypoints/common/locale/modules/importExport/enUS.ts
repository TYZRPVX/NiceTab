import { LocaleKey } from './zhCN';

const enUS: Record<LocaleKey, string> = {
  'importExport.import': 'Import',
  'importExport.export': 'Export',
  'importExport.moduleTitle':
    '{action, select, import {Import tabs} export {Export tabs} other {Import and export tabs}}',
  'importExport.formatType':
    '{action, select, import {Import format} export {Export format} other {Format}}',
  'importExport.formatType.optionLabel': `{label}`,

  'importExport.importMode': 'Import mode',
  'importExport.importMode.optionLabel':
    '{label, select, Append {Add as new items} Overwrite {Replace existing data} Merge {Merge with existing data} other {Add as new items}}',
  'importExport.importContent': 'Content to import',
  'importExport.importFromText': 'Import from text',
  'importExport.importFromFile': 'Import from file',
  'importExport.importFromHTML': 'Import from HTML',
  'importExport.importSuccess': 'Import complete',
  'importExport.importFailed':
    'Could not import. Check that the content matches the selected format.',

  'importExport.exportContent': 'Content to export',
  'importExport.getContent': 'Generate export',
  'importExport.copy': 'Copy to clipboard',
  'importExport.exportToFile': 'Download file',
  'importExport.saveAsHtml': 'Save as HTML',
  'importExport.CopySuccess': 'Copied to clipboard',
  'importExport.CopyFailed': 'Could not copy',
  'importExport.settingsModuleTitle': 'Import and export preferences',
};

export default enUS;
