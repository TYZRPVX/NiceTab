import type { Runtime } from 'wxt/browser';

const COMMAND_PORT = 'nicetab:send-all-tabs';

// A dedicated port prevents unrelated extension-page message listeners from
// answering this request with an empty result before the background finishes.
export function runSendAllTabsCommand(): Promise<void> {
  return new Promise((resolve, reject) => {
    const port = browser.runtime.connect({ name: COMMAND_PORT });
    const cleanup = () => {
      port.onMessage.removeListener(onMessage);
      port.onDisconnect.removeListener(onDisconnect);
      port.disconnect();
    };
    const onMessage = (message: unknown) => {
      const result = message as { ok?: boolean; error?: string } | undefined;
      cleanup();
      if (result?.ok) resolve();
      else reject(new Error(result?.error || 'Command failed'));
    };
    const onDisconnect = () => {
      const error = browser.runtime.lastError;
      cleanup();
      reject(new Error(error?.message || 'Command connection closed'));
    };
    port.onMessage.addListener(onMessage);
    port.onDisconnect.addListener(onDisconnect);
    port.postMessage({ action: 'sendAllTabs' });
  });
}

export function registerCommandHandler(
  execute: (tabId: number, windowId: number) => Promise<void>,
) {
  browser.runtime.onConnect.addListener((port: Runtime.Port) => {
    if (port.name !== COMMAND_PORT) return;
    const onMessage = async (value: unknown) => {
      const message = value as { action?: string } | undefined;
      port.onMessage.removeListener(onMessage);
      let result: { ok: boolean; error?: string };
      try {
        const tab = port.sender?.tab;
        if (message?.action !== 'sendAllTabs' || tab?.id === undefined || tab.windowId === undefined) {
          throw new Error('Command must run from a browser tab');
        }
        await execute(tab.id, tab.windowId);
        result = { ok: true };
      } catch (error) {
        result = { ok: false, error: error instanceof Error ? error.message : String(error) };
        console.error('NiceTab command failed:', result.error);
      }
      // Successful execution may already have closed the command page.
      try { port.postMessage(result); } catch { /* The page is gone. */ }
    };
    port.onMessage.addListener(onMessage);
  });
}
