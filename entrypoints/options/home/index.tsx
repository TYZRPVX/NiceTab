import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash-es';
import {
  theme,
  Flex,
  Button,
  Dropdown,
  Modal,
  Drawer,
  Space,
  Typography,
  Tooltip,
  Divider,
  type MenuProps,
} from 'antd';
import {
  FolderOutlined,
  FolderOpenOutlined,
  FolderAddOutlined,
  QuestionCircleOutlined,
  MenuOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';
import useGlobalSelectionBox, {
  StyledSelectionBox,
} from '~/entrypoints/common/hooks/selectionBox';
import { classNames } from '~/entrypoints/common/utils';
import {
  tabListUtils,
  settingsUtils,
  stateUtils,
  recycleUtils,
  initTabListStorageListener,
} from '~/entrypoints/common/storage';
import {
  ENUM_SETTINGS_PROPS,
  SHORTCUTS_PAGE_URL,
  shortcutsPageUrlMap,
  type BrowserType,
} from '~/entrypoints/common/constants';
import {
  openNewTab,
  reloadOtherAdminPage,
  updateAdminPageUrlDebounced,
  openUserGuide,
} from '~/entrypoints/common/tabs';

import { StyledActionIconBtn } from '~/entrypoints/common/style/Common.styled';
import {
  defaultSidebarWidth,
  defaultRightPanelWidth,
} from '~/entrypoints/options/Layout.styled';
import {
  StyledSidebarWrapper,
  StyledMainWrapper,
  StyledHelpInfoBox,
} from './Home.styled';
import ToggleLockedBtn from './components/ToggleLockedBtn';
import RightPanel from './rightPanel/RightPanel';
import SearchTabsBtn from './components/SearchTabsBtn';
import SortingBtns from './components/SortingBtns';
import HotkeyList from '../components/HotkeyList';
// import StickyFooter from '~/entrypoints/common/components/StickyFooter';
// import Footer from './footer/index';
import { useTreeData, HomeContext } from './hooks/treeData';
import useCustomEventListener from './hooks/homeCustomEvent';
import useHotkeys from './hooks/hotkeys';
import { getSelectedCounts } from './utils';
import TreeBox from './TreeBox';
import TabGroupList from './TabGroupList';
// import FooterFloatButton from './components/FooterFloatButton';
// const { TAB_COUNT_THRESHOLD } = ENUM_SETTINGS_PROPS;

const minimumMainContentWidth = 640;

export default function Home() {
  const { token } = theme.useToken();
  const { $fmt } = useIntlUtls();
  const treeDataHook = useTreeData();
  const {
    countInfo,
    selectedTagKey,
    selectedTag,
    selectedTagData,
    handleMoreItemClick,
    toggleExpand,
    refreshTreeData,
    handleTagCreate,
    handleTagChange,
    handleHotkeyAction,
  } = treeDataHook || {};

  // 事件监听
  useCustomEventListener(treeDataHook);

  const { hotkeyList } = useHotkeys({ onAction: handleHotkeyAction });

  const multiSelectContainerRef = useRef<HTMLDivElement>(null);
  const [isAllowed, setIsAllowed] = useState<boolean>(true);
  const onMouseUp = useCallback(() => {
    setIsAllowed(true);
  }, []);
  const { isSelecting, isSelectMoving, actionType, selectionBoxData } =
    useGlobalSelectionBox({
      container:
        multiSelectContainerRef.current ||
        document.getElementById('tab-group-list-panel') ||
        document.body,
      isAllowed: isAllowed && !selectedTagData?.isLocked,
      disabledSelectors: [
        '.tab-list-item',
        '.checkall-wrapper',
        '.tab-action-btns',
        '.group-header',
      ],
      onMouseUp,
    });

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    return stateUtils.state?.home?.sidebarCollapsed || false;
  });
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    return stateUtils.state?.home?.sidebarWidth || defaultSidebarWidth;
  });
  const [openedTabsCollapsed, setOpenedTabsCollapsed] = useState<boolean>(() => {
    return stateUtils.state?.home?.rightPanelCollapsed || false;
  });
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(() => {
    return stateUtils.state?.home?.rightPanelWidth || 400;
  });
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const autoHideOpenedTabs =
    !openedTabsCollapsed &&
    viewportWidth <
      (sidebarCollapsed ? 0 : sidebarWidth) + rightPanelWidth + minimumMainContentWidth;
  const effectiveOpenedTabsCollapsed = openedTabsCollapsed || autoHideOpenedTabs;

  const onCollapseChange = (status: boolean) => {
    setSidebarCollapsed(status);
    stateUtils.setStateByModule('home', { sidebarCollapsed: status });
    reloadOtherAdminPage();
  };

  const persistSidebarWidth = useMemo(
    () =>
      debounce((width: number) => {
        stateUtils.setStateByModule('home', { sidebarWidth: width });
        reloadOtherAdminPage();
      }, 1000),
    [],
  );
  const onSidebarWidthChange = (width: number) => {
    setSidebarWidth(width);
    persistSidebarWidth(width);
  };

  const onRightPanelCollapseChange = (status: boolean) => {
    setOpenedTabsCollapsed(status);
    stateUtils.setStateByModule('home', { rightPanelCollapsed: status });
    reloadOtherAdminPage();
  };

  const persistRightPanelWidth = useMemo(
    () =>
      debounce((width: number) => {
        stateUtils.setStateByModule('home', { rightPanelWidth: width });
        reloadOtherAdminPage();
      }, 1000),
    [],
  );
  const onRightPanelWidthChange = (width: number) => {
    setRightPanelWidth(width);
    persistRightPanelWidth(width);
  };

  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [helpDrawerVisible, setHelpDrawerVisible] = useState<boolean>(false);

  // 是否开启虚拟滚动（数据量大时开启虚拟滚动）
  const virtualMap = useMemo(() => {
    // const settings = settingsUtils.settings || {};
    const { groupCount = 0, tabCount = 0 } = getSelectedCounts(selectedTagData);
    // console.log('virtualMap', groupCount, tabCount);
    return {
      tree: (countInfo?.groupCount || 0) > 120 || groupCount > 20,
      // tabList: tabCount > (settings?.[TAB_COUNT_THRESHOLD] || 300),
      tabList: groupCount > 12 || tabCount > 50,
    };
  }, [selectedTagData, countInfo?.groupCount]);

  const moreItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'clear',
        label: $fmt('home.clearAll'),
        icon: <ClearOutlined />,
      },
    ],
    [$fmt],
  );

  // 确认清空全部
  const handleClearConfirm = () => {
    handleMoreItemClick('clear');
    setConfirmModalVisible(false);
  };

  const onMoreItemClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'clear') {
      setConfirmModalVisible(true);
    }
  };

  // 按名称排序
  const onNameSort = useCallback(
    async (sortType: string) => {
      if (!selectedTagKey) return;
      await tabListUtils.groupListSortbyName(sortType, selectedTagKey);
      refreshTreeData();
    },
    [selectedTagKey],
  );

  // 按创建时间排序
  const onCreateTimeSort = useCallback(
    async (sortType: string) => {
      if (!selectedTagKey) return;
      await tabListUtils.groupListSortbyCreateTime(sortType, selectedTagKey);
      refreshTreeData();
    },
    [selectedTagKey],
  );

  const lockTagBtnVisible = useMemo(() => {
    return !selectedTagData?.static;
  }, [selectedTagData]);

  const onLockStatusChange = async (status: boolean) => {
    const selectedKeys = await stateUtils.getHomeSelectedKeys();
    handleTagChange(selectedKeys.selectedTagKey || '', {
      isLocked: status,
    });
  };

  useEffect(() => {
    recycleUtils.checkAndClear();

    return initTabListStorageListener(async tabList => {
      const currWindow = await browser.windows.getCurrent();
      setTimeout(() => {
        if (!currWindow.focused) {
          updateAdminPageUrlDebounced();
        }
      }, 500);
    });
  }, []);

  return (
    <>
      <StyledSelectionBox
        style={{
          position: 'fixed',
          display: selectionBoxData.display,
          top: selectionBoxData.top + 'px',
          left: selectionBoxData.left + 'px',
          width: selectionBoxData.width + 'px',
          height: selectionBoxData.height + 'px',
        }}
      ></StyledSelectionBox>
      <HomeContext.Provider
        value={{
          treeDataHook,
          selectionBoxHook: {
            isSelecting,
            isSelectMoving,
            actionType,
            selectionBoxData,
            setIsAllowed,
          },
        }}
      >
        <StyledMainWrapper
          className={classNames('home-wrapper')}
          style={
            {
              '--sidebar-grid-col': `${sidebarCollapsed ? 0 : sidebarWidth}px`,
              '--right-panel-grid-col': `${effectiveOpenedTabsCollapsed ? 0 : rightPanelWidth}px`,
            } as React.CSSProperties
          }
        >
          <StyledSidebarWrapper
            className="sidebar"
            collapsed={sidebarCollapsed}
            sidebarWidth={sidebarWidth}
            initialWidth={defaultSidebarWidth}
            onCollapseChange={onCollapseChange}
            onWidthChange={onSidebarWidthChange}
            sideActionBox={
              <>
                <SearchTabsBtn></SearchTabsBtn>
                {lockTagBtnVisible && (
                  <ToggleLockedBtn
                    isLocked={selectedTagData?.isLocked}
                    onLockStatusChange={onLockStatusChange}
                  ></ToggleLockedBtn>
                )}
                {selectedTagKey ? <SortingBtns onSort={onNameSort}></SortingBtns> : null}
                {selectedTagKey ? (
                  <SortingBtns
                    sortBy="createTime"
                    onSort={onCreateTimeSort}
                  ></SortingBtns>
                ) : null}
              </>
            }
            innerContent={
              <>
                <div className="tag-list-title">
                  {$fmt('home.tabGroupList')}
                  <Tooltip
                    title={$fmt('home.helpInfo')}
                    placement="top"
                    mouseEnterDelay={0.3}
                    destroyTooltipOnHide
                  >
                    <StyledActionIconBtn
                      className="btn-help"
                      aria-label={$fmt('home.helpInfo')}
                      onClick={() => setHelpDrawerVisible(true)}
                    >
                      <QuestionCircleOutlined />
                    </StyledActionIconBtn>
                  </Tooltip>
                </div>
                <ul className="count-info">
                  <li>
                    {$fmt('home.tag')} ({countInfo?.tagCount})
                  </li>
                  <li>
                    {$fmt('home.tabGroup')} ({countInfo?.groupCount})
                  </li>
                  <li>
                    {$fmt('home.tab')} ({countInfo?.tabCount})
                  </li>
                </ul>
                {/* 顶部操作按钮组 */}
                <div className="sidebar-action-btns-wrapper">
                  <Space size={12}>
                    <Tooltip
                      title={$fmt('home.collapseAll')}
                      placement="top"
                      mouseEnterDelay={0.3}
                      destroyTooltipOnHide
                    >
                      <StyledActionIconBtn
                        $size="20"
                        aria-label={$fmt('home.collapseAll')}
                        onClick={() => toggleExpand(false)}
                      >
                        <FolderOutlined />
                      </StyledActionIconBtn>
                    </Tooltip>
                    <Tooltip
                      title={$fmt('home.expandAll')}
                      placement="top"
                      mouseEnterDelay={0.3}
                      destroyTooltipOnHide
                    >
                      <StyledActionIconBtn
                        $size="20"
                        aria-label={$fmt('home.expandAll')}
                        onClick={() => toggleExpand(true)}
                      >
                        <FolderOpenOutlined />
                      </StyledActionIconBtn>
                    </Tooltip>
                    <Tooltip
                      title={$fmt('home.addTag')}
                      placement="top"
                      mouseEnterDelay={0.3}
                      destroyTooltipOnHide
                    >
                      <StyledActionIconBtn
                        $size="20"
                        aria-label={$fmt('home.addTag')}
                        onClick={handleTagCreate}
                      >
                        <FolderAddOutlined />
                      </StyledActionIconBtn>
                    </Tooltip>
                  </Space>

                  <Dropdown
                    menu={{ items: moreItems, onClick: onMoreItemClick }}
                    placement="bottomLeft"
                  >
                    <Tooltip
                      title={$fmt('common.more')}
                      placement="top"
                      mouseEnterDelay={0.3}
                      destroyTooltipOnHide
                    >
                      <StyledActionIconBtn
                        className="btn-more"
                        $size="18"
                        aria-label={$fmt('common.more')}
                      >
                        <MenuOutlined />
                      </StyledActionIconBtn>
                    </Tooltip>
                  </Dropdown>
                </div>

                {/* 分类和标签组列表 */}
                <TreeBox></TreeBox>
              </>
            }
          />

          {/* 标签组和标签页列表 */}
          <div ref={multiSelectContainerRef} id="tab-group-list-panel">
            <TabGroupList virtual={virtualMap.tabList}></TabGroupList>
          </div>

          {/* 右侧面板 */}
          <RightPanel
            collapsed={effectiveOpenedTabsCollapsed}
            autoHide={autoHideOpenedTabs}
            panelWidth={rightPanelWidth}
            initialWidth={defaultRightPanelWidth}
            onCollapseChange={onRightPanelCollapseChange}
            onWidthChange={onRightPanelWidthChange}
          ></RightPanel>
        </StyledMainWrapper>

        {/* 吸底footer */}
        {/* <StickyFooter bottomGap={0} fullWidth>
          <Footer></Footer>
        </StickyFooter> */}

        {/* <FooterFloatButton></FooterFloatButton> */}

        {/* 清空全部提示 */}
        <Modal
          title={$fmt('home.removeTitle')}
          width={400}
          centered
          open={confirmModalVisible}
          onOk={handleClearConfirm}
          onCancel={() => setConfirmModalVisible(false)}
        >
          <div>{$fmt('home.clearDesc')}</div>
        </Modal>

        {/* 帮助信息弹层 */}
        <Drawer
          title={$fmt('home.helpInfo')}
          open={helpDrawerVisible}
          onClose={() => setHelpDrawerVisible(false)}
          width={600}
        >
          <StyledHelpInfoBox>
            {/* 用户指南 */}
            <p style={{ marginBottom: '8px' }}>
              {$fmt({
                id: 'home.help.tip.userGuide',
                values: {
                  userGuide: (
                    <a className="link" onClick={openUserGuide}>
                      {$fmt('common.userGuide')}
                    </a>
                  ),
                },
              })}
            </p>

            {import.meta.env.FIREFOX && (
              <>
                <p style={{ marginBottom: '4px' }}>
                  <strong>{$fmt('common.note')}</strong>:
                  {$fmt('home.help.reminder.start')}
                </p>
                <ul
                  dangerouslySetInnerHTML={{ __html: $fmt('home.help.reminder.list') }}
                ></ul>
                <p style={{ marginBottom: '8px' }}>{$fmt('home.help.reminder.end')}</p>
                <Divider></Divider>
              </>
            )}

            <ul dangerouslySetInnerHTML={{ __html: $fmt('home.help.content') }}></ul>

            <p style={{ marginBottom: '8px' }}>
              <strong>{$fmt('common.hotkeys')}</strong>
            </p>
            <HotkeyList list={hotkeyList}></HotkeyList>

            <ul style={{ marginTop: '8px' }}>
              <li>
                {$fmt('home.help.hotkey.1')}
                <Space>
                  <strong>"{$fmt('common.openAdminTab')}",</strong>
                  <strong>"{$fmt('common.sendAllTabs')}",</strong>
                  <strong>"{$fmt('common.sendCurrentTab')}"</strong>
                </Space>
                {$fmt('home.help.hotkey.2')}
                {import.meta.env.FIREFOX ? (
                  <span>{$fmt('home.help.hotkey.modify')}</span>
                ) : (
                  <a
                    className="link"
                    onClick={() =>
                      openNewTab(SHORTCUTS_PAGE_URL, {
                        active: true,
                        openToNext: true,
                      })
                    }
                  >
                    {$fmt('home.help.hotkey.modify')}
                  </a>
                )}
                <Tooltip
                  color={token.colorBgContainer}
                  title={
                    <Flex vertical>
                      {['chrome', 'edge', 'firefox'].map(type => (
                        <Typography.Text key={type}>
                          <strong>{type}: </strong>
                          {shortcutsPageUrlMap[type as BrowserType]}
                        </Typography.Text>
                      ))}
                      <Typography.Text>
                        {$fmt('home.help.hotkey.modifyTip')}
                      </Typography.Text>
                    </Flex>
                  }
                  styles={{ root: { maxWidth: '300px', width: '300px' } }}
                >
                  <QuestionCircleOutlined style={{ marginLeft: '4px' }} />
                </Tooltip>
              </li>
            </ul>
          </StyledHelpInfoBox>
        </Drawer>
      </HomeContext.Provider>
    </>
  );
}
