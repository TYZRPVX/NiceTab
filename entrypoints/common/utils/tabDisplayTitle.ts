import type { PageTitleConfigItem } from '~/entrypoints/types';
import { isContentMatched } from './url';

/** Display-only alias. Never mutate or persist the supplied tab. */
export function resolveTabDisplayTitle(
  tab: { title?: string; url?: string },
  rules: readonly PageTitleConfigItem[] = [],
): string {
  if (tab.url) {
    for (const rule of rules) {
      if (rule.url && rule.title && isContentMatched(tab.url, rule.url, rule.mode)) {
        return rule.title;
      }
    }
  }
  return tab.title || tab.url || '';
}

export function matchesTabSearch(
  tab: { title?: string; url?: string },
  searchText: string,
  rules: readonly PageTitleConfigItem[] = [],
): boolean {
  const text = searchText.trim().toLowerCase();
  return (
    !text ||
    !!tab.title?.toLowerCase().includes(text) ||
    !!tab.url?.toLowerCase().includes(text) ||
    resolveTabDisplayTitle(tab, rules).toLowerCase().includes(text)
  );
}
