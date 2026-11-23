import { withMessageIcons } from './icon/messageIcons';
import * as UIIcons from './icon/Icons';
import type { Runtime } from 'wxt/browser';
import React, { useEffect, useMemo, useState } from 'react';
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
  PageTitleConfigItem,
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
  onInitializationError,
}: {
  pageContext: PageContextType;
  children: React.ReactNode;
  onInitializationError?: (error: unknown) => void;
}) {
  const [messageApi, messageContextHolder] = message.useMessage({
    // Leave the popup's top action toolbar visible while feedback is displayed.
    top: pageContext === 'popupPage' ? 64 : undefined,
  });
  const $message = useMemo(() => withMessageIcons(messageApi), [messageApi]);
  const [version, setVersion] = useState('');
  const [pageTitleConfig, setPageTitleConfig] = useState<PageTitleConfigItem[]>([]);
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

  // Applying state must never persist: initialization and watchers use this path.
  const applySettings = (settings: SettingsProps) => {
    const normalized = settingsUtils.normalizeSettings(settings);
    settingsUtils.settings = normalized;
    if (pageContext !== 'contentScriptPage') {
      setPageTitleConfig(normalized.pageTitleConfig || []);
    }
    void changeLocaleAntd(normalized.language);
    void changeLocaleCustom(normalized.language);
    setPageWidthType(normalized.pageWidthType || settingsUtils.initialSettings.pageWidthType);
    void changeThemeType(normalized.themeType || settingsUtils.initialSettings.themeType);
  };
  const handleSettingsChange = async (settings: Partial<SettingsProps>) => {
    await settingsUtils.setSettings(settings);
    applySettings(settingsUtils.settings);
  };
  const handleLocaleChange = async (language?: LanguageTypes, callback?: () => void) => {
    await handleSettingsChange({ language });
    callback?.();
  };
  const handleThemeTypeChange = async (themeType: ThemeTypes) => {
    await handleSettingsChange({ themeType });
  };
  const handleThemeChange = async (themeData: Partial<ThemeProps>) => {
    const theme = await themeUtils.setThemeData(themeData);
    setPrimaryColor(theme.colorPrimary);
  };
  const handlePageWidthTypeChange = async (pageWidthType: PageWidthTypes) => {
    await handleSettingsChange({ pageWidthType });
  };
  const initData = async () => {
    applySettings(await settingsUtils.getSettings());
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
      setPrimaryColor(colorPrimary);
    } else if (msgType === 'setThemeData') {
      setPrimaryColor((await themeUtils.getThemeData()).colorPrimary);
    } else if (msgType === 'setThemeType') {
      void changeThemeType(data.themeType);
    } else if (msgType === 'setLocale') {
      void changeLocaleAntd(data.locale);
      void changeLocaleCustom(data.locale);
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
    void initData().catch(error => {
      if (onInitializationError) onInitializationError(error);
      else console.error('NiceTab could not initialize page settings.', error);
    });
    getManifest();
    browser.runtime.onMessage.addListener(messageListener);

    const settingsUnwatch = initSettingsStorageListener(settings => {
      applySettings(settings);
    });
    const themeUnwatch = initThemeStorageListener(() => {
      void themeUtils.getThemeData().then(theme => setPrimaryColor(theme.colorPrimary));
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
        modal={{ closeIcon: <UIIcons.XIcon /> }}
        drawer={{ closeIcon: <UIIcons.XIcon /> }}
        notification={{ closeIcon: <UIIcons.XIcon /> }}
        tag={{ closeIcon: <UIIcons.XIcon /> }}
        alert={{ closeIcon: <UIIcons.XIcon /> }}
        tour={{ closeIcon: <UIIcons.XIcon /> }}
        tabs={{
          addIcon: <UIIcons.PlusIcon />,
          removeIcon: <UIIcons.XIcon />,
          moreIcon: <UIIcons.EllipsisVerticalIcon />,
        }}
        collapse={{
          expandIcon: ({ isActive }) => (
            <UIIcons.ChevronRightIcon rotate={isActive ? 90 : 0} />
          ),
        }}
        spin={{ indicator: <UIIcons.LoaderCircleIcon spin /> }}
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
            pageTitleConfig,
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
