import { type ReactNode, useMemo } from 'react';
import { Button, Tooltip } from 'antd';
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
  }, [$fmt]);

  return (
    <>
      <Tooltip
        title={config?.ascending?.title || $fmt('common.ascending')}
        placement="top"
        mouseEnterDelay={0.3}
        destroyTooltipOnHide
      >
        <div className="action-icon" onClick={() => onSort?.('ascending')}>
          <Button
            aria-label={config?.ascending?.title || $fmt('common.ascending')}
            icon={config?.ascending?.icon || <SortAscendingOutlined />}
          ></Button>
        </div>
      </Tooltip>
      <Tooltip
        title={config?.descending?.title || $fmt('common.descending')}
        placement="top"
        mouseEnterDelay={0.3}
        destroyTooltipOnHide
      >
        <div className="action-icon" onClick={() => onSort?.('descending')}>
          <Button
            aria-label={config?.descending?.title || $fmt('common.descending')}
            icon={config?.descending?.icon || <SortDescendingOutlined />}
          ></Button>
        </div>
      </Tooltip>
    </>
  );
}
