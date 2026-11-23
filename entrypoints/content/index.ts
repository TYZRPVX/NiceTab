import type { SendTabMsgEventProps } from '~/entrypoints/types';

type MountContentUi = typeof import('./mountUi').mountContentUi;
type ContentUi = Awaited<ReturnType<MountContentUi>>;

// XML, SVG and XHTML documents may create elements without HTMLElement.style.
// Check before importing React, not merely before mounting its components.
function supportsContentUi() {
  return (
    document.contentType === 'text/html' &&
    document.documentElement?.namespaceURI === 'http://www.w3.org/1999/xhtml' &&
    document.createElement('div').style !== undefined
  );
}

export default defineContentScript({
  matches: ['*://*/*'],

  async main(ctx) {
    if (!supportsContentUi()) return;

    // One in-flight UI per document; cleared on removal/failure, no polling/cache.
    let contentUiPromise: Promise<ContentUi> | undefined;
    let invalidated = false;
    const reportError = () => console.warn('NiceTab could not load the page overlay.');

    const ensureContentUi = () => {
      if (invalidated || !supportsContentUi()) {
        return Promise.reject(new Error('Unsupported or invalidated document'));
      }
      if (!contentUiPromise) {
        const url = browser.runtime.getURL('/content-ui.js');
        contentUiPromise = import(/* @vite-ignore */ url)
          .then(async module => {
            const mountContentUi = (await module.default) as MountContentUi;
            if (invalidated || !supportsContentUi()) throw new Error('Document changed');
            return mountContentUi(ctx, () => {
              contentUiPromise = undefined;
            });
          })
          .then(ui => {
            if (invalidated) {
              ui.remove();
              throw new Error('Document invalidated');
            }
            return ui;
          })
          .catch(error => {
            contentUiPromise = undefined;
            throw error;
          });
      }
      return contentUiPromise;
    };

    const messageListener = (message: unknown) => {
      const { msgType, data } = (message || {}) as SendTabMsgEventProps;
      if (msgType === 'action:open-global-search-modal') {
        void ensureContentUi().then(ui => ui.openGlobalSearch()).catch(reportError);
      } else if (msgType === 'action:open-send-target-modal') {
        void ensureContentUi().then(ui => ui.openSendTarget(data)).catch(reportError);
      } else if (msgType === 'action:callback-message') {
        void ensureContentUi().then(ui => ui.showCallbackMessage(data)).catch(reportError);
      } else if (msgType === 'action:refresh-global-search-modal') {
        void contentUiPromise?.then(ui => ui.refreshGlobalSearch()).catch(reportError);
      }
    };

    browser.runtime.onMessage.addListener(messageListener);
    ctx.onInvalidated(() => {
      invalidated = true;
      browser.runtime.onMessage.removeListener(messageListener);
      void contentUiPromise?.then(ui => ui.remove()).catch(() => undefined);
    });
  },
});
