const action = new URL(window.location.href).searchParams.get('action');

if (action === 'sendAllTabs') {
  // A static error view keeps this command page lightweight and allows explicit retry.
  const run = async () => {
    document.body.replaceChildren();
    try {
      const result = (await browser.runtime.sendMessage({
        msgType: 'sendAllTabsFromCommandPage',
      })) as { ok?: boolean } | undefined;
      if (!result?.ok) throw new Error('Command failed');
    } catch {
      const chinese = navigator.language.startsWith('zh');
      const message = document.createElement('p');
      message.textContent = chinese
        ? '操作未完成。标签可能已保存，请检查 NiceTab 后重试。'
        : 'Could not complete the action. Tabs may already be saved; check NiceTab before retrying.';
      const retry = document.createElement('button');
      retry.textContent = chinese ? '重试' : 'Retry';
      retry.addEventListener('click', () => void run(), { once: true });
      document.body.append(message, retry);
    }
  };
  void run();
}
