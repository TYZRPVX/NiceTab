import { useState, useCallback, useEffect, useMemo } from 'react';
import { browser, Tabs } from 'wxt/browser';
import { Tooltip } from 'antd';
import {
  RightOutlined,
  DownOutlined,
  CloseOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';
import { classNames, getDisplayGroupName } from '~/entrypoints/common/utils';
import { ENUM_COLORS } from '~/entrypoints/common/constants';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';
import DndComponent, {
  idleState,
  type DraggableStateItem,
  type DragData,
} from '~/entrypoints/common/components/DndComponent';
import ActionBtnList, {
  type ActionOptionItem,
} from '~/entrypoints/common/components/ActionBtnList';
import TabItem, { type TabItemProps, type TabActions, QuickSelectFunc } from './TabItem';
import { StyledGroupWrapper } from './OpenedTabs.styled';
import { dndKeys } from '../constants';

const dndKey = dndKeys.tabItem;

export type TabGroupItemProps = {
  groupId: number;
  groupName: string;
  color?: string;
  collapsed?: boolean;
  tabs: Tabs.Tab[];
};

export type TabGroupItemParams = {
  group: TabGroupItemProps;
  selectedTabs: Tabs.Tab[];
  quickSelectedTabIds?: number[];
  draggableState?: DraggableStateItem;
  draggingTabItem?: Tabs.Tab | null;
  onAction: TabItemProps['onAction'];
  onDragStateChange?: (value: DraggableStateItem, tab: Tabs.Tab) => void;
  onQuickSelect?: QuickSelectFunc;
  onGroupAction?: (action: TabActions, group: TabGroupItemProps) => void;
};

export type OpenedTabsDragData = DragData & {
  id?: Tabs.Tab['id'];
  selectedTabs: Tabs.Tab[];
};

export default function TabGroupItem({
  group,
  selectedTabs = [],
  quickSelectedTabIds = [],
  draggableState,
  draggingTabItem,
  onAction,
  onDragStateChange,
  onQuickSelect,
  onGroupAction,
}: TabGroupItemParams) {
  const { $fmt } = useIntlUtls();
  const [collapsed, setCollapsed] = useState(group.collapsed);
  const groupDisplayName = useMemo(
    () => getDisplayGroupName({ groupName: group.groupName, tabList: group.tabs }),
    [group.groupName, group.tabs],
  );
  const collapseLabel = $fmt({
    id: collapsed ? 'home.expand' : 'home.collapse',
    values: { name: groupDisplayName },
  });

  const selectedTabIds = selectedTabs.map(tab => tab.id!);

  const onToggle = useCallback(() => {
    setCollapsed(value => !value);
  }, []);

  const autoFocus = useCallback(() => {
    const hasActiveTab = group.tabs?.find(tab => tab.active);
    if (hasActiveTab) {
      setCollapsed(false);
    }
  }, [group.tabs]);

  useEffect(() => {
    setCollapsed(group.collapsed);
  }, [group.collapsed]);

  useEffect(() => {
    const timer = window.setTimeout(autoFocus, 30);
    return () => window.clearTimeout(timer);
  }, [autoFocus]);

  // 分组级批量操作
  const handleGroupDiscard = useCallback(async () => {
    const discardableTabs = group.tabs.filter(tab => !tab.active && !tab.discarded);
    const discardableTabIds = discardableTabs.map(tab => tab.id!).filter(Boolean);
    if (discardableTabIds.length > 0) {
      await Promise.all(discardableTabIds.map(id => browser.tabs.discard(id)));
      onGroupAction?.('discard', group);
    }
  }, [group, onGroupAction]);

  const handleGroupRemove = useCallback(async () => {
    const tabIds = group.tabs.map(tab => tab.id!).filter(Boolean);
    if (tabIds.length > 0) {
      await browser.tabs.remove(tabIds);
      onGroupAction?.('remove', group);
    }
  }, [group, onGroupAction]);

  const groupActions: ActionOptionItem[] = useMemo(() => {
    const discardableTabs = group.tabs.filter(tab => !tab.active && !tab.discarded);

    return [
      {
        key: 'discard',
        label: $fmt('common.hibernate'),
        icon: <CoffeeOutlined />,
        disabled: !discardableTabs?.length,
        onClick: handleGroupDiscard,
      },
      {
        key: 'remove',
        label: $fmt('common.remove'),
        icon: <CloseOutlined />,
        hoverColor: ENUM_COLORS.red,
        confirm: {
          title: $fmt('home.removeTitle'),
          description: $fmt({
            id: 'home.tab.removeSelected',
            values: { count: group.tabs.length },
          }),
          okText: $fmt('common.remove'),
          cancelText: $fmt('common.cancel'),
          okButtonProps: { danger: true },
        },
        onClick: handleGroupRemove,
      },
    ];
  }, [$fmt, group, handleGroupDiscard, handleGroupRemove]);

  // 如果是未分组的标签（groupId === -1），直接渲染标签项列表
  if (group.groupId === -1) {
    return (
      <>
        {group.tabs?.map((tab, index) => {
          return (
            <DndComponent<OpenedTabsDragData>
              key={tab.id || index}
              canDrag={true}
              canDrop={false}
              dndKey={dndKey}
              data={{
                ...tab,
                index,
                groupId: group.groupId,
                dndKey,
                from: 'opened-tabs',
                selectedValues: selectedTabIds,
                selectedTabs,
                draggingTabItem: { ...tab },
                isDragging:
                  draggableState?.type !== idleState.type &&
                  selectedTabIds.includes(tab.id!) &&
                  selectedTabIds.includes(draggingTabItem?.id!),
              }}
              mainField="id"
              onDragStateChange={value => onDragStateChange?.(value, tab)}
            >
              <TabItem
                key={tab.id}
                tab={tab}
                highlighted={tab.id != undefined && quickSelectedTabIds.includes(tab.id)}
                onAction={onAction}
                onQuickSelect={onQuickSelect}
              ></TabItem>
            </DndComponent>
          );
        })}
      </>
    );
  }

  return (
    <StyledGroupWrapper
      className={classNames(collapsed && 'collapsed')}
      $color={group.color}
    >
      <div
        className="group-header"
        onClick={onToggle}
        aria-expanded={!collapsed}
        aria-label={collapseLabel}
      >
        <Tooltip
          title={collapseLabel}
          placement="top"
          mouseEnterDelay={0.3}
          destroyTooltipOnHide
        >
          <div className="collapse-icon-btn">
            {collapsed ? <RightOutlined /> : <DownOutlined />}
          </div>
        </Tooltip>
        <Tooltip
          title={groupDisplayName}
          placement="topLeft"
          mouseEnterDelay={0.3}
          destroyTooltipOnHide
        >
          <div className="group-name">{groupDisplayName}</div>
        </Tooltip>
        <div className="group-actions" onClick={e => e.stopPropagation()}>
          <ActionBtnList actionBtnStyle="icon" outerList={groupActions} gap={8} />
        </div>
      </div>
      <div className="tab-list">
        {group.tabs?.map((tab, index) => {
          const tabKey = String(tab.id ?? `opened-${group.groupId}-${index}`);

          return (
            <DndComponent<OpenedTabsDragData>
              key={tabKey}
              canDrag={true}
              canDrop={false}
              dndKey={dndKey}
              data={{
                ...tab,
                index,
                groupId: String(group.groupId),
                dndKey,
                from: 'opened-tabs',
                selectedValues: selectedTabIds,
                selectedTabs,
                draggingTabItem: { ...tab },
                isDragging:
                  draggableState?.type !== idleState.type &&
                  selectedTabIds.includes(tab.id!) &&
                  selectedTabIds.includes(draggingTabItem?.id!),
              }}
              mainField="id"
              onDragStateChange={value => onDragStateChange?.(value, tab)}
            >
              <div className="tab-list-item">
                <i className="group-color-flag"></i>
                <TabItem
                  key={tab.id}
                  tab={tab}
                  highlighted={
                    tab.id != undefined && quickSelectedTabIds.includes(tab.id)
                  }
                  onAction={onAction}
                  onQuickSelect={onQuickSelect}
                ></TabItem>
              </div>
            </DndComponent>
          );
        })}
      </div>
    </StyledGroupWrapper>
  );
}
