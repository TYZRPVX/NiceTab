import { browser, Tabs } from 'wxt/browser';
import type { TabSortDomainOrderMode } from '~/entrypoints/types';

export interface TabSortRule {
  domainOrderMode: TabSortDomainOrderMode;
  customDomainList: string[];
}

export interface TabSortResult {
  sortedRunCount: number;
  sortedTabCount: number;
  sortableTabCount: number;
}

// chrome/edge 中未分组的 tab groupId 为 -1（TAB_GROUP_ID_NONE），firefox 不支持 tabGroups 时该字段为 undefined
const TAB_GROUP_ID_NONE = -1;
const TAB_MOVE_RETRY_COUNT = 3;
const TAB_MOVE_RETRY_DELAY = 80;

// 取完整 hostname。排序按站点而非 eTLD+1 分组，避免 confluence.shopee.io 与 compass.llm.shopee.io 混在同一组。
export function getSortDomain(url?: string): string {
  if (!url) return '';
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== 'http:' && protocol !== 'https:') return '';
    return hostname.toLowerCase();
  } catch {
    return '';
  }
}

function normalizeDomain(value: string): string {
  const trimmedValue = value.trim().toLowerCase();
  if (!trimmedValue) return '';

  try {
    const valueWithProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmedValue)
      ? trimmedValue
      : `https://${trimmedValue}`;
    return new URL(valueWithProtocol).hostname;
  } catch {
    return trimmedValue.replace(/\.$/, '');
  }
}

// 将设置中存储的换行分隔字符串解析为有序域名数组
export function parseCustomDomainList(raw?: string): string[] {
  if (!raw) return [];
  return raw.split('\n').map(normalizeDomain).filter(Boolean);
}

function getDomainRank(domain: string, rule: TabSortRule): number {
  if (rule.domainOrderMode === 'custom') {
    const index = rule.customDomainList.findIndex(
      customDomain => domain === customDomain || domain.endsWith(`.${customDomain}`),
    );
    if (index !== -1) return index;
  }
  return Infinity;
}

function compareCandidateTabs(a: Tabs.Tab, b: Tabs.Tab, rule: TabSortRule): number {
  const domainA = getSortDomain(a.url);
  const domainB = getSortDomain(b.url);

  const rankA = getDomainRank(domainA, rule);
  const rankB = getDomainRank(domainB, rule);
  if (rankA !== rankB) return rankA - rankB;

  if (!domainA || !domainB) {
    if (!domainA && domainB) return 1;
    if (domainA && !domainB) return -1;
  }

  if (domainA !== domainB) return domainA.localeCompare(domainB);

  const titleA = a.title || a.url || '';
  const titleB = b.title || b.url || '';
  const titleOrder = titleA.localeCompare(titleB);
  return titleOrder || a.index - b.index;
}

// 固定 tab 不参与排序；原生 tab group / Vivaldi Tab Stack 在独立范围内排序，绝不跨组移动。
function isSortCandidate(tab: Tabs.Tab): boolean {
  return !tab.pinned;
}

function getSortScopeKey(tab: Tabs.Tab): string {
  const groupId = (tab as { groupId?: number }).groupId;
  if (groupId === undefined || groupId === TAB_GROUP_ID_NONE) return 'ungrouped';
  return `group:${groupId}`;
}

export function getTabSortRuns(tabs: Tabs.Tab[], rule: TabSortRule): Tabs.Tab[][] {
  const runs: Tabs.Tab[][] = [];
  let currentRun: Tabs.Tab[] = [];
  let previousIndex: number | undefined;
  let currentScopeKey: string | undefined;

  const appendCurrentRun = () => {
    if (currentRun.length > 1) {
      const sortedRun = [...currentRun].sort((a, b) => compareCandidateTabs(a, b, rule));
      const hasOrderChanged = sortedRun.some(
        (tab, index) => tab.id !== currentRun[index].id,
      );
      if (hasOrderChanged) runs.push(sortedRun);
    }
    currentRun = [];
    previousIndex = undefined;
    currentScopeKey = undefined;
  };

  [...tabs]
    .sort((a, b) => a.index - b.index)
    .forEach(tab => {
      if (!isSortCandidate(tab)) {
        appendCurrentRun();
        return;
      }

      const scopeKey = getSortScopeKey(tab);
      if (
        previousIndex !== undefined &&
        (tab.index !== previousIndex + 1 || scopeKey !== currentScopeKey)
      ) {
        appendCurrentRun();
      }

      currentRun.push(tab);
      previousIndex = tab.index;
      currentScopeKey = scopeKey;
    });

  appendCurrentRun();
  return runs;
}

function isTabsBusyError(error: unknown): boolean {
  return String(error).toLowerCase().includes('tabs cannot be edited right now');
}

async function moveTabRun(tabIds: number[], index: number): Promise<void> {
  for (let attempt = 0; attempt < TAB_MOVE_RETRY_COUNT; attempt += 1) {
    try {
      await browser.tabs.move(tabIds, { index });
      return;
    } catch (error) {
      if (!isTabsBusyError(error) || attempt === TAB_MOVE_RETRY_COUNT - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, TAB_MOVE_RETRY_DELAY));
    }
  }
}

// 对最后活跃浏览器窗口内的非 pinned tab 按规则重新排序；每个原生分组保持独立，绝不跨组移动。
export async function sortCurrentWindowTabs(rule: TabSortRule): Promise<TabSortResult> {
  const [activeTab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
  if (activeTab?.windowId === undefined) {
    throw new Error('No active tab found in the last focused browser window');
  }

  const allTabs = await browser.tabs.query({ windowId: activeTab.windowId });
  const sortableTabCount = allTabs.filter(isSortCandidate).length;
  const sortedRuns = getTabSortRuns(allTabs, rule);

  for (const sortedRun of sortedRuns) {
    const tabIds = sortedRun
      .map(tab => tab.id)
      .filter((id): id is number => id !== undefined);
    if (tabIds.length < 2) continue;

    const targetIndex = Math.min(...sortedRun.map(tab => tab.index));
    await moveTabRun(tabIds, targetIndex);
  }

  return {
    sortedRunCount: sortedRuns.length,
    sortedTabCount: sortedRuns.reduce((count, run) => count + run.length, 0),
    sortableTabCount,
  };
}

export default {
  getSortDomain,
  parseCustomDomainList,
  getTabSortRuns,
  sortCurrentWindowTabs,
};
