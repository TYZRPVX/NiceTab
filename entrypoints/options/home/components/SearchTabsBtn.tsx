import { Button, Tooltip } from 'antd';
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
      <div className="action-icon" onClick={openGlobalSearchPanel}>
        <Button aria-label={label} icon={<SearchOutlined />}></Button>
      </div>
    </Tooltip>
  );
}
