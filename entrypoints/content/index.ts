import type { SendTabMsgEventProps } from '~/entrypoints/types';

type ContentUi = Awaited<ReturnType<typeof import('./mountUi').mountContentUi>>;

export default defineContentScript({
  matches: ['*://*/*'],

  async main(ctx) {
    let contentUiPromise: Promise<ContentUi> | undefined;

    const ensureContentUi = () => {
      if (!contentUiPromise) {
        contentUiPromise = import('./mountUi').then(({ mountContentUi }) =>
          mountContentUi(ctx, () => {
            contentUiPromise = undefined;
          }),
        );
      }
      return contentUiPromise;
    };

    const messageListener = (message: unknown) => {
      const { msgType, data } = (message || {}) as SendTabMsgEventProps;

      if (msgType === 'action:open-global-search-modal') {
        void ensureContentUi().then(ui => ui.openGlobalSearch());
      } else if (msgType === 'action:open-send-target-modal') {
        void ensureContentUi().then(ui => ui.openSendTarget(data));
      } else if (msgType === 'action:callback-message') {
        void ensureContentUi().then(ui => ui.showCallbackMessage(data));
      } else if (msgType === 'action:refresh-global-search-modal') {
        void contentUiPromise?.then(ui => ui.refreshGlobalSearch());
      }
    };

    browser.runtime.onMessage.addListener(messageListener);
    ctx.onInvalidated(() => {
      browser.runtime.onMessage.removeListener(messageListener);
      void contentUiPromise?.then(ui => ui.remove());
    });
  },
});
