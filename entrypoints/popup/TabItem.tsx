import { useRef, useEffect } from 'react';
import type { Tabs } from 'wxt/browser';
import { CloseOutlined } from '@ant-design/icons';
import { ENUM_COLORS } from '~/entrypoints/common/constants';
import { classNames } from '~/entrypoints/common/utils';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';
import Favicon from '~/entrypoints/common/components/Favicon';
import ActionIconBtn from '~/entrypoints/common/components/ActionIconBtn';
import { StyledTabItem } from './App.styled';

export type TabActions = 'active' | 'remove';
interface TabItemProps {
  tab: Tabs.Tab;
  onAction: (action: TabActions, tab: Tabs.Tab) => void;
}

export default function TabItem({ tab, onAction }: TabItemProps) {
  const { $fmt } = useIntlUtls();
  const tabRef = useRef<HTMLDivElement>(null);
  const tabTitle = tab.title || tab.url || '';
  // Reveal the initially active tab once; closing another tab must not recenter it.
  const initiallyActive = useRef(tab.active);
  useEffect(() => {
    if (initiallyActive.current) {
      tabRef.current?.scrollIntoView({ block: 'nearest' });
    }
  }, []);

  return (
    <StyledTabItem
      ref={tabRef}
      className={classNames(
        'tab-item',
        tab.active && 'active',
        tab.discarded && 'discarded',
      )}
      onClick={() => onAction('active', tab)}
    >
      <Favicon pageUrl={tab.url || ''} favIconUrl={tab.favIconUrl} size={16} />
      <span className="tab-item-title" title={tabTitle}>
        {tabTitle}
      </span>
      <span className="tab-close" onClick={event => event.stopPropagation()}>
        <ActionIconBtn
          label={$fmt('common.remove')}
          size={16}
          hoverColor={ENUM_COLORS.red}
          onClick={() => onAction('remove', tab)}
        >
          <CloseOutlined />
        </ActionIconBtn>
      </span>
    </StyledTabItem>
  );
}
