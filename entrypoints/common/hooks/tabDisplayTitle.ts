import { useCallback, useContext } from 'react';
import { GlobalContext } from './global';
import { resolveTabDisplayTitle } from '../utils/tabDisplayTitle';

/** Shares Root's existing settings subscription; no per-row listeners or cache. */
export function useTabDisplayTitle() {
  const { pageTitleConfig } = useContext(GlobalContext);
  return useCallback(
    (tab: { title?: string; url?: string }) =>
      resolveTabDisplayTitle(tab, pageTitleConfig),
    [pageTitleConfig],
  );
}
