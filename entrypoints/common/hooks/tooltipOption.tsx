import type { ReactElement } from 'react';
import { theme } from 'antd';
import { CircleHelpIcon } from '~/entrypoints/common/components/icon/Icons';
import styled from 'styled-components';

const StyledText = styled.div`
  color: var(--text-color);
`;

export default function useTooltipOption() {
  const { token } = theme.useToken();

  const getFormTooltipOption = ({
    title,
    icon,
    width = 320,
  }: {
    title: ReactElement | string;
    icon?: ReactElement;
    width?: number;
  }) => ({
    title: (
      <StyledText
        dangerouslySetInnerHTML={{
          __html: title,
        }}
      ></StyledText>
    ),
    icon: icon || <CircleHelpIcon />,
    color: token.colorBgElevated,
    styles: { root: { maxWidth: `${width}px`, width: `${width}px` } },
  });

  return {
    getFormTooltipOption,
  };
}
