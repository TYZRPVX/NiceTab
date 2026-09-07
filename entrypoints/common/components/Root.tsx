import type { Runtime } from 'wxt/browser';
import React, { useEffect, useState } from 'react';
import { ConfigProvider, theme, message } from 'antd';
import { IntlProvider } from 'react-intl';
import {
  DARK_THEME_TOKENS,
  PRIMARY_COLOR,
  THEME_COLORS,
  defaultLanguage,
} from '../constants';
import {
  GlobalContext,
  useAntdLocale,
  useCustomLocale,
  useThemeTypeConfig,
} from '~/entrypoints/common/hooks/global';
import type {
  PageContextType,
  RuntimeMessageEventProps,
  ThemeProps,
  LanguageTypes,
  ThemeTypes,
  SettingsProps,
  PageWidthTypes,
} from '~/entrypoints/types';
import {
  themeUtils,
  settingsUtils,
  initSettingsStorageListener,
  initThemeStorageListener,
} from '~/entrypoints/common/storage';
import { updateAdminPageUrlDebounced } from '~/entrypoints/common/tabs';

const THEMED_FAVICON_ID = 'nicetab-theme-favicon';

export function applyDocumentFavicon(themeType: 'light' | 'dark') {
  const favicon = document.getElementById(THEMED_FAVICON_ID) as HTMLLinkElement | null;
  if (!favicon) return;

  const href = browser.runtime.getURL(`icon/favicon-${themeType}-32.png`);
  if (favicon.href !== href) favicon.href = href;
}

export default function Root({
  pageContext = 'optionsPage',
  children,
}: {
  pageContext: PageContextType;
  children: React.ReactNode;
}) {
  const [$message, messageContextHolder] = message.useMessage();
  const [version, setVersion] = useState('');
  const { locale: localeAntd, changeLocale: changeLocaleAntd } = useAntdLocale();
  const {
    locale: localeCustom,
    changeLocale: changeLocaleCustom,
    messages,
  } = useCustomLocale();
  const { themeTypeConfig, themeType, changeThemeType } = useThemeTypeConfig();
  const [hasReady, setHasReady] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(PRIMARY_COLOR);
  const [pageWidthType, setPageWidthType] = useState<PageWidthTypes>('responsive');

  const handleLocaleChange = async (language?: LanguageTypes) => {
    changeLocaleAntd(language);
    changeLocaleCustom(language);
  };
  const handleThemeTypeChange = async (themeType: ThemeTypes) => {
    changeThemeType(themeType);
  };
  const handleThemeChange = async (themeData: Partial<ThemeProps>) => {
    const theme = await themeUtils.setThemeData(themeData);
    setPrimaryColor(theme.colorPrimary);
  };
  const handlePageWidthTypeChange = async (type: PageWidthTypes) => {
    setPageWidthType(type);
  };
  const handleSettingsChange = async (settings: Partial<SettingsProps>) => {
    await settingsUtils.setSettings(settings);
    const {
      language,
      themeType = settingsUtils.initialSettings.themeType,
      pageWidthType = settingsUtils.initialSettings.pageWidthType,
    } = settingsUtils.settings || {};
    handleLocaleChange(language);
    handlePageWidthTypeChange(pageWidthType);
    handleThemeTypeChange(themeType);
  };

  const initData = async () => {
    const settings = await settingsUtils.getSettings();
    handleSettingsChange(settings);
    const theme = await themeUtils.getThemeData();
    setPrimaryColor(theme.colorPrimary);
    setHasReady(true);
  };

  const getManifest = async () => {
    const manifestInfo = await browser.runtime.getManifest();
    setVersion(manifestInfo?.version || '888.888.888');
  };
  // 监听消息
  const messageListener = async (msg: unknown, msgSender: Runtime.MessageSender) => {
    const { msgType, data, targetPageContext } = (msg || {}) as RuntimeMessageEventProps;
    if (targetPageContext && targetPageContext !== pageContext) return;

    if (msgType === 'setPrimaryColor') {
      const colorPrimary = data.colorPrimary || PRIMARY_COLOR;
      await themeUtils.setThemeData({ colorPrimary });
      handleThemeChange({ colorPrimary });
    } else if (msgType === 'setThemeData') {
      await themeUtils.setThemeData(data);
      handleThemeChange(data);
    } else if (msgType === 'setThemeType') {
      handleThemeTypeChange(data.themeType);
    } else if (msgType === 'setLocale') {
      handleLocaleChange(data.locale);
    } else if (msgType === 'reloadAllAdminPage') {
      updateAdminPageUrlDebounced();
    } else if (msgType === 'reloadOtherAdminPage') {
      const currWindow = await browser.windows.getCurrent();
      if (data.currWindowId !== currWindow.id) {
        updateAdminPageUrlDebounced();
      }
    }
  };

  useEffect(() => {
    if (pageContext !== 'contentScriptPage') {
      document.documentElement.lang = localeCustom || defaultLanguage;
    }
  }, [pageContext, localeCustom]);

  useEffect(() => {
    if (!hasReady || pageContext === 'contentScriptPage') return;

    const effectiveTheme = themeTypeConfig.type === 'dark' ? 'dark' : 'light';
    applyDocumentFavicon(effectiveTheme);
    void browser.runtime
      .sendMessage({
        msgType: 'theme:effective-change',
        data: { theme: effectiveTheme },
        targetPageContext: 'background',
      })
      .catch(() => undefined);
  }, [hasReady, pageContext, themeTypeConfig.type]);

  useEffect(() => {
    initData();
    getManifest();
    browser.runtime.onMessage.addListener(messageListener);

    const settingsUnwatch = initSettingsStorageListener(() => {
      initData();
    });
    const themeUnwatch = initThemeStorageListener(() => {
      initData();
    });

    return () => {
      settingsUnwatch();
      themeUnwatch();
      browser.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const isDarkTheme = themeTypeConfig.type === 'dark';
  const selectedThemeColor = THEME_COLORS.find(
    item => item.color.toLowerCase() === primaryColor?.toLowerCase(),
  );
  const effectivePrimaryColor = isDarkTheme
    ? selectedThemeColor?.darkColor || primaryColor
    : primaryColor;

  return (
    <IntlProvider locale={localeCustom} messages={messages}>
      <ConfigProvider
        prefixCls="nicetab"
        locale={localeAntd}
        theme={{
          cssVar: { key: 'css-var-token-nicetab' },
          hashed: false,

          algorithm: theme[themeTypeConfig.algorithm],
          token: {
            motion: false,
            colorPrimary: effectivePrimaryColor || PRIMARY_COLOR,
            colorBgContainer: themeTypeConfig.bgColor || '#fff',
            ...(isDarkTheme
              ? {
                  colorBgBase: DARK_THEME_TOKENS.page,
                  colorBgLayout: DARK_THEME_TOKENS.page,
                  colorBgElevated: DARK_THEME_TOKENS.elevated,
                  colorFillAlter: DARK_THEME_TOKENS.muted,
                  colorBorder: DARK_THEME_TOKENS.border,
                  colorBorderSecondary: DARK_THEME_TOKENS.border,
                  colorText: DARK_THEME_TOKENS.text,
                  colorTextSecondary: DARK_THEME_TOKENS.textSecondary,
                  colorTextTertiary: DARK_THEME_TOKENS.textTertiary,
                  colorTextLightSolid: DARK_THEME_TOKENS.page,
                }
              : {}),
          },
          components: {
            Tree: {
              motion: false,
              algorithm: true,
            },
          },
        }}
      >
        <GlobalContext.Provider
          value={{
            version,
            colorPrimary: primaryColor,
            themeTypeConfig,
            themeType,
            pageWidthType,
            pageContext,
            $message,
            setThemeType: handleThemeTypeChange,
            setThemeData: handleThemeChange,
            setSettings: handleSettingsChange,
            setLocale: handleLocaleChange,
            setPageWidthType: handlePageWidthTypeChange,
          }}
        >
          {messageContextHolder}
          {hasReady && children}
        </GlobalContext.Provider>
      </ConfigProvider>
    </IntlProvider>
  );
}
