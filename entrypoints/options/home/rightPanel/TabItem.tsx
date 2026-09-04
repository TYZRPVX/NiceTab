import React, { useRef, useCallback, useEffect } from 'react';
import { Tabs } from 'wxt/browser';
import { Checkbox, Popconfirm, Tooltip } from 'antd';
import type { CheckboxProps } from 'antd';
import { CloseOutlined, CoffeeOutlined, PushpinFilled } from '@ant-design/icons';
import { classNames } from '~/entrypoints/common/utils';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';
import Favicon from '~/entrypoints/common/components/Favicon';
import { StyledActionIconBtn } from '~/entrypoints/common/style/Common.styled';
import { StyledTabItem } from './OpenedTabs.styled';

export type QuickSelectFunc = (tab: Tabs.Tab, selected?: boolean) => void;
export type TabActions = 'active' | 'discard' | 'remove';
export interface TabItemProps {
  tab: Tabs.Tab;
  highlighted?: boolean;
  onAction: (action: TabActions, tab: Tabs.Tab) => void;
  onQuickSelect?: QuickSelectFunc;
}

export default function TabItem({
  tab,
  highlighted,
  onAction,
  onQuickSelect,
}: TabItemProps) {
  const { $fmt } = useIntlUtls();
  const tabRef = useRef<HTMLDivElement>(null);
  const tabTitle = tab.title || tab.url || '';
  const handleAction = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>, action: TabActions) => {
      if (action === 'discard' || action === 'remove') {
        event.stopPropagation();
      }
      onAction(action, tab);
    },
    [tab],
  );

  const handleSelectChange = useCallback<Required<CheckboxProps>['onChange']>(
    e => {
      const { shiftKey } = e.nativeEvent || {};
      if (e.target.checked) {
        shiftKey && onQuickSelect?.(tab, e.target.checked);
      } else {
        onQuickSelect?.(tab, e.target.checked);
      }
    },
    [onQuickSelect],
  );

  useEffect(() => {
    if (tab.active) {
      tabRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [tab.active]);

  return (
    <StyledTabItem
      ref={tabRef}
      className={classNames(
        'tab-item',
        tab.active && 'active',
        tab.discarded && 'discarded',
        highlighted && 'highlighted',
      )}
    >
      <Checkbox value={tab.id} onChange={handleSelectChange} />

      {tab.pinned && <PushpinFilled />}
      <Favicon pageUrl={tab.url!} favIconUrl={tab.favIconUrl}></Favicon>
      <Tooltip
        title={tabTitle}
        placement="topLeft"
        mouseEnterDelay={0.3}
        destroyTooltipOnHide
      >
        <span className="tab-item-title" onClick={event => handleAction(event, 'active')}>
          {tabTitle}
        </span>
      </Tooltip>

      {!tab.active && (
        <Tooltip
          title={$fmt(tab.discarded ? 'common.hibernated' : 'common.hibernate')}
          placement="top"
          mouseEnterDelay={0.3}
          destroyTooltipOnHide
        >
          <StyledActionIconBtn
            className={classNames('action-icon-btn', tab.discarded && 'disabled')}
            $size={16}
            aria-label={$fmt(tab.discarded ? 'common.hibernated' : 'common.hibernate')}
            onClick={event => handleAction(event, 'discard')}
          >
            <CoffeeOutlined />
          </StyledActionIconBtn>
        </Tooltip>
      )}

      <Popconfirm
        title={$fmt('home.removeTitle')}
        description={$fmt({
          id: 'home.tab.removeSelected',
          values: { count: 1 },
        })}
        okText={$fmt('common.remove')}
        cancelText={$fmt('common.cancel')}
        okButtonProps={{ danger: true }}
        onConfirm={() => onAction('remove', tab)}
      >
        <span className="action-btn-confirm-target">
          <Tooltip
            title={$fmt('common.remove')}
            placement="top"
            mouseEnterDelay={0.3}
            destroyTooltipOnHide
          >
            <StyledActionIconBtn
              className="action-icon-btn"
              $size={16}
              $hoverColor="red"
              aria-label={$fmt('common.remove')}
            >
              <CloseOutlined />
            </StyledActionIconBtn>
          </Tooltip>
        </span>
      </Popconfirm>
    </StyledTabItem>
  );
}
