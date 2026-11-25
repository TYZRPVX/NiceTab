// Retry only closing the command tab; never repeat the save operation.
export async function closeCommandTab(tabId: number): Promise<boolean> {
  const expected = new URL(browser.runtime.getURL('/command.html'));
  for (const delay of [0, 100, 300, 600]) {
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    let tab;
    try {
      tab = await browser.tabs.get(tabId);
    } catch {
      // Distinguish an already closed tab from a transient tabs.get failure.
      const tabs = await browser.tabs.query({}).catch(() => undefined);
      if (tabs && !tabs.some(item => item.id === tabId)) return true;
      continue;
    }
    const url = tab.pendingUrl || tab.url;
    if (!url) continue;
    const current = new URL(url);
    if (
      current.protocol !== expected.protocol || current.host !== expected.host ||
      current.pathname !== expected.pathname ||
      current.searchParams.get('action') !== 'sendAllTabs'
    ) return true; // The user navigated elsewhere; do not close their new page.
    try {
      await browser.tabs.remove(tabId);
      return true;
    } catch {
      // Chromium can temporarily reject tab edits during drag/reorder operations.
    }
  }
  return false;
}
