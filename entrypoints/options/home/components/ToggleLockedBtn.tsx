import { useCallback } from 'react';
import { Tooltip } from 'antd';
import ActionIconBtn from '~/entrypoints/common/components/ActionIconBtn';
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
  }, [isLocked, onLockStatusChange]);

  return (
    <Tooltip title={label} placement="top" mouseEnterDelay={0.3} destroyTooltipOnHide>
      <span className="action-icon">
        <ActionIconBtn label={label} size={20} onClick={handleToggle}>
          {isLocked ? <UnlockOutlined /> : <LockOutlined />}
        </ActionIconBtn>
      </span>
    </Tooltip>
  );
}
