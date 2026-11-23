import ReactDOM from 'react-dom/client';
import { flushSync } from 'react-dom';
import { StyleProvider } from '@ant-design/cssinjs';
import { StyleSheetManager } from 'styled-components';
import resetCss from '~/assets/css/reset.css?inline';
import contentCss from './style.css?inline';
import iconCss from '~/entrypoints/common/components/icon/icons.css?inline';
import { ContentGlobalContext } from './context';
import Root from '~/entrypoints/common/components/Root';
import App, { type ContentAppHandle } from './App';
import type { SendTabMsgCallbackMessage, SendTabMsgOpenSendTargetModal } from '~/entrypoints/types';

export async function mountContentUi(
  ctx: Parameters<typeof createShadowRootUi>[0],
  onRemoved: () => void,
) {
  let resolveReady!: (app: ContentAppHandle) => void;
  let rejectReady!: (error: unknown) => void;
  const ready = new Promise<ContentAppHandle>((resolve, reject) => {
    resolveReady = resolve;
    rejectReady = reject;
  });
  let mountedRoot: ReturnType<typeof ReactDOM.createRoot> | undefined;
  let removeUi = () => {};

  const ui = await createShadowRootUi(ctx, {
    name: 'nicetab-message',
    position: 'modal',
    anchor: 'body',
    css: `${resetCss}\n${contentCss}\n${iconCss}`,
    onMount: (container, _shadow, shadowHost) => {
      shadowHost.style.zIndex = '99999';
      const wrapper = document.createElement('div');
      wrapper.id = 'nicetab-shadow-root-wrapper';
      container.append(wrapper);

      const root = ReactDOM.createRoot(wrapper);
      mountedRoot = root;
      flushSync(() => {
        root.render(
          <StyleProvider container={container}>
            <Root pageContext="contentScriptPage" onInitializationError={rejectReady}>
              <StyleSheetManager target={container}>
                <ContentGlobalContext.Provider value={{ rootWrapper: wrapper }}>
                  <App
                    ref={app => { if (app) resolveReady(app); }}
                    onIdle={() => removeUi()}
                  />
                </ContentGlobalContext.Provider>
              </StyleSheetManager>
            </Root>
          </StyleProvider>,
        );
      });
      return { root, wrapper };
    },
    onRemove: mounted => {
      rejectReady(new Error('Overlay removed before it was ready'));
      mountedRoot?.unmount();
      mountedRoot = undefined;
      mounted?.wrapper.remove();
      onRemoved();
    },
  });

  removeUi = () => ui.remove();
  let app: ContentAppHandle;
  try {
    if (ctx.isInvalid) throw new Error('Content script invalidated');
    ui.mount();
    // Root loads settings asynchronously; flushSync alone cannot make App ready.
    app = await ready;
  } catch (error) {
    // Consume a possible readiness rejection even when mounting itself failed.
    void ready.catch(() => undefined);
    ui.remove();
    throw error;
  }

  return {
    openGlobalSearch: () => app.openGlobalSearch(),
    refreshGlobalSearch: () => app.refreshGlobalSearch(),
    openSendTarget: (data: SendTabMsgOpenSendTargetModal['data']) =>
      app.openSendTarget(data),
    showCallbackMessage: (data: SendTabMsgCallbackMessage['data']) =>
      app.showCallbackMessage(data),
    remove: () => ui.remove(),
  };
}
