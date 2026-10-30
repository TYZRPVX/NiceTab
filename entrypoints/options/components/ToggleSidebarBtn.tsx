import {
  PanelLeftIcon,
  PanelRightIcon,
} from '~/entrypoints/common/components/icon/Icons';
import { useCallback } from 'react';
import { Button, Tooltip } from 'antd';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';

export default function ToggleSidebarBtn({
  collapsed = false,
  position = 'left',
  onCollapseChange,
}: {
  collapsed?: boolean;
  position?: 'left' | 'right';
  onCollapseChange?: (status: boolean) => void;
}) {
  const { $fmt } = useIntlUtls();
  const label = $fmt(`common.${collapsed ? 'expand' : 'collapse'}`);

  const handleToggle = useCallback(() => {
    onCollapseChange?.(!collapsed);
  }, [collapsed, onCollapseChange]);

  return (
    <Tooltip title={label} placement="top" mouseEnterDelay={0.3} destroyTooltipOnHide>
      <div className="action-icon">
        <Button
          aria-label={label}
          icon={
            position === 'left' ? (
              <PanelLeftIcon style={{ fontSize: 18 }} />
            ) : (
              <PanelRightIcon style={{ fontSize: 18 }} />
            )
          }
          onClick={handleToggle}
        ></Button>
      </div>
    </Tooltip>
  );
}
