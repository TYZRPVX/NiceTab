import { useCallback } from 'react';
import { Button, Tooltip } from 'antd';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
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
  }, [collapsed]);

  return (
    <Tooltip title={label} placement="top" mouseEnterDelay={0.3} destroyTooltipOnHide>
      <div
        className="action-icon"
        style={{
          transform: `rotate(${position === 'left' ? 0 : 180}deg)`,
        }}
        onClick={handleToggle}
      >
        <Button
          aria-label={label}
          icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
        ></Button>
      </div>
    </Tooltip>
  );
}
