import { useEffect, useState, type ReactNode } from 'react';
import styled from 'styled-components';
import {
  StyledBaseRightPanelWrapper,
  defaultRightPanelWidth,
} from '~/entrypoints/options/Layout.styled';
import { classNames } from '~/entrypoints/common/utils';
import ToggleSidebarBtn from './ToggleSidebarBtn';
import useDragResize from '~/entrypoints/options/common/hooks/useDragResize';

const StyledHandle = styled.div<{ $visible?: boolean }>`
  position: absolute;
  top: 0;
  left: -5px;
  width: 10px;
  height: 100%;
  cursor: col-resize;
  z-index: 11;
  visibility: ${props => (props.$visible ? 'visible' : 'hidden')};
`;

export interface RightPanelLayoutProps {
  /** 是否折叠 */
  collapsed?: boolean;
  /** 面板宽度 */
  panelWidth?: number;
  /** 初始宽度 */
  initialWidth?: number;
  /** 是否显示折叠切换按钮 */
  showCollapseBtn?: boolean;
  /** 空间不足时收起为悬停展开的边缘面板 */
  autoHide?: boolean;
  /** 操作按钮区域内容（位于折叠按钮之后） */
  sideActionBox?: ReactNode;
  /** 主体内容 */
  innerContent?: ReactNode;
  /** className，供外部 styled 组件注入样式 */
  className?: string;
  /** 折叠状态变化回调 */
  onCollapseChange?: (status: boolean) => void;
  /** 宽度变化回调 */
  onWidthChange?: (width: number) => void;
  /** 自动隐藏面板首次悬停时触发，用于延迟加载内容。 */
  onActivate?: () => void;
  /** 自动隐藏面板结束悬停时触发，用于卸载内容。 */
  onDeactivate?: () => void;
}

export default function RightPanelLayout({
  collapsed = false,
  panelWidth,
  initialWidth,
  showCollapseBtn = true,
  autoHide = false,
  sideActionBox,
  innerContent,
  className,
  onCollapseChange,
  onWidthChange,
  onActivate,
  onDeactivate,
}: RightPanelLayoutProps) {
  const hiddenUntilHover = collapsed || autoHide;
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const { width, onMouseDown, dragHandleRef } = useDragResize({
    initialWidth: initialWidth || defaultRightPanelWidth,
    currWidth: panelWidth || defaultRightPanelWidth,
    minWidth: defaultRightPanelWidth - 100,
    position: 'right',
    onWidthChange,
  });

  useEffect(() => {
    if (!hiddenUntilHover) setHoverExpanded(false);
  }, [hiddenUntilHover]);

  return (
    <StyledBaseRightPanelWrapper
      className={className}
      style={{ '--panel-width': `${width}px` } as React.CSSProperties}
    >
      <div
        className={classNames(
          'right-panel-inner-box',
          collapsed && 'collapsed',
          autoHide && 'auto-hidden',
          hoverExpanded && 'hover-expanded',
        )}
        onPointerEnter={
          hiddenUntilHover
            ? () => {
                setHoverExpanded(true);
                onActivate?.();
              }
            : undefined
        }
        onPointerLeave={
          hiddenUntilHover
            ? () => {
                setHoverExpanded(false);
                onDeactivate?.();
              }
            : undefined
        }
      >
        <StyledHandle
          ref={dragHandleRef}
          $visible={!collapsed && !autoHide}
          onMouseDown={onMouseDown}
        />
        {showCollapseBtn && !autoHide && (
          <div className="right-panel-collapse-btn">
            <ToggleSidebarBtn
              collapsed={collapsed}
              position="right"
              onCollapseChange={onCollapseChange}
            />
          </div>
        )}
        <div className="right-panel-action-box">{sideActionBox}</div>
        <div className="right-panel-inner-content">{innerContent}</div>
      </div>
    </StyledBaseRightPanelWrapper>
  );
}
