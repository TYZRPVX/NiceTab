import { forwardRef, useContext, useEffect, useImperativeHandle, useRef } from 'react';
import { theme } from 'antd';
import { ThemeProvider } from 'styled-components';
import { GlobalContext } from '~/entrypoints/common/hooks/global';
import SendTargetActionHolder, {
  type SendTargetActionHolderProps,
} from '~/entrypoints/options/home/SendTargetActionHolder';
import {
  GlobalSearchPanel,
  type GlobalSearchPanelHandle,
} from '~/entrypoints/common/components/BaseGlobalSearch';
import { GlobalStyle } from '~/entrypoints/common/style/Common.styled';
import type { SendTabMsgCallbackMessage, SendTabMsgOpenSendTargetModal } from '~/entrypoints/types';

export interface ContentAppHandle {
  openGlobalSearch: () => void;
  refreshGlobalSearch: () => void;
  openSendTarget: (data: SendTabMsgOpenSendTargetModal['data']) => void;
  showCallbackMessage: (data: SendTabMsgCallbackMessage['data']) => void;
}

export default forwardRef<ContentAppHandle, { onIdle: () => void }>(function App(
  { onIdle },
  ref,
) {
  const { token } = theme.useToken();
  const NiceGlobalContext = useContext(GlobalContext);
  const { themeTypeConfig } = NiceGlobalContext;
  const globalSearchRef = useRef<GlobalSearchPanelHandle>(null);
  const sendTargetRef = useRef<SendTargetActionHolderProps>(null);
  const idleTimerRef = useRef<number>();

  useEffect(
    () => () => {
      window.clearTimeout(idleTimerRef.current);
    },
    [],
  );

  useImperativeHandle(ref, () => ({
    openGlobalSearch: () => globalSearchRef.current?.open(),
    refreshGlobalSearch: () => globalSearchRef.current?.refreshData(),
    openSendTarget: data => sendTargetRef.current?.show?.(data),
    showCallbackMessage: data => {
      sendTargetRef.current?.showCallbackMessage?.(data);
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(onIdle, 3200);
    },
  }));

  return (
    <ThemeProvider theme={{ ...themeTypeConfig, ...token }}>
      <GlobalStyle />
      <SendTargetActionHolder
        ref={sendTargetRef}
        listenRuntime={false}
        pageContext="contentScriptPage"
        onClose={onIdle}
      />
      <GlobalSearchPanel
        ref={globalSearchRef}
        listenRuntime={false}
        pageContext="contentScriptPage"
        onClose={onIdle}
      />
    </ThemeProvider>
  );
});
