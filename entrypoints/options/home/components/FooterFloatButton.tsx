import { FloatButton } from 'antd';
import { SearchIcon } from '~/entrypoints/common/components/icon/Icons';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';
import SearchList from '../footer/SearchList';

export default function FooterFloatButton() {
  const { $fmt } = useIntlUtls();

  return (
    <FloatButton.Group
      trigger="click"
      placement="left"
      shape="circle"
      style={{ right: 30, bottom: 30 }}
      icon={
        <span title={$fmt('home.searchTabAndUrl')}>
          <SearchIcon />
        </span>
      }
    >
      <SearchList />
    </FloatButton.Group>
  );
}
