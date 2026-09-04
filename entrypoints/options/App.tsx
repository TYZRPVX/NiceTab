import {
  lazy,
  Suspense,
  useContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  createHashRouter,
  RouterProvider,
  Outlet,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  theme,
  Menu,
  Dropdown,
  Space,
  Tooltip,
  Typography,
  Button,
  Badge,
  type MenuProps,
} from 'antd';
import {
  HomeOutlined,
  SettingOutlined,
  ImportOutlined,
  SyncOutlined,
  TranslationOutlined,
  RestOutlined,
  MoonOutlined,
  DesktopOutlined,
  SunOutlined,
  SmileOutlined,
  SendOutlined,
  MenuOutlined,
  ReloadOutlined,
  KeyOutlined,
  CoffeeOutlined,
  CameraOutlined,
  SaveOutlined,
  RollbackOutlined,
  SearchOutlined,
  ReadOutlined,
  HistoryOutlined,
  ToTopOutlined,
} from '@ant-design/icons';
import styled, { ThemeProvider } from 'styled-components';
import '~/assets/css/reset.css';
import '~/assets/css/index.css';
import { IconTheme } from '~/entrypoints/common/components/icon/CustomIcon';
import BrandMark from '~/entrypoints/common/components/BrandMark';
import ColorList from '~/entrypoints/common/components/ColorList.tsx';
import { pick, sendRuntimeMessage } from '~/entrypoints/common/utils';
import {
  ENUM_ACTION_NAME,
  ENUM_SETTINGS_PROPS,
  SHORTCUTS_PAGE_URL,
} from '~/entrypoints/common/constants';
import { actionHandler } from '../common/contextMenus';
import {
  GlobalContext,
  useIntlUtls,
  eventEmitter,
} from '~/entrypoints/common/hooks/global';
import useMenus from '~/entrypoints/common/hooks/menu';
import { settingsUtils } from '~/entrypoints/common/storage';
import useUpdate from '~/entrypoints/common/hooks/update';
import usePermission from '~/entrypoints/common/hooks/getPermission';
import useUrlParams from '~/entrypoints/common/hooks/urlParams';
import {
  LANGUAGE_OPTIONS,
  THEME_COLORS,
  defaultThemeType,
} from '~/entrypoints/common/constants';
import {
  openNewTab,
  discardOtherTabs,
  saveOpenedTabsAsSnapshot,
  restoreOpenedTabsSnapshot,
  openUserGuide,
  openChangelog,
} from '~/entrypoints/common/tabs';
import {
  StyledActionIconBtn,
  GlobalStyle,
} from '~/entrypoints/common/style/Common.styled';
import type {
  StyledThemeProps,
  PageModuleNames,
  PageWidthTypes,
  ThemeTypes,
} from '~/entrypoints/types';
const Home = lazy(() => import('./home/index.tsx'));
const Settings = lazy(() => import('./settings/index.tsx'));
const ImportExport = lazy(() => import('./importExport/index.tsx'));
const SyncPage = lazy(() => import('./sync/index.tsx'));
const RecycleBin = lazy(() => import('./recycleBin/index.tsx'));
import SendTargetActionHolder, {
  type SendTargetActionHolderProps,
} from '~/entrypoints/options/home/SendTargetActionHolder';
import { GlobalSearchPanel } from '~/entrypoints/common/components/BaseGlobalSearch';
import { useGlobalSearchPanel } from '~/entrypoints/common/hooks/globalSearch';
import { type LocaleKeys } from '~/entrypoints/common/locale';

const { SHOW_SEND_TARGET_MODAL } = ENUM_SETTINGS_PROPS;

const StyledPageContainer = styled.div<{
  theme: StyledThemeProps;
  $widthType: PageWidthTypes;
}>`
  .header-navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    height: 64px;
    box-sizing: border-box;
    border-bottom: 1px solid var(--nt-border);
    background: var(--nt-surface);

    .logo {
      display: grid;
      place-items: center;
      width: 72px;
      height: 100%;
      color: var(--nt-text);

      svg {
        width: 28px;
        height: 28px;
      }
    }
    .navbar-menu {
      flex: 1;
      min-width: 0;
      margin-left: 4px;
      border-bottom: 0;
      background: transparent;

      &.nicetab-menu-horizontal {
        line-height: normal;
        border-bottom: 0;
        background: transparent;
      }
      .nicetab-menu-item {
        display: flex;
        align-items: center;
        height: 40px;
        margin-inline: 2px;
        padding-inline: 12px;
        border-radius: 20px;
      }
      .nicetab-menu-item::after {
        display: none;
      }
      .nicetab-menu-item:hover {
        background: var(--nt-surface-muted);
      }
      .nicetab-menu-item-selected {
        background: var(--nt-accent-soft);
      }
    }
    .menu-right {
      display: flex;
      align-items: center;
      padding: 0 24px;
      color: var(--nt-text-secondary);
      font-size: 12px;
    }
  }
  .main-content {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding: 80px 32px 40px;
    margin: 0 auto;
  }
  .route-loading {
    display: grid;
    min-height: calc(100vh - 184px);
    place-items: center;
    color: var(--nt-text-secondary);
    font-size: 13px;
  }
  .float-button-box {
    position: fixed;
    bottom: 24px;
    left: 50%;
    z-index: 12;
    display: flex;
    gap: 8px;
    padding: 6px;
    border: 1px solid var(--nt-border);
    border-radius: 999px;
    box-shadow: var(--nt-shadow-md);
    background: color-mix(in srgb, var(--nt-surface) 94%, transparent);
    transform: translateX(-50%);
  }
  @media screen and (max-width: 1199px) {
    .main-content {
      max-width: 100%;
    }
  }
  @media screen and (min-width: 1200px) {
    .main-content {
      width: 100%;
      /* 不再固定宽度 */
      // width: ${props => (props.$widthType === 'fixed' ? '1200px' : '100%')};
    }
  }
`;

interface NavProps {
  key: PageModuleNames;
  label: LocaleKeys;
  path: string;
  icon?: JSX.Element;
  element: JSX.Element;
}

const navsTemplate: NavProps[] = [
  {
    key: 'home',
    label: 'common.list',
    path: '/home',
    icon: <HomeOutlined />,
    element: <Home />,
  },
  {
    key: 'settings',
    label: 'common.settings',
    path: '/settings',
    icon: <SettingOutlined />,
    element: <Settings />,
  },
  {
    key: 'import-export',
    label: 'common.importExport',
    path: '/import-export',
    icon: <ImportOutlined />,
    element: <ImportExport />,
  },
  {
    key: 'sync',
    label: 'common.sync',
    path: '/sync',
    icon: <SyncOutlined />,
    element: <SyncPage />,
  },
  {
    key: 'recycle-bin',
    label: 'common.recycleBin',
    path: '/recycle',
    icon: <RestOutlined />,
    element: <RecycleBin />,
  },
];

const router = createHashRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      ...navsTemplate.map(item => pick(item, ['path', 'element'])),
    ],
  },
]);

const themeTypes: ThemeTypes[] = ['light', 'dark', 'auto'];

type SettingsSaveAction = {
  hasChanged: boolean;
  onSave: () => void;
};

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const NiceGlobalContext = useContext(GlobalContext);
  const { updateDetail, updateReload } = useUpdate();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [settingsSaveAction, setSettingsSaveAction] = useState<SettingsSaveAction>();
  const { $fmt, locale } = useIntlUtls();
  const { urlParams, setSearchParams } = useUrlParams();
  const sendTargetActionRef = useRef<SendTargetActionHolderProps>();

  const { isFirefoxTabGroupSupported, hasTabGroupsPermission, getTabGroupsPermission } =
    usePermission();

  const { version, themeTypeConfig, pageWidthType, $message } = NiceGlobalContext;
  const navs = useMemo(() => {
    return navsTemplate.map(item => {
      return { ...item, label: $fmt(item.label) };
    });
  }, [$fmt]);

  const { globalSearchPanelRef, open: openGlobalSearchPanel } = useGlobalSearchPanel();

  // 导航菜单
  const onSelect = useCallback(
    ({ key }: { key: string }) => {
      const nav = navs.find(item => item.key === key);
      if (nav) {
        nav && navigate(nav.path);
      }
    },
    [navs, navigate],
  );
  const handleThemeTypeChange = () => {
    const currThemeType = NiceGlobalContext.themeType || defaultThemeType;
    let index = themeTypes.indexOf(currThemeType);
    const themeType = themeTypes[(index + 1) % 3];

    NiceGlobalContext.setThemeType(themeType);
    sendRuntimeMessage({ msgType: 'setThemeType', data: { themeType } });
  };
  // 切换主题
  const handleThemeChange = (color: string) => {
    const themeData = { colorPrimary: color };
    NiceGlobalContext.setThemeData(themeData);
    sendRuntimeMessage({ msgType: 'setPrimaryColor', data: themeData });
  };
  // 切换语言
  const handleLocaleChange = useCallback(({ key }: { key: string }) => {
    const option = LANGUAGE_OPTIONS.find(item => item.key === key) || {
      locale: 'zh-CN',
    };
    NiceGlobalContext.setLocale(option.locale);
    sendRuntimeMessage({ msgType: 'setLocale', data: { locale: option.locale } });
  }, []);

  const handleSendAllTabs = useCallback(async () => {
    // 这里之所以没有直接使用 strategyHandler 方法，是因为在 option 页面中发送消息，本页面是不会监听到 runtimeMessage 消息的
    const settings = await settingsUtils.getSettings();
    if (settings[SHOW_SEND_TARGET_MODAL]) {
      sendTargetActionRef.current?.show?.({ actionName: ENUM_ACTION_NAME.SEND_ALL_TABS });
    } else {
      // 该方法会直接发送，不会显示发送目标选择弹窗
      actionHandler(ENUM_ACTION_NAME.SEND_ALL_TABS);
    }
  }, []);

  const { createMenus } = useMenus();
  // 插件操作选项
  const extActionOptions = useMemo(
    () =>
      createMenus([
        { key: 'sendAllTabs', icon: <SendOutlined />, label: $fmt('common.sendAllTabs') },
        {
          key: 'createSnapshot',
          icon: <CameraOutlined />,
          label: $fmt('home.createSnapshot'),
          tip: $fmt('home.createSnapshot.tip'),
        },
        {
          key: 'restoreSnapshot',
          icon: <RollbackOutlined />,
          label: $fmt('home.restoreSnapshot'),
        },
        {
          key: 'userGuide',
          icon: <ReadOutlined />,
          label: $fmt('common.userGuide'),
        },
        {
          key: 'changelog',
          icon: <HistoryOutlined />,
          label: $fmt('common.changelog'),
        },
        {
          key: 'bindShortcuts',
          icon: <KeyOutlined />,
          label: $fmt('common.bindShortcuts'),
          tip: import.meta.env.FIREFOX ? $fmt('common.bindShortcuts.tip') : '',
          disabled: import.meta.env.FIREFOX,
        },
        {
          key: 'hibernateTabs',
          icon: <CoffeeOutlined />,
          label: $fmt('common.hibernateTabs'),
        },
        {
          key: 'startSync',
          icon: <SyncOutlined />,
          label: $fmt('common.startSync'),
        },
        { key: 'reload', icon: <ReloadOutlined />, label: $fmt('common.reload') },
      ]),
    [$fmt],
  );

  const handleExtActionClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'sendAllTabs') {
      handleSendAllTabs();
    } else if (key === 'reload') {
      browser.runtime.reload();
    } else if (key === 'userGuide') {
      openUserGuide();
    } else if (key === 'changelog') {
      openChangelog();
    } else if (key === 'bindShortcuts') {
      openNewTab(SHORTCUTS_PAGE_URL, {
        active: true,
        openToNext: true,
      });
    } else if (key === 'hibernateTabs') {
      discardOtherTabs();
    } else if (key === 'createSnapshot') {
      await saveOpenedTabsAsSnapshot('manualSave');
      $message.success($fmt('common.saveSuccess'));
    } else if (key === 'restoreSnapshot') {
      await restoreOpenedTabsSnapshot('manualSave');
    } else if (key === 'startSync') {
      actionHandler(ENUM_ACTION_NAME.START_SYNC);
    }
  };

  useEffect(() => {
    const nav = navs.find(item => item.path === location.pathname);
    setSelectedKeys([nav?.key || 'home']);
  }, [location.pathname]);

  useEffect(() => {
    const root = document.documentElement;
    let isHoveringScrollbar = false;
    let hideTimer: number | undefined;

    const clearHideTimer = () => {
      if (hideTimer) window.clearTimeout(hideTimer);
      hideTimer = undefined;
    };
    const hide = () => {
      if (!isHoveringScrollbar) root.classList.remove('nt-scrollbar-visible');
    };
    const showWhileScrolling = () => {
      root.classList.add('nt-scrollbar-visible');
      clearHideTimer();
      if (!isHoveringScrollbar) hideTimer = window.setTimeout(hide, 800);
    };
    const handlePointerMove = (event: PointerEvent) => {
      const isNearScrollbar = event.clientX >= document.documentElement.clientWidth - 16;
      if (isNearScrollbar) {
        isHoveringScrollbar = true;
        root.classList.add('nt-scrollbar-visible');
        clearHideTimer();
      } else if (isHoveringScrollbar) {
        isHoveringScrollbar = false;
        clearHideTimer();
        hideTimer = window.setTimeout(hide, 160);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('scroll', showWhileScrolling, {
      capture: true,
      passive: true,
    });
    return () => {
      clearHideTimer();
      root.classList.remove('nt-scrollbar-visible');
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('scroll', showWhileScrolling, true);
    };
  }, []);

  useEffect(() => {
    const handleSettingsSaveActionChange = (action: SettingsSaveAction | undefined) => {
      setSettingsSaveAction(action);
    };
    eventEmitter.on('settings:save-action-change', handleSettingsSaveActionChange);
    return () =>
      eventEmitter.off('settings:save-action-change', handleSettingsSaveActionChange);
  }, []);

  useEffect(() => {
    if (!urlParams.action) return;
    if (urlParams.action === 'globalSearch') {
      openGlobalSearchPanel();
      setSearchParams({});
    }
  }, [urlParams.action, setSearchParams, openGlobalSearchPanel]);

  return (
    <ThemeProvider theme={{ ...themeTypeConfig, ...token }}>
      <SendTargetActionHolder ref={sendTargetActionRef}></SendTargetActionHolder>
      <GlobalSearchPanel
        ref={globalSearchPanelRef}
        pageContext="optionsPage"
      ></GlobalSearchPanel>

      <StyledPageContainer $widthType={pageWidthType} className="page-container">
        <GlobalStyle />
        <div className="header-navbar select-none">
          <div className="logo">
            <BrandMark />
          </div>
          <Menu
            className="navbar-menu"
            mode="horizontal"
            defaultSelectedKeys={['home']}
            selectedKeys={selectedKeys}
            items={navs}
            onSelect={onSelect}
          />

          {isFirefoxTabGroupSupported && !hasTabGroupsPermission && (
            <Space className="header-tip select-none" style={{ margin: '0 12px' }}>
              <a className="link" onClick={getTabGroupsPermission}>
                {$fmt('home.getPermission.tabGroups')}
              </a>
            </Space>
          )}
          {updateDetail?.updateAvailable && (
            <Space className="header-tip select-none" style={{ margin: '0 12px' }}>
              <Typography.Text type="warning">
                {$fmt({
                  id: 'common.update.available',
                  values: { version: updateDetail?.version || <SmileOutlined /> },
                })}
                :
              </Typography.Text>
              <a className="link" onClick={updateReload}>
                {$fmt('common.update.upgradeNow')}
              </a>
            </Space>
          )}

          <Space className="menu-right select-none" align="center" size="middle">
            <div>
              {$fmt('common.version')}: {version}
            </div>
            {/* theme */}
            <Tooltip
              placement="bottom"
              color={token.colorBgElevated}
              title={
                <ColorList
                  colors={THEME_COLORS}
                  gap={12}
                  style={{ padding: '6px' }}
                  onItemClick={handleThemeChange}
                />
              }
              arrow={false}
              fresh
            >
              <StyledActionIconBtn
                $size={18}
                aria-label={$fmt('common.theme')}
                title={$fmt('common.theme')}
              >
                <IconTheme></IconTheme>
              </StyledActionIconBtn>
            </Tooltip>
            {/* theme type */}
            <StyledActionIconBtn
              $size={18}
              title={$fmt('common.toggleThemeType')}
              aria-label={$fmt('common.toggleThemeType')}
              onClick={handleThemeTypeChange}
            >
              {NiceGlobalContext.themeType === 'light' && <SunOutlined />}
              {NiceGlobalContext.themeType === 'dark' && <MoonOutlined />}
              {NiceGlobalContext.themeType === 'auto' && <DesktopOutlined />}
            </StyledActionIconBtn>
            {/* language */}
            <Dropdown
              menu={{
                items: LANGUAGE_OPTIONS,
                selectedKeys: [locale],
                onClick: handleLocaleChange,
              }}
              placement="bottomRight"
            >
              <StyledActionIconBtn
                $size={18}
                title={$fmt('common.language')}
                aria-label={$fmt('common.language')}
              >
                <TranslationOutlined />
              </StyledActionIconBtn>
            </Dropdown>
            {/* ext actions */}
            <Dropdown
              menu={{
                items: extActionOptions,
                onClick: handleExtActionClick,
              }}
            >
              <StyledActionIconBtn
                $size={18}
                title={$fmt('common.actions')}
                aria-label={$fmt('common.actions')}
              >
                <MenuOutlined />
              </StyledActionIconBtn>
            </Dropdown>
          </Space>
        </div>
        <div className="main-content">
          <Suspense fallback={<div className="route-loading">Loading…</div>}>
            <Outlet></Outlet>
          </Suspense>
        </div>

        <div className="float-button-box">
          {/* 回到顶部 */}
          <Button
            shape="circle"
            icon={<ToTopOutlined />}
            title={$fmt('common.backToTop')}
            aria-label={$fmt('common.backToTop')}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />

          <Button
            shape="circle"
            icon={<SearchOutlined />}
            title={$fmt('home.searchTabAndUrl')}
            aria-label={$fmt('home.searchTabAndUrl')}
            onClick={openGlobalSearchPanel}
          />

          {location.pathname === '/settings' ? (
            <Badge
              dot={settingsSaveAction?.hasChanged}
              color={token.colorPrimary}
              offset={[-2, 4]}
            >
              <Button
                shape="circle"
                type={settingsSaveAction?.hasChanged ? 'primary' : 'default'}
                icon={<SaveOutlined />}
                title={$fmt('common.save')}
                aria-label={$fmt('common.save')}
                onClick={settingsSaveAction?.onSave}
              />
            </Badge>
          ) : (
            <Button
              shape="circle"
              icon={<SendOutlined />}
              title={$fmt('common.sendAllTabs')}
              aria-label={$fmt('common.sendAllTabs')}
              onClick={handleSendAllTabs}
            />
          )}
        </div>
      </StyledPageContainer>
    </ThemeProvider>
  );
}

export default function AppRoute() {
  return <RouterProvider router={router} />;
}
