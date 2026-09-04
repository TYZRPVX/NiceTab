import dayjs from 'dayjs';
import { StarFilled } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';
import { StyledDayDivider } from '../TabGroup.styled';

export default function DayDivider({
  dayKey,
  starred = false,
}: {
  dayKey?: string | null;
  starred?: boolean;
}) {
  const intl = useIntl();
  const { $fmt } = useIntlUtls();

  let label = $fmt('home.date.unknown');
  if (starred) {
    label = $fmt('home.date.starred');
  } else if (dayKey) {
    const date = dayjs(dayKey);
    if (date.isValid()) {
      if (date.isSame(dayjs(), 'day')) {
        label = $fmt('home.date.today');
      } else if (date.isSame(dayjs().subtract(1, 'day'), 'day')) {
        label = $fmt('home.date.yesterday');
      } else {
        label = intl.formatDate(date.toDate(), {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    }
  }

  return (
    <StyledDayDivider role="separator">
      <span className="day-divider-label">
        {starred && <StarFilled aria-hidden="true" />}
        {label}
      </span>
      <span className="day-divider-line" aria-hidden="true" />
    </StyledDayDivider>
  );
}
