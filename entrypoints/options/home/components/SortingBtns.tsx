import { useMemo } from 'react';
import { Tooltip } from 'antd';
import ActionIconBtn from '~/entrypoints/common/components/ActionIconBtn';
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
  // ArrowUpOutlined,
  // ArrowDownOutlined,
} from '@ant-design/icons';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';

export default function SortingBtns({
  sortBy = 'name',
  onSort,
}: {
  sortBy?: string;
  onSort?: (type: string) => void;
}) {
  const { $fmt } = useIntlUtls();
  const config = useMemo(() => {
    if (sortBy === 'name') {
      return {
        ascending: {
          title: $fmt({
            id: 'common.ascending',
            values: { sortBy: $fmt('home.tabGroup.name') },
          }),
          icon: <SortAscendingOutlined />,
        },
        descending: {
          title: $fmt({
            id: 'common.descending',
            values: { sortBy: $fmt('home.tabGroup.name') },
          }),
          icon: <SortDescendingOutlined />,
        },
      };
    } else if (sortBy === 'createTime') {
      return {
        ascending: {
          title: $fmt({
            id: 'common.ascending',
            values: { sortBy: $fmt('home.tabGroup.createTime') },
          }),
          icon: <SortAscendingOutlined />,
        },
        descending: {
          title: $fmt({
            id: 'common.descending',
            values: { sortBy: $fmt('home.tabGroup.createTime') },
          }),
          icon: <SortDescendingOutlined />,
        },
      };
    }
  }, [$fmt, sortBy]);

  return (
    <>
      <Tooltip
        title={config?.ascending?.title || $fmt('common.ascending')}
        placement="top"
        mouseEnterDelay={0.3}
        destroyTooltipOnHide
      >
        <span className="action-icon">
          <ActionIconBtn
            label={config?.ascending?.title || $fmt('common.ascending')}
            size={20}
            onClick={() => onSort?.('ascending')}
          >
            {config?.ascending?.icon || <SortAscendingOutlined />}
          </ActionIconBtn>
        </span>
      </Tooltip>
      <Tooltip
        title={config?.descending?.title || $fmt('common.descending')}
        placement="top"
        mouseEnterDelay={0.3}
        destroyTooltipOnHide
      >
        <span className="action-icon">
          <ActionIconBtn
            label={config?.descending?.title || $fmt('common.descending')}
            size={20}
            onClick={() => onSort?.('descending')}
          >
            {config?.descending?.icon || <SortDescendingOutlined />}
          </ActionIconBtn>
        </span>
      </Tooltip>
    </>
  );
}
