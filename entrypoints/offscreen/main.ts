const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

function reportSystemTheme() {
  return browser.runtime
    .sendMessage({
      msgType: 'theme:system-preference',
      data: { theme: mediaQuery.matches ? 'dark' : 'light' },
      targetPageContext: 'background',
    })
    .catch(() => undefined);
}

void reportSystemTheme();
mediaQuery.addEventListener('change', () => void reportSystemTheme());

browser.runtime.onMessage.addListener((message: unknown) => {
  if ((message as { msgType?: string })?.msgType === 'theme:request-system-preference') {
    void reportSystemTheme();
  }
});
