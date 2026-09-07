import { useCallback, useContext } from 'react';
import { theme, Flex } from 'antd';
import { classNames } from '~/entrypoints/common/utils';
import { StyledColorItem } from '~/entrypoints/common/style/Common.styled';
import { GlobalContext } from '~/entrypoints/common/hooks/global';
import type { ColorItem } from '~/entrypoints/types';

// 主题色列表
export default function ColorList({
  colors,
  onItemClick,
  gap = 6,
  ...props
}: {
  colors: ColorItem[];
  onItemClick?: (color: string) => void;
  gap?: number;
  [key: string]: any;
}) {
  const { token } = theme.useToken();
  const { themeTypeConfig } = useContext(GlobalContext);
  const isDarkTheme = themeTypeConfig.type === 'dark';
  const getDisplayColor = useCallback(
    (item: ColorItem) => (isDarkTheme ? item.darkColor || item.color : item.color),
    [isDarkTheme],
  );
  const isActive = useCallback(
    (item: ColorItem) => {
      return getDisplayColor(item).toLowerCase() === token.colorPrimary?.toLowerCase();
    },
    [getDisplayColor, token],
  );

  return (
    <Flex className="color-list" wrap="wrap" gap={gap} style={props.style}>
      {colors.map(item => {
        const displayColor = getDisplayColor(item);
        return (
          <StyledColorItem
            className={classNames('color-item', isActive(item) && 'active')}
            key={item.key}
            style={{ background: displayColor, color: displayColor }}
            onClick={() => onItemClick?.(item.color)}
          ></StyledColorItem>
        );
      })}
    </Flex>
  );
}
