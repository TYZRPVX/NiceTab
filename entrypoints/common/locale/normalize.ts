import type { LanguageTypes } from '~/entrypoints/types';

// Browser locales and imported settings share one canonical language policy.
export function normalizeLanguage(value: unknown): LanguageTypes {
  if (typeof value !== 'string') return 'en-US';
  let locale: Intl.Locale;
  try {
    locale = new Intl.Locale(value.trim().replaceAll('_', '-'));
  } catch {
    return 'en-US';
  }
  const parts = locale.baseName.toLowerCase().split('-');
  if (parts[0] !== 'zh') return 'en-US';
  if (parts.includes('hans')) return 'zh-CN';
  if (parts.includes('hant')) return 'zh-TW';
  return parts.some(part => ['tw', 'hk', 'mo'].includes(part)) ? 'zh-TW' : 'zh-CN';
}
