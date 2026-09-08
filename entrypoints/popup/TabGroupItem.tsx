import { useRef, useState, useCallback, useMemo } from 'react';
import { Tabs } from 'wxt/browser';
import { RightOutlined, DownOutlined, CloseOutlined } from '@ant-design/icons';
import { classNames, getDisplayGroupName } from '~/entrypoints/common/utils';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';
import { ENUM_COLORS } from '~/entrypoints/common/constants';
import ActionBtnList, {
  type ActionOptionItem,
} from '~/entrypoints/common/components/ActionBtnList';
import TabItem, { type TabActions } from './TabItem';
import { StyledGroupWrapper } from './App.styled';

export interface GroupListItem {
  groupId: number;
  groupName: string;
  tabs: Tabs.Tab[];
  collapsed?: boolean;
  color?: string;
}

export interface GroupItemProps {
  group: GroupListItem;
  onAction: (action: TabActions, tab: Tabs.Tab) => void;
  onGroupAction?: (action: TabActions, group: GroupListItem) => void;
}

export default function TabGroupItem({ group, onAction, onGroupAction }: GroupItemProps) {
  const { $fmt } = useIntlUtls();
  const groupRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(
    group.tabs.some(tab => tab.active) ? false : group.collapsed,
  );
  const groupDisplayName = useMemo(
    () => getDisplayGroupName({ groupName: group.groupName, tabList: group.tabs }),
    [group.groupName, group.tabs],
  );
  const onToggle = useCallback(() => {
    setCollapsed(value => !value);
  }, []);

  const handleGroupRemove = useCallback(async () => {
    const tabIds = group.tabs.map(tab => tab.id!).filter(Boolean);
    if (tabIds.length > 0) {
      await browser.tabs.remove(tabIds);
      onGroupAction?.('remove', group);
    }
  }, [group, onGroupAction]);

  const groupActions: ActionOptionItem[] = useMemo(() => {
    return [
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
  }, [group, $fmt, handleGroupRemove]);

  if (group.groupId === -1) {
    return group.tabs?.map(tab => <TabItem key={tab.id} tab={tab} onAction={onAction} />);
  }

  return (
    <StyledGroupWrapper
      ref={groupRef}
      className={classNames(collapsed && 'collapsed')}
      $color={group.color}
    >
      <div className="group-title" onClick={onToggle}>
        <div className="collapse-icon-btn">
          {collapsed ? <RightOutlined /> : <DownOutlined />}
        </div>
        <div className="group-name" title={groupDisplayName}>
          {groupDisplayName}
        </div>
        <div className="group-actions" onClick={e => e.stopPropagation()}>
          <ActionBtnList actionBtnStyle="icon" outerList={groupActions} gap={8} />
        </div>
      </div>
      <div className="tab-list">
        {group.tabs?.map(tab => (
          <div className="tab-list-item" key={tab.id}>
            <i className="group-color-flag"></i>
            <TabItem tab={tab} onAction={onAction} />
          </div>
        ))}
      </div>
    </StyledGroupWrapper>
  );
}
