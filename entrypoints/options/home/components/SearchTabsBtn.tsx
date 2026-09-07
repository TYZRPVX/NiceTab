import { Tooltip } from 'antd';
import ActionIconBtn from '~/entrypoints/common/components/ActionIconBtn';
import { SearchOutlined } from '@ant-design/icons';
import { eventEmitter, useIntlUtls } from '~/entrypoints/common/hooks/global';

export default function SearchTabsBtn() {
  const { $fmt } = useIntlUtls();
  const label = $fmt('home.searchTabAndUrl');

  const openGlobalSearchPanel = () => {
    eventEmitter.emit('global:open-global-search-modal');
  };

  return (
    <Tooltip title={label} placement="top" mouseEnterDelay={0.3} destroyTooltipOnHide>
      <span className="action-icon">
        <ActionIconBtn label={label} size={20} onClick={openGlobalSearchPanel}>
          <SearchOutlined />
        </ActionIconBtn>
      </span>
    </Tooltip>
  );
}
