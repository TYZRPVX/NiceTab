import { useCallback } from 'react';
import { Button, Tooltip } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';

export default function ToggleLockedBtn({
  isLocked = false,
  onLockStatusChange,
}: {
  isLocked?: boolean;
  onLockStatusChange?: (status: boolean) => void;
}) {
  const { $fmt } = useIntlUtls();
  const label = $fmt(isLocked ? 'home.tag.unlock' : 'home.tag.lock');

  const handleToggle = useCallback(() => {
    onLockStatusChange?.(!isLocked);
  }, [isLocked]);

  return (
    <Tooltip title={label} placement="top" mouseEnterDelay={0.3} destroyTooltipOnHide>
      <div className="action-icon" onClick={handleToggle}>
        <Button
          aria-label={label}
          icon={isLocked ? <UnlockOutlined /> : <LockOutlined />}
        ></Button>
      </div>
    </Tooltip>
  );
}
