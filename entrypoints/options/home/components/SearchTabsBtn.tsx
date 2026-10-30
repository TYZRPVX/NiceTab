import { Tooltip } from 'antd';
import ActionIconBtn from '~/entrypoints/common/components/ActionIconBtn';
import { SearchIcon } from '~/entrypoints/common/components/icon/Icons';
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
          <SearchIcon />
        </ActionIconBtn>
      </span>
    </Tooltip>
  );
}
