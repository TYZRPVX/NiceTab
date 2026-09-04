import { createRef } from 'react';
import ReactDOM from 'react-dom/client';
import { flushSync } from 'react-dom';
import { StyleProvider } from '@ant-design/cssinjs';
import { StyleSheetManager } from 'styled-components';
import resetCss from '~/assets/css/reset.css?inline';
import contentCss from './style.css?inline';
import { ContentGlobalContext } from './context';
import Root from '~/entrypoints/common/components/Root';
import App, { type ContentAppHandle } from './App';
import type { SendTabMsgCallbackMessage, SendTabMsgOpenSendTargetModal } from '~/entrypoints/types';

export async function mountContentUi(
  ctx: Parameters<typeof createShadowRootUi>[0],
  onRemoved: () => void,
) {
  const appRef = createRef<ContentAppHandle>();
  let removeUi = () => {};

  const ui = await createShadowRootUi(ctx, {
    name: 'nicetab-message',
    position: 'modal',
    anchor: 'body',
    css: `${resetCss}\n${contentCss}`,
    onMount: (container, _shadow, shadowHost) => {
      shadowHost.style.zIndex = '99999';
      const wrapper = document.createElement('div');
      wrapper.id = 'nicetab-shadow-root-wrapper';
      container.append(wrapper);

      const root = ReactDOM.createRoot(wrapper);
      flushSync(() => {
        root.render(
          <StyleProvider container={container}>
            <Root pageContext="contentScriptPage">
              <StyleSheetManager target={container}>
                <ContentGlobalContext.Provider value={{ rootWrapper: wrapper }}>
                  <App ref={appRef} onIdle={() => removeUi()} />
                </ContentGlobalContext.Provider>
              </StyleSheetManager>
            </Root>
          </StyleProvider>,
        );
      });
      return { root, wrapper };
    },
    onRemove: mounted => {
      mounted?.root.unmount();
      mounted?.wrapper.remove();
      onRemoved();
    },
  });

  removeUi = () => ui.remove();
  ui.mount();

  return {
    openGlobalSearch: () => appRef.current?.openGlobalSearch(),
    refreshGlobalSearch: () => appRef.current?.refreshGlobalSearch(),
    openSendTarget: (data: SendTabMsgOpenSendTargetModal['data']) =>
      appRef.current?.openSendTarget(data),
    showCallbackMessage: (data: SendTabMsgCallbackMessage['data']) =>
      appRef.current?.showCallbackMessage(data),
    remove: () => ui.remove(),
  };
}
