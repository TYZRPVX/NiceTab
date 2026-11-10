import { Tabs } from 'wxt/browser';
import { debounce } from 'lodash-es';
import { settingsUtils, tabListUtils, stateUtils } from './storage';
import type {
  SettingsProps,
  ActionNames,
  SendTargetProps,
  SendTabMsgEventProps,
} from '~/entrypoints/types';
import {
  ENUM_SETTINGS_PROPS,
  defaultLanguage,
  USER_GUIDE_URL_MAP,
  CHANGELOG_URL_MAP,
} from '~/entrypoints/common/constants';
import {
  objectToUrlParams,
  setUrlParams,
  getRandomId,
  isGroupSupported,
  isDomainAllowed,
  sendRuntimeMessage,
} from '~/entrypoints/common/utils';
import { getCustomLocaleMessages } from '~/entrypoints/common/locale';

const {
  LANGUAGE,
  OPEN_ADMIN_TAB_AFTER_SEND_TABS,
  CLOSE_TABS_AFTER_SEND_TABS,
  KEEP_AUDIBLE_TABS_OPEN,
  ACTION_AUTO_CLOSE_FLAGS,
  AUTO_PIN_ADMIN_TAB,
  ALLOW_SEND_PINNED_TABS,
  EXCLUDE_DOMAINS_FOR_SENDING,
  RESTORE_IN_NEW_WINDOW,
  OPENING_TABS_ORDER,
} = ENUM_SETTINGS_PROPS;

// const matchUrls: string[] = ['https://*/*', 'http://*/*', 'chrome://*/*', 'file://*/*'];

// 向tab页发送消息
export async function sendTabMessage(
  {
    msgType,
    data,
    onlyCurrentTab = false,
    onlyCurrentWindow = false,
    sendToAdminTab = false,
  }: SendTabMsgEventProps,
  errorCallback?: () => void,
) {
  if (onlyCurrentTab) {
    const currentTabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentTab = currentTabs?.[0];

    if (currentTab?.id) {
      try {
        const res = await browser.tabs.sendMessage(currentTab?.id, { msgType, data });
        console.log('browser.tabs.sendMessage__result', res);
      } catch (error) {
        console.log('browser.tabs.sendMessage__error', error);
        errorCallback?.();
      }
    }
    return;
  }

  let windows = [];
  if (onlyCurrentWindow) {
    windows = [await browser.windows.getCurrent({ populate: true })];
  } else {
    windows = await browser.windows.getAll({ populate: true, windowTypes: ['normal'] });
  }

  for (const win of windows) {
    const { tab: adminTab } = await getAdminTabInfo(win.id);
    const allTabs = await getAllTabs(win.id);
    const filteredTabs = allTabs.filter(tab => {
      if (!tab?.id) return false;
      if (!sendToAdminTab && adminTab && adminTab.id === tab.id) return false;
      return true;
    });

    filteredTabs?.forEach(async tab => {
      try {
        const res = await browser.tabs.sendMessage(tab.id!, { msgType, data });
        console.log('browser.tabs.sendMessage__result', res);
      } catch (error) {
        console.log('browser.tabs.sendMessage__error', error);
      }
    });
  }
}
// 执行contentScript展示message提示
export async function executeContentScript(
  actionName: string,
  resultType: 'success' | 'error' = 'success',
) {
  const settings = await settingsUtils.getSettings();
  const language = settings[LANGUAGE] || defaultLanguage;
  const customMessages = getCustomLocaleMessages(language);
  const openAdminTabAfterSendTabs = settings[OPEN_ADMIN_TAB_AFTER_SEND_TABS];
  const closeTabsAfterSendTabs = settings[CLOSE_TABS_AFTER_SEND_TABS];
  const actionAutoCloseFlags = settings[ACTION_AUTO_CLOSE_FLAGS];

  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  const currentTab = tabs?.[0];
  const _actionName: ActionNames = actionName.replace('action:', '') as ActionNames;
  if (
    currentTab?.id &&
    !openAdminTabAfterSendTabs &&
    !closeTabsAfterSendTabs &&
    !actionAutoCloseFlags?.includes(_actionName)
  ) {
    const status = resultType === 'success' ? 'success' : 'failed';

    sendTabMessage({
      msgType: 'action:callback-message',
      data: {
        type: resultType,
        content: `${customMessages[`common.${status}`]}: ${
          customMessages[`common.${_actionName}` as keyof typeof customMessages]
        }`,
      },
      onlyCurrentTab: true,
    });
  }
}

let isBackgroundContext = false;
export function initializeAdminPageCoordinator() {
  isBackgroundContext = true;
}

// Only in-flight work is retained, one entry per busy window; entries expire on completion.
const adminPageTasks = new Map<number, Promise<void>>();

function inAdminWindow(windowId: number, task: () => Promise<void>) {
  const previous = adminPageTasks.get(windowId) || Promise.resolve();
  const next = previous.catch(() => undefined).then(task);
  adminPageTasks.set(windowId, next);
  void next
    .finally(() => {
      if (adminPageTasks.get(windowId) === next) adminPageTasks.delete(windowId);
    })
    .catch(() => undefined);
  return next;
}

function isExtensionPage(tab: Tabs.Tab, path: string) {
  const expected = new URL(browser.runtime.getURL(path));
  return [tab.pendingUrl, tab.url].some(value => {
    if (!value) return false;
    try {
      const url = new URL(value);
      // Extension URL origins can be opaque; compare protocol and host explicitly.
      return (
        url.protocol === expected.protocol &&
        url.host === expected.host &&
        url.pathname === expected.pathname
      );
    } catch {
      return false;
    }
  });
}

export function isAdminTab(tab: Tabs.Tab) {
  return isExtensionPage(tab, '/options.html');
}

// Reuse URL matching for both saving and displaying browser tabs; no extra queries or cache.
export function isNiceTabControlTab(tab: Tabs.Tab) {
  return isAdminTab(tab) || isExtensionPage(tab, '/command.html');
}

async function getAdminTabs(windowId: number) {
  return (await browser.tabs.query({ windowId }))
    .filter(isAdminTab)
    .sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) ||
        Number(b.active) - Number(a.active) ||
        a.index - b.index,
    );
}

function reportAdminError(
  operation: string,
  windowId: number,
  tabId: number | undefined,
  error: unknown,
) {
  const message = (error instanceof Error ? error.message : String(error)).replace(
    /[a-z][a-z0-9+.-]*:\/\/[^\s]+/gi,
    '[URL]',
  );
  console.error('NiceTab admin page', { operation, windowId, tabId, message });
}

async function closeDuplicateAdminTabs(windowId: number, keepId: number) {
  const keeper = await browser.tabs.get(keepId);
  if (keeper.windowId !== windowId || !isAdminTab(keeper)) return;
  for (const candidate of await getAdminTabs(windowId)) {
    if (candidate.id === undefined || candidate.id === keepId) continue;
    const current = await browser.tabs.get(candidate.id).catch(() => undefined);
    if (current?.windowId === windowId && isAdminTab(current)) {
      await browser.tabs.remove(candidate.id);
    }
  }
}

export async function deduplicateAdminPages(windowId: number) {
  // Opening already performs cleanup; do not enqueue one task for every update event.
  if (adminPageTasks.has(windowId)) return;
  await inAdminWindow(windowId, async () => {
    const [keeper] = await getAdminTabs(windowId);
    if (keeper?.id !== undefined) await closeDuplicateAdminTabs(windowId, keeper.id);
  });
}

export async function getAdminTabInfo(windowId?: number) {
  const targetWindowId = windowId ?? (await browser.windows.getCurrent()).id;
  const [tab] = targetWindowId === undefined ? [] : await getAdminTabs(targetWindowId);
  return { tab, adminTabUrl: browser.runtime.getURL('/options.html') };
}

// Open/reuse exactly one admin page in the captured window.
export async function openAdminRoutePage(
  route: { path: string; query?: Record<string, string> },
  needOpen = true,
  windowId?: number,
  refresh = false,
) {
  const targetWindowId = windowId ?? (await browser.windows.getCurrent()).id;
  if (targetWindowId === undefined) throw new Error('No target window');
  if (!isBackgroundContext) {
    const result = (await browser.runtime.sendMessage({
      msgType: 'openAdminRoutePage',
      data: { ...route, needOpen, windowId: targetWindowId, refresh },
    })) as { ok?: boolean } | undefined;
    if (!result?.ok) throw new Error('Could not open NiceTab admin page');
    return;
  }
  await inAdminWindow(targetWindowId, async () => {
    const settings = await settingsUtils.getSettings();
    const pinned = settings[AUTO_PIN_ADMIN_TAB] !== false;
    const paramsStr = objectToUrlParams(route?.query || {});
    const url = `${browser.runtime.getURL('/options.html')}#${route.path || '/home'}${
      paramsStr ? `?${paramsStr}` : ''
    }`;
    for (let attempt = 0; attempt < 2; attempt++) {
      let tabId: number | undefined;
      let operation = 'query';
      try {
        const [existing] = await getAdminTabs(targetWindowId);
        if (!existing && !needOpen) return;
        tabId = existing?.id;
        operation = 'pin';
        if (tabId !== undefined) {
          await browser.tabs.update(tabId, { pinned });
        } else {
          const created = await browser.tabs.create({
            windowId: targetWindowId,
            url,
            pinned,
            active: needOpen,
          });
          tabId = created.id;
        }
        if (tabId === undefined) throw new Error('Admin tab has no ID');
        const verified = await browser.tabs.get(tabId);
        if (verified.pinned !== pinned)
          throw new Error('Browser did not apply the requested pinned state');
        operation = 'navigate';
        if (existing) {
          await browser.tabs.update(tabId, {
            url,
            ...(needOpen ? { active: true } : {}),
          });
          if (refresh) await browser.tabs.reload(tabId);
        }
        operation = 'deduplicate';
        await closeDuplicateAdminTabs(targetWindowId, tabId);
        if (needOpen) {
          // Moving an unpinned tab before pinned tabs may fail; pinning must not depend on it.
          await browser.tabs.move(tabId, { index: 0 }).catch(error => {
            reportAdminError('move', targetWindowId, tabId, error);
          });
        }
        return;
      } catch (error) {
        reportAdminError(operation, targetWindowId, tabId, error);
        const stillExists =
          tabId === undefined || (await browser.tabs.get(tabId).catch(() => undefined));
        if (attempt === 0 && !stillExists) continue;
        throw error;
      }
    }
  });
}
// 多窗口时，刷新其他窗口的管理后台页面
export async function reloadOtherAdminPage() {
  const currWindow = await browser.windows.getCurrent();
  sendRuntimeMessage({
    msgType: 'reloadOtherAdminPage',
    data: { currWindowId: currWindow.id },
    targetPageContexts: ['optionsPage'],
  });
}
// 更新管理后台页面的URL参数，页面判断params中的randomId有更新则重新加载数据
export async function updateAdminPageUrl() {
  const { tab } = await getAdminTabInfo();
  if (!tab?.id) return;

  const newUrl = setUrlParams(tab.url || '', { randomId: getRandomId(6) });
  await browser.tabs.update(tab.id, { url: newUrl });
}
export const updateAdminPageUrlDebounced = debounce(updateAdminPageUrl, 500);

// 打开管理后台
export async function openAdminTab(
  settingsData?: SettingsProps,
  params?: { tagId: string; groupId: string },
  needOpen?: boolean,
) {
  const settings = settingsData || (await settingsUtils.getSettings());
  const openAdminTabAfterSendTabs = needOpen ?? settings[OPEN_ADMIN_TAB_AFTER_SEND_TABS];
  await openAdminRoutePage({ path: '/home', query: params }, openAdminTabAfterSendTabs);
}
// 获取过滤后的标签页
export async function getFilteredTabs(
  tabs: Tabs.Tab[],
  settings: SettingsProps,
  validator?: (tab: Tabs.Tab) => boolean,
) {
  const result = tabs.filter(tab => {
    if (!tab?.id) return false;
    if (isNiceTabControlTab(tab)) return false;
    // 如果设置不允许发送固定标签页，则过滤掉固定标签页
    if (tab.pinned && !settings[ALLOW_SEND_PINNED_TABS]) {
      return false;
    }
    const excludeDomainsString = settings[EXCLUDE_DOMAINS_FOR_SENDING] || '';
    const _url = tab.pendingUrl || tab.url;
    if (_url && excludeDomainsString) {
      const isAllowed = isDomainAllowed(_url, excludeDomainsString);
      if (!isAllowed) {
        return false;
      }
    }

    if (validator) {
      return validator(tab);
    }
    return true;
  });

  // 如果发送标签页时，标签页还在加载中，则保存标签页的pendingUrl，此时可能没有title
  return result.map(tab => {
    if (tab.pendingUrl) {
      return { ...tab, url: tab.pendingUrl, title: tab.pendingUrl };
    } else {
      return tab;
    }
  });
}
// 获取发送标签页后需要关闭的标签页id
// 如果设置了保留正在播放音视频的标签页，则这些标签页发送后不会被关闭（已静音的除外）
export async function getTabIdsToClose(tabs: Tabs.Tab[], settings: SettingsProps) {
  const tabIds = tabs.map(tab => tab.id as number).filter(Boolean);
  if (!settings[KEEP_AUDIBLE_TABS_OPEN] || !tabIds.length) return tabIds;

  try {
    const audibleTabs = await browser.tabs.query({ audible: true });
    const audibleTabIds = new Set(
      audibleTabs.filter(tab => !tab.mutedInfo?.muted).map(tab => tab.id),
    );
    return tabIds.filter(tabId => !audibleTabIds.has(tabId));
  } catch {
    return tabIds;
  }
}
// 关闭发送后的标签页
async function removeTabsAfterSend(tabs: Tabs.Tab[], settings: SettingsProps) {
  const tabIds = await getTabIdsToClose(tabs, settings);
  if (!tabIds.length) return;
  await browser.tabs.remove(tabIds);
}
// 取消标签页高亮
export async function cancelHighlightTabs(tabs?: Tabs.Tab[]) {
  await new Promise(res => setTimeout(res, 50));
  if (tabs) {
    tabs.forEach(tab => {
      tab?.highlighted &&
        browser.tabs.update(tab.id, { highlighted: false, active: false });
    });
  } else {
    const highlightedTabs = await browser.tabs.query({
      highlighted: true,
      currentWindow: true,
    });
    const { tab: adminTab } = await getAdminTabInfo();
    highlightedTabs.forEach(tab => {
      if (adminTab && adminTab.id !== tab.id) {
        browser.tabs.update(tab.id, { highlighted: false, active: false });
      }
    });
  }
}

// 根据选中的tabs获取所在标签组中所有tabs
export async function getTabsWithinGroup(tabs: Tabs.Tab[]) {
  const tabGroupIds = [...new Set(tabs.map(tab => tab.groupId).filter(Boolean))];
  const allTabs = await browser.tabs.query({
    currentWindow: true,
  });
  return allTabs.filter(
    tab => tab.groupId && tab.groupId !== -1 && tabGroupIds.includes(tab.groupId),
  );
}
// 获取全部标签页
export async function getAllTabs(windowId?: number) {
  const queryInfo: Tabs.QueryQueryInfoType = {};
  if (windowId) {
    queryInfo.windowId = windowId;
  } else {
    queryInfo.currentWindow = true;
  }
  return await browser.tabs.query(queryInfo);
}

// 发送当前窗口的所有标签页
async function sendAllTabs(
  targetData: SendTargetProps = {},
  {
    onlyCurrentWindow = true,
    excludedTabIds = [],
    windowId,
  }: {
    onlyCurrentWindow?: boolean;
    excludedTabIds?: number[];
    windowId?: number;
  } = {},
) {
  const targetWindowId = windowId ?? (await browser.windows.getCurrent()).id;
  if (targetWindowId === undefined) throw new Error('No target window');
  if (!isBackgroundContext) {
    const result = (await browser.runtime.sendMessage({
      msgType: 'executeSendAllTabs',
      data: { targetData, onlyCurrentWindow, windowId: targetWindowId },
    })) as { ok?: boolean; sentTabs?: boolean } | undefined;
    if (!result?.ok) throw new Error('Could not complete Send All Tabs');
    return !!result.sentTabs;
  }
  const tabs = await browser.tabs.query(
    onlyCurrentWindow
      ? {
          windowId: targetWindowId,
        }
      : {},
  );

  // 获取插件设置
  const settings = await settingsUtils.getSettings();
  const filteredTabs = (await getFilteredTabs(tabs, settings)).filter(
    tab => !excludedTabIds.includes(tab.id as number),
  );
  if (!filteredTabs?.length) {
    await openAdminRoutePage({ path: '/home' }, true, targetWindowId, true);
    return false;
  }
  const { tagId, groupId } = await tabListUtils.createTabs(filteredTabs, targetData);
  await openAdminRoutePage(
    { path: '/home', query: { tagId, groupId } },
    true,
    targetWindowId,
    true,
  );
  const actionAutoCloseFlags = settings[ACTION_AUTO_CLOSE_FLAGS];
  if (
    settings[CLOSE_TABS_AFTER_SEND_TABS] ||
    actionAutoCloseFlags?.includes('sendAllTabs')
  ) {
    await removeTabsAfterSend(filteredTabs, settings);
  } else {
    // 如果发送标签页后打开管理后台，则跳转之后将之前高亮的标签页取消高亮
    cancelHighlightTabs(filteredTabs);
  }
  return true;
}

export async function sendAllTabsFromCommandPage(commandTabId: number, windowId: number) {
  await sendAllTabs({}, { excludedTabIds: [commandTabId], windowId });
  await browser.tabs.remove(commandTabId).catch(() => undefined);
}
// 发送当前选中的标签页所在的标签组（支持多选）
async function sendCurrentGroup(targetData: SendTargetProps = {}, tab?: Tabs.Tab) {
  const settings = await settingsUtils.getSettings();

  const tabs = await browser.tabs.query({
    // url: matchUrls,
    highlighted: true,
    currentWindow: true,
  });

  const _tabsWithinGroup = await getTabsWithinGroup(tabs);

  let filteredTabs = await getFilteredTabs(_tabsWithinGroup, settings);
  if (!filteredTabs?.length) return;

  const { tagId, groupId } = await tabListUtils.createTabs(filteredTabs, targetData);
  await openAdminTab(settings, { tagId, groupId });
  const actionAutoCloseFlags = settings[ACTION_AUTO_CLOSE_FLAGS];
  if (
    settings[CLOSE_TABS_AFTER_SEND_TABS] ||
    actionAutoCloseFlags?.includes('sendCurrentTab')
  ) {
    removeTabsAfterSend(filteredTabs, settings);
  } else {
    // 如果发送标签页后打开管理后台，则跳转之后将之前高亮的标签页取消高亮
    cancelHighlightTabs(filteredTabs);
  }
}
// 发送当前选中的标签页（支持多选）
async function sendCurrentTab(targetData: SendTargetProps = {}, tab?: Tabs.Tab) {
  let filteredTabs: Tabs.Tab[] = [];
  const settings = await settingsUtils.getSettings();

  if (tab) {
    if (tab.id) {
      // 如果传入了 tab（通常来自右键菜单），检查它是否在当前高亮的标签页中
      // 如果是，则发送所有高亮的标签页（多选发送）
      // 如果不是，则只发送该特定标签页
      const highlightedTabs = await browser.tabs.query({
        highlighted: true,
        currentWindow: true,
      });

      const isHighlighted = highlightedTabs.some(t => t.id === tab.id);
      if (isHighlighted) {
        filteredTabs = await getFilteredTabs(highlightedTabs, settings);
      } else {
        filteredTabs = await getFilteredTabs([tab], settings);
      }
    }
  } else {
    const tabs = await browser.tabs.query({
      // url: matchUrls,
      highlighted: true,
      currentWindow: true,
    });
    filteredTabs = await getFilteredTabs(tabs, settings);
  }

  // 发送当前选中的标签页时，选中的标签页成组，不考虑原生标签组（即多选时，选中的非标签组的标签页和标签组中的标签页合并到一个组）
  filteredTabs = filteredTabs.map(tab => ({ ...tab, groupId: -1 }));
  if (!filteredTabs?.length) return;
  const { tagId, groupId } = await tabListUtils.createTabs(filteredTabs, targetData);
  await openAdminTab(settings, { tagId, groupId });
  const actionAutoCloseFlags = settings[ACTION_AUTO_CLOSE_FLAGS];
  if (
    settings[CLOSE_TABS_AFTER_SEND_TABS] ||
    actionAutoCloseFlags?.includes('sendCurrentTab')
  ) {
    removeTabsAfterSend(filteredTabs, settings);
  } else {
    // 如果发送标签页后打开管理后台，则跳转之后将之前高亮的标签页取消高亮
    cancelHighlightTabs(filteredTabs);
  }
}
async function sendOtherTabs(targetData: SendTargetProps = {}) {
  const tabs = await browser.tabs.query({
    // url: matchUrls,
    highlighted: false,
    currentWindow: true,
  });
  const settings = await settingsUtils.getSettings();
  const filteredTabs = await getFilteredTabs(tabs, settings);
  if (!filteredTabs?.length) return;
  const { tagId, groupId } = await tabListUtils.createTabs(filteredTabs, targetData);
  openAdminTab(settings, { tagId, groupId });
  const actionAutoCloseFlags = settings[ACTION_AUTO_CLOSE_FLAGS];
  if (
    settings[CLOSE_TABS_AFTER_SEND_TABS] ||
    actionAutoCloseFlags?.includes('sendOtherTabs')
  ) {
    removeTabsAfterSend(filteredTabs, settings);
  }
  // 如果发送标签页后打开管理后台，则跳转之后将之前高亮的标签页取消高亮
  cancelHighlightTabs();
}
async function sendLeftTabs(targetData: SendTargetProps = {}, currTab?: Tabs.Tab) {
  const tabs = await browser.tabs.query({
    // url: matchUrls,
    currentWindow: true,
  });
  let leftTabs = [];
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    if ((currTab && tab.id === currTab?.id) || tab.active) break;
    leftTabs.push(tab);
  }

  const settings = await settingsUtils.getSettings();
  const filteredTabs = await getFilteredTabs(leftTabs, settings);
  if (!filteredTabs?.length) return;
  const { tagId, groupId } = await tabListUtils.createTabs(filteredTabs, targetData);
  openAdminTab(settings, { tagId, groupId });
  const actionAutoCloseFlags = settings[ACTION_AUTO_CLOSE_FLAGS];
  if (
    settings[CLOSE_TABS_AFTER_SEND_TABS] ||
    actionAutoCloseFlags?.includes('sendLeftTabs')
  ) {
    removeTabsAfterSend(filteredTabs, settings);
  }
  // 如果发送标签页后打开管理后台，则跳转之后将之前高亮的标签页取消高亮
  cancelHighlightTabs();
}
async function sendRightTabs(targetData: SendTargetProps = {}, currTab?: Tabs.Tab) {
  const tabs = await browser.tabs.query({
    // url: matchUrls,
    currentWindow: true,
  });
  let rightTabs = [];
  for (let i = tabs.length - 1; i >= 0; i--) {
    const tab = tabs[i];
    if (tab.id === currTab?.id || tab.active) break;
    rightTabs.unshift(tab);
  }

  const settings = await settingsUtils.getSettings();
  const filteredTabs = await getFilteredTabs(rightTabs, settings);
  if (!filteredTabs?.length) return;
  const { tagId, groupId } = await tabListUtils.createTabs(filteredTabs, targetData);
  openAdminTab(settings, { tagId, groupId });
  const actionAutoCloseFlags = settings[ACTION_AUTO_CLOSE_FLAGS];
  if (
    settings[CLOSE_TABS_AFTER_SEND_TABS] ||
    actionAutoCloseFlags?.includes('sendRightTabs')
  ) {
    removeTabsAfterSend(filteredTabs, settings);
  }
  // 如果发送标签页后打开管理后台，则跳转之后将之前高亮的标签页取消高亮
  cancelHighlightTabs();
}

// 打开页面后等待加载完成才能执行discard
export async function waitToDiscard(tab: Tabs.Tab) {
  if (!tab.id || tab.discarded) return;

  let title = '',
    url = '';

  const cleanup = () => {
    browser.tabs.onUpdated.removeListener(listener);
    clearTimeout(timer);
  };

  // 超时保护：避免页面永远加载不完导致listener泄漏
  const timer = setTimeout(cleanup, 10000);

  // 等待标签页加载完成后再discard
  const listener = (tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType) => {
    if (tabId !== tab.id) return;

    if (changeInfo.title) title = changeInfo.title;
    if (changeInfo.url) url = changeInfo.url;
    if ((title && url) || changeInfo.status === 'complete') {
      cleanup();
      browser.tabs.discard(tabId).catch(() => {
        // 标签页可能已被关闭或已休眠，忽略错误
        // console.log('标签页休眠失败');
      });
    }
  };
  browser.tabs.onUpdated.addListener(listener);
}

/*
打开新标签页
active：打开标签页是否激活
openToNext：是否紧随管理后台页之后打开
*/
export async function openNewTab(
  url?: string,
  {
    active = false,
    openToNext = false,
    discard = false,
  }: { active?: boolean; openToNext?: boolean; discard?: boolean } = {},
) {
  if (!url?.trim()) return;

  if (!browser?.tabs?.create) {
    window.open(url, '_blank');
    return;
  }

  if (!openToNext) {
    const tab = await browser.tabs.create({ url, active });
    if (discard && tab.id && !active) {
      waitToDiscard(tab);
    }
    return;
  }

  const currentTabs = await browser.tabs.query({ active: true, currentWindow: true });
  const newTabIndex = (currentTabs?.[0]?.index || 0) + 1;
  // 注意：如果打开标签页不想 active, 则 active 必须设置默认值为 false，
  // create 方法 active参数传 undefined 也会激活 active
  const createdTab = await browser.tabs.create({ url, active, index: newTabIndex });
  if (discard && createdTab.id && !active) {
    waitToDiscard(createdTab);
  }
}

// 打开标签组
export async function openNewGroup(
  groupName: string,
  urls: Array<string | undefined>,
  { discard = false, asGroup = true }: { discard?: boolean; asGroup?: boolean },
) {
  const settings = await settingsUtils.getSettings();

  let _urls = urls.filter(url => !!url?.trim()) as string[];
  if (settings[RESTORE_IN_NEW_WINDOW]) {
    const windowInfo = await browser.windows.create({ focused: true, url: _urls });

    const tabs = await browser.tabs.query({ windowId: windowInfo.id, pinned: false });

    tabs
      .filter(tab => !tab.active)
      .forEach(tab => {
        if (discard && tab.id) {
          waitToDiscard(tab);
        }
      });

    if (!isGroupSupported()) return;
    if (!asGroup) return;

    const bsGroupId = await browser.tabs.group!({
      createProperties: { windowId: windowInfo.id },
      tabIds: tabs.map(tab => tab.id!),
    });
    browser.tabGroups?.update(bsGroupId, { title: groupName });
  } else {
    _urls = settings[OPENING_TABS_ORDER] === 'reverse' ? [..._urls].reverse() : _urls;
    if (!isGroupSupported() || !asGroup) {
      for (let url of _urls) {
        openNewTab(url, { discard });
      }
      return;
    }

    Promise.all(
      _urls.map(url => {
        return browser.tabs.create({ url, active: false });
      }),
    ).then(async tabs => {
      const filteredTabs = tabs.filter(tab => !!tab.id);
      filteredTabs.forEach(tab => {
        if (discard && tab.id) {
          waitToDiscard(tab);
        }
      });
      const bsGroupId = await browser.tabs.group!({
        tabIds: filteredTabs.map(tab => tab.id!),
      });
      browser.tabGroups?.update(bsGroupId, { title: groupName });
    });
  }
}

// 冻结当前标签页以外的标签页
export async function discardOtherTabs() {
  const { tab: adminTab } = await getAdminTabInfo();
  const tabs = await browser.tabs.query({ currentWindow: true });
  for (let tab of tabs) {
    if (tab.id && tab.id !== adminTab?.id && !tab.active && !tab.discarded) {
      browser.tabs.discard(tab.id);
    }
  }
}

// 将已打开的标签页生保存为快照
export const saveOpenedTabsAsSnapshot = async (
  type: 'autoSave' | 'manualSave' = 'autoSave',
) => {
  const tabs = await browser.tabs.query(
    type === 'autoSave' ? {} : { currentWindow: true },
  );
  const { tab: adminTab } = await getAdminTabInfo();
  const filteredTabs = tabs.filter(tab => {
    if (!tab?.id) return false;
    if (adminTab && adminTab.id === tab.id) return false;
    if (tab.pinned) return false;
    return true;
  });

  if (!filteredTabs.length) return;

  const openedTabs = await tabListUtils.createOpenedTabsSnapshot(filteredTabs);
  if (type === 'autoSave') {
    await stateUtils.setStateByModule('global', { openedTabsAutoSave: openedTabs });
  } else if (type === 'manualSave') {
    await stateUtils.setStateByModule('global', { openedTabsManualSave: openedTabs });
  }
};
// 恢复快照
export const restoreOpenedTabsSnapshot = async (
  type: 'autoSave' | 'manualSave' = 'autoSave',
) => {
  const globalState = await stateUtils.getState('global');
  if (type === 'autoSave') {
    await tabListUtils.restoreTabsSnapshot(globalState.openedTabsAutoSave || []);
  } else if (type === 'manualSave') {
    await tabListUtils.restoreTabsSnapshot(globalState.openedTabsManualSave || []);
  }
};

// 打开用户指南
export const openUserGuide = async () => {
  const settings = await settingsUtils.getSettings();
  const language = settings.language || 'en-US';
  const guideUrl = USER_GUIDE_URL_MAP[language];
  openNewTab(guideUrl, {
    active: true,
    openToNext: true,
  });
};

// 打开更新日志
export const openChangelog = async () => {
  const settings = await settingsUtils.getSettings();
  const language = settings.language || 'en-US';
  const url = CHANGELOG_URL_MAP[language];
  openNewTab(url, {
    active: true,
    openToNext: true,
  });
};

export default {
  sendTabMessage,
  executeContentScript,
  getAdminTabInfo,
  initializeAdminPageCoordinator,
  isAdminTab,
  deduplicateAdminPages,
  openAdminRoutePage,
  openAdminTab,
  reloadOtherAdminPage,
  updateAdminPageUrl,
  updateAdminPageUrlDebounced,
  getFilteredTabs,
  cancelHighlightTabs,
  getAllTabs,
  sendAllTabs,
  sendAllTabsFromCommandPage,
  sendCurrentGroup,
  sendCurrentTab,
  sendOtherTabs,
  sendLeftTabs,
  sendRightTabs,
  openNewTab,
  discardOtherTabs,
  saveOpenedTabsAsSnapshot,
  restoreOpenedTabsSnapshot,
  openUserGuide,
  openChangelog,
};
