import { useEffect, useState, type ReactNode } from 'react';
import styled from 'styled-components';
import {
  StyledBaseSidebarWrapper,
  defaultSidebarWidth,
} from '~/entrypoints/options/Layout.styled';
import { classNames } from '~/entrypoints/common/utils';
import ToggleSidebarBtn from './ToggleSidebarBtn';
import useDragResize from '~/entrypoints/options/common/hooks/useDragResize';

const StyledHandle = styled.div<{ $visible?: boolean }>`
  position: absolute;
  top: 0;
  right: -5px;
  width: 10px;
  height: 100%;
  cursor: col-resize;
  z-index: 11;
  visibility: ${props => (props.$visible ? 'visible' : 'hidden')};
`;

interface SidebarLayoutProps {
  /** 是否折叠 */
  collapsed?: boolean;
  /** 侧边栏宽度 */
  sidebarWidth?: number;
  /** 初始侧边栏宽度 */
  initialWidth?: number;
  /** 是否显示折叠切换按钮 */
  showCollapseBtn?: boolean;
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
}

export default function SidebarLayout({
  collapsed = false,
  sidebarWidth,
  initialWidth,
  showCollapseBtn = true,
  sideActionBox,
  innerContent,
  className,
  onCollapseChange,
  onWidthChange,
}: SidebarLayoutProps) {
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const { width, onMouseDown, dragHandleRef } = useDragResize({
    initialWidth: initialWidth || defaultSidebarWidth,
    currWidth: sidebarWidth || defaultSidebarWidth,
    minWidth: 240,
    position: 'left',
    onWidthChange,
  });

  useEffect(() => {
    if (!collapsed) setHoverExpanded(false);
  }, [collapsed]);

  return (
    <StyledBaseSidebarWrapper
      className={className}
      style={{ '--sidebar-width': `${width}px` } as React.CSSProperties}
    >
      <div
        className={classNames(
          'sidebar-inner-box',
          collapsed && 'collapsed',
          hoverExpanded && 'hover-expanded',
        )}
        onPointerEnter={() => collapsed && setHoverExpanded(true)}
        onPointerLeave={() => collapsed && setHoverExpanded(false)}
      >
        <StyledHandle
          ref={dragHandleRef}
          $visible={!collapsed}
          onMouseDown={onMouseDown}
        />
        {showCollapseBtn && (
          <div className="sidebar-collapse-btn">
            <ToggleSidebarBtn collapsed={collapsed} onCollapseChange={onCollapseChange} />
          </div>
        )}
        <div className="sidebar-inner-content">
          {(!collapsed || hoverExpanded) && (
            <>
              {sideActionBox && <div className="sidebar-action-box">{sideActionBox}</div>}
              {innerContent}
            </>
          )}
        </div>
      </div>
    </StyledBaseSidebarWrapper>
  );
}
