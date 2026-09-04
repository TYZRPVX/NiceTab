import { useEffect, useRef, useState, useMemo, memo, useCallback } from 'react';
import { theme, Skeleton, Modal, Space, Divider, Checkbox, Tooltip } from 'antd';
import type { CheckboxProps } from 'antd';
import {
  LockOutlined,
  StarOutlined,
  CloseOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { GroupItem, TabItem } from '~/entrypoints/types';
import ActionIconBtn from '~/entrypoints/common/components/ActionIconBtn';
import { ENUM_COLORS, UNNAMED_GROUP } from '~/entrypoints/common/constants';
import { openNewTab } from '~/entrypoints/common/tabs';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';
import { getDisplayGroupName } from '~/entrypoints/common/utils';

import EditInput from '../components/EditInput';
import TabListItem from './TabListItem';
import {
  StyledGroupWrapper,
  StyledGroupStickyHeader,
  StyledGroupHeaderRecycle,
  StyledTabActions,
  StyledTabListWrapper,
} from './TabGroup.styled';

type TabGroupProps = GroupItem & {
  canDrag?: boolean;
  canDrop?: boolean;
  allowGroupActions?: string[];
  allowTabActions?: string[];
  selected?: boolean;
  onRemove?: () => void;
  onRecover?: () => void;
  onTabChange?: (data: TabItem) => void;
  onTabRemove?: (groupId: string, tabs: TabItem[]) => void;
};

const defaultGroupActions = ['remove', 'recover'];
const defaultTabActions = ['open', 'remove'];

function TabGroup({
  groupId,
  groupName,
  createTime,
  tabList,
  isLocked,
  isStarred,
  selected,
  allowGroupActions = defaultGroupActions,
  allowTabActions = defaultTabActions,
  onRemove,
  onRecover,
  onTabChange,
  onTabRemove,
}: TabGroupProps) {
  const { token } = theme.useToken();
  const { $fmt } = useIntlUtls();
  const groupRef = useRef<HTMLDivElement>(null);
  const [rendering, setRendering] = useState(true);
  const [selectedTabIds, setSelectedTabIds] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [recoverModalVisible, setRecoverModalVisible] = useState(false);

  const group = useMemo(
    () => ({ groupId, groupName, createTime, isLocked, isStarred, selected }),
    [groupId, groupName, createTime, isLocked, isStarred, selected],
  );

  const tabListHeight = useMemo(() => {
    return tabList.length * 36 || 24;
  }, [tabList]);

  const groupDisplayName = useMemo(
    () => getDisplayGroupName({ groupName, tabList }),
    [groupName, tabList],
  );

  const removeDesc = useMemo(() => {
    const typeName = $fmt(`home.tabGroup`);
    return $fmt({
      id: 'home.removeDesc',
      values: {
        type: `${typeName}${` <strong>[${groupDisplayName}]</strong>`}`,
      },
    });
  }, [$fmt, groupDisplayName]);

  // 已选择的tabItem数组
  const selectedTabs = useMemo(() => {
    return tabList.filter(tab => selectedTabIds.includes(tab.tabId));
  }, [tabList, selectedTabIds]);
  // 是否全选
  const isAllChecked = useMemo(() => {
    return tabList.length > 0 && selectedTabIds.length === tabList.length;
  }, [tabList, selectedTabIds]);

  // 全选框 indeterminate 状态
  const checkAllIndeterminate = useMemo(() => {
    return selectedTabIds.length > 0 && selectedTabIds.length < tabList.length;
  }, [tabList, selectedTabIds]);
  // 全选
  const handleSelectAll: CheckboxProps['onChange'] = e => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedTabIds(tabList.map(tab => tab.tabId));
    } else {
      setSelectedTabIds([]);
    }
  };

  const handleTabGroupRemove = () => {
    setModalVisible(false);
    onRemove?.();
  };

  const handleTabGroupRecover = () => {
    setRecoverModalVisible(false);
    onRecover?.();
  };

  const handleTabsOpen = useCallback(() => {
    if (selectedTabs.length === 1) {
      openNewTab(selectedTabs[0].url, { active: true });
    } else {
      for (let tab of selectedTabs) {
        openNewTab(tab.url);
      }
    }
  }, [selectedTabs]);

  const handleTabRemove = useCallback(
    (tabs: TabItem[]) => {
      setSelectedTabIds(selectedTabIds =>
        selectedTabIds.filter(id => !tabs.some(tab => tab.tabId === id)),
      );
      if (onTabRemove) {
        // 给回收站使用
        onTabRemove(group.groupId, tabs);
        return;
      }
    },
    [group.groupId, onTabRemove],
  );

  useEffect(() => {
    let timer = null;
    if (selected || tabList.length < 120) {
      setRendering(false);
      return;
    }

    timer = setTimeout(() => {
      setRendering(false);
    }, 10);
    return () => clearTimeout(timer);
  }, [selected, tabList.length]);
  // useEffect(() => {
  //   setRendering(false);
  // }, []);

  if (rendering) return <Skeleton />;

  return (
    <>
      <StyledGroupWrapper
        className="tab-group-wrapper"
        data-gid={groupId}
        $active={selected}
        ref={groupRef}
      >
        {/* 标签组 header 展示、操作区域 */}
        <StyledGroupStickyHeader $active={selected}>
          <StyledGroupHeaderRecycle className="group-header select-none">
            <div className="group-header-top">
              {(isLocked || isStarred) && (
                <div className="group-status-wrapper">
                  {isLocked && (
                    <LockOutlined
                      style={{ fontSize: '18px', color: token.colorPrimaryHover }}
                    />
                  )}
                  {isStarred && (
                    <StarOutlined
                      style={{ fontSize: '18px', color: token.colorPrimaryHover }}
                    />
                  )}
                </div>
              )}
              <div className="group-name-wrapper">
                <EditInput
                  value={groupDisplayName || UNNAMED_GROUP}
                  disabled={!allowGroupActions.includes('rename')}
                  maxWidth={240}
                  fontSize={16}
                  iconSize={16}
                ></EditInput>
              </div>
              <div className="group-info">
                <span className="tab-count" style={{ color: ENUM_COLORS.volcano }}>
                  {$fmt({
                    id: 'home.tab.count',
                    values: { count: tabList?.length || 0 },
                  })}
                </span>
              </div>
            </div>
            <div className="group-action-btns">
              {allowGroupActions.includes('remove') && !isLocked && (
                <Tooltip
                  title={$fmt('home.tabGroup.remove')}
                  placement="top"
                  mouseEnterDelay={0.3}
                  destroyTooltipOnHide
                >
                  <ActionIconBtn
                    className="action-btn"
                    size={16}
                    hoverColor={ENUM_COLORS.red}
                    label={$fmt('home.tabGroup.remove')}
                    btnStyle="icon"
                    onClick={() => setModalVisible(true)}
                  >
                    <CloseOutlined />
                  </ActionIconBtn>
                </Tooltip>
              )}
              {allowGroupActions.includes('recover') && (
                <Tooltip
                  title={$fmt('home.tabGroup.recover')}
                  placement="top"
                  mouseEnterDelay={0.3}
                  destroyTooltipOnHide
                >
                  <ActionIconBtn
                    className="action-btn"
                    size={16}
                    label={$fmt('home.tabGroup.recover')}
                    btnStyle="icon"
                    onClick={() => setRecoverModalVisible(true)}
                  >
                    <ExportOutlined />
                  </ActionIconBtn>
                </Tooltip>
              )}
            </div>
          </StyledGroupHeaderRecycle>

          {/* tab 选择、操作区域 */}
          {tabList?.length > 0 && !isLocked && (
            <StyledTabActions>
              <div className="checkall-wrapper">
                <Checkbox
                  checked={isAllChecked}
                  indeterminate={checkAllIndeterminate}
                  onChange={handleSelectAll}
                ></Checkbox>
                <span
                  className="selected-count-text"
                  style={{ color: ENUM_COLORS.volcano }}
                >
                  {`${selectedTabIds.length} / ${tabList?.length}`}
                </span>
              </div>
              {selectedTabIds.length > 0 && (
                <Space
                  className="tab-action-btns select-none"
                  size={0}
                  split={
                    <Divider type="vertical" style={{ background: token.colorBorder }} />
                  }
                >
                  {allowTabActions.includes('open') && (
                    <span className="action-btn" onClick={handleTabsOpen}>
                      {$fmt('common.open')}
                    </span>
                  )}
                  {allowTabActions.includes('remove') && (
                    <span
                      className="action-btn"
                      onClick={() => {
                        setSelectedTabIds([]);
                        handleTabRemove(selectedTabs);
                      }}
                    >
                      {$fmt('common.remove')}
                    </span>
                  )}
                </Space>
              )}
            </StyledTabActions>
          )}
        </StyledGroupStickyHeader>

        {/* tab 列表 */}
        <StyledTabListWrapper
          className="tab-list-wrapper"
          style={{ minHeight: `${tabListHeight}px` }}
        >
          <Checkbox.Group
            className="tab-list-checkbox-group"
            value={selectedTabIds}
            onChange={setSelectedTabIds}
          >
            {tabList.map((tab, index) => (
              <TabListItem
                key={tab.tabId || index}
                tag={{ isLocked: false }}
                group={group}
                {...tab}
                selected={selectedTabIds.includes(tab.tabId)}
                onRemove={handleTabRemove}
                onChange={onTabChange}
              />
            ))}
          </Checkbox.Group>
        </StyledTabListWrapper>
      </StyledGroupWrapper>

      {/* 标签组删除确认弹窗 */}
      {modalVisible && (
        <Modal
          title={$fmt('home.removeTitle')}
          width={400}
          centered
          open={modalVisible}
          onOk={handleTabGroupRemove}
          onCancel={() => setModalVisible(false)}
        >
          <div dangerouslySetInnerHTML={{ __html: removeDesc }}>
            {/* {$fmt({ id: 'home.removeDesc', values: { type: $fmt(`home.tabGroup`) } })} */}
          </div>
        </Modal>
      )}
      {/* 还原确认弹窗 */}
      {recoverModalVisible && (
        <Modal
          title={$fmt('home.recoverTitle')}
          width={400}
          centered
          open={recoverModalVisible}
          onOk={handleTabGroupRecover}
          onCancel={() => setRecoverModalVisible(false)}
        >
          <div>
            {$fmt({ id: 'home.recoverDesc', values: { type: $fmt('home.tabGroup') } })}
          </div>
        </Modal>
      )}
    </>
  );
}

export default memo(TabGroup);
