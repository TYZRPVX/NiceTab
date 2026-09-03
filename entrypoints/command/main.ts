const action = new URL(window.location.href).searchParams.get('action');

if (action === 'sendAllTabs') {
  void browser.tabs.getCurrent().then(tab =>
    browser.runtime.sendMessage({
      msgType: 'sendAllTabsFromCommandPage',
      data: { commandTabId: tab?.id },
    }),
  );
}
