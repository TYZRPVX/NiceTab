import {
  ClockArrowUpIcon,
  ClockArrowDownIcon,
} from '~/entrypoints/common/components/icon/Icons';
import { useMemo } from 'react';
import { Tooltip } from 'antd';
import ActionIconBtn from '~/entrypoints/common/components/ActionIconBtn';
import {
  ArrowDownAZIcon,
  ArrowUpZAIcon,
} from '~/entrypoints/common/components/icon/Icons';
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
          icon: <ArrowDownAZIcon />,
        },
        descending: {
          title: $fmt({
            id: 'common.descending',
            values: { sortBy: $fmt('home.tabGroup.name') },
          }),
          icon: <ArrowUpZAIcon />,
        },
      };
    } else if (sortBy === 'createTime') {
      return {
        ascending: {
          title: $fmt({
            id: 'common.ascending',
            values: { sortBy: $fmt('home.tabGroup.createTime') },
          }),
          icon: <ClockArrowUpIcon />,
        },
        descending: {
          title: $fmt({
            id: 'common.descending',
            values: { sortBy: $fmt('home.tabGroup.createTime') },
          }),
          icon: <ClockArrowDownIcon />,
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
            {config?.ascending?.icon || <ArrowDownAZIcon />}
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
            {config?.descending?.icon || <ArrowUpZAIcon />}
          </ActionIconBtn>
        </span>
      </Tooltip>
    </>
  );
}
