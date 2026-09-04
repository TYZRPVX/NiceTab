import { useCallback } from 'react';
import { Button, Tooltip } from 'antd';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';

function SidebarPanelIcon({ position }: { position: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      focusable="false"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d={position === 'left' ? 'M9 4.5V19.5' : 'M15 4.5V19.5'}
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

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
          icon={<SidebarPanelIcon position={position} />}
          onClick={handleToggle}
        ></Button>
      </div>
    </Tooltip>
  );
}
