import { runSendAllTabsCommand } from '~/entrypoints/common/commandTransport';
import { closeCommandTab } from '~/entrypoints/common/commandPage';

const action = new URL(window.location.href).searchParams.get('action');

if (action === 'sendAllTabs') {
  const chinese = navigator.language.startsWith('zh');
  const showRetry = (text: string, label: string, retry: () => Promise<void>) => {
    const message = document.createElement('p');
    message.textContent = text;
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', () => { void retry(); }, { once: true });
    document.body.replaceChildren(message, button);
  };
  const closeAfterSuccess = async () => {
    document.body.replaceChildren();
    try {
      const tab = await browser.tabs.getCurrent();
      if (tab?.id !== undefined && await closeCommandTab(tab.id)) return;
    } catch {
      // Keep the completed state: a close failure must not re-run the command.
    }
    showRetry(
      chinese ? '标签已保存，但命令页暂时无法关闭。' : 'Tabs saved, but this command page could not close.',
      chinese ? '关闭此页' : 'Close this page',
      closeAfterSuccess,
    );
  };
  const run = async () => {
    document.body.replaceChildren();
    try {
      await runSendAllTabsCommand();
    } catch {
      showRetry(
        chinese ? '操作未完成。标签可能已保存，请检查 NiceTab 后重试。'
          : 'Could not complete the action. Tabs may already be saved; check NiceTab before retrying.',
        chinese ? '重试' : 'Retry',
        run,
      );
      return;
    }
    await closeAfterSuccess();
  };
  void run();
}
