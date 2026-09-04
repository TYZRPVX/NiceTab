import styled from 'styled-components';
import type { StyledThemeProps } from '~/entrypoints/types';

export const defaultRightPanelWidth = 400;
export const defaultSidebarWidth = defaultRightPanelWidth;

export const StyledBaseSidebarWrapper = styled.div<{
  theme: StyledThemeProps;
}>`
  position: relative;

  .sidebar-inner-box {
    box-sizing: border-box;
    width: calc(var(--sidebar-width, ${defaultSidebarWidth}px) - 32px);
    height: calc(100vh - 112px);
    position: fixed;
    top: 80px;
    left: 16px;
    padding: 16px 12px;
    transition: transform 0.2s ease-in-out;
    transform: translateX(0);
    border: 1px solid var(--nt-border);
    border-radius: var(--nt-radius-lg);
    box-shadow: var(--nt-shadow-sm);
    background: var(--nt-surface);
    overflow: hidden;
    z-index: 10;

    &.collapsed {
      .sidebar-inner-content {
        pointer-events: none;
        visibility: hidden;
        opacity: 0;
      }
      transform: translateX(calc(-1 * var(--sidebar-width, ${defaultSidebarWidth}px)));
    }

    /* 拖拽期间禁用 transition，避免布局滞后于鼠标 */
    body.dragging-resize & {
      transition: none;
    }

    .sidebar-action-box {
      position: absolute;
      box-sizing: border-box;
      top: 0;
      right: -36px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
      justify-content: center;
      visibility: visible;
      .computing-icon {
        margin-top: 10px;
      }
    }
  }

  .sidebar-inner-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

export const StyledBaseMainWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 120px);
  display: grid;
  grid-template-columns:
    var(--sidebar-grid-col, ${defaultSidebarWidth}px)
    minmax(0, 1fr)
    var(--right-panel-grid-col, ${defaultRightPanelWidth}px);
  transition: grid-template-columns 0.2s ease-in-out;
  // overflow-x: hidden;

  /* 拖拽期间禁用 transition，避免布局滞后于鼠标 */
  body.dragging-resize & {
    transition: none;
  }

  .main-content-wrapper {
    box-sizing: border-box;
    width: 100%;
    max-width: 980px;
    padding: 0 32px;
    margin: 0 auto;
  }

  #tab-group-list-panel {
    min-width: 0;
  }
`;

// 右侧面板基础样式
export const StyledBaseRightPanelWrapper = styled.div<{
  theme: StyledThemeProps;
}>`
  position: relative;

  .right-panel-inner-box {
    box-sizing: border-box;
    width: calc(var(--panel-width, ${defaultRightPanelWidth}px) - 32px);
    height: calc(100vh - 112px);
    position: fixed;
    top: 80px;
    right: 16px;
    padding: 16px 12px;
    transition: transform 0.2s ease-in-out;
    transform: translateX(0);
    border: 1px solid var(--nt-border);
    border-radius: var(--nt-radius-lg);
    box-shadow: var(--nt-shadow-sm);
    background: var(--nt-surface);
    overflow: hidden;
    z-index: 10;

    &.collapsed {
      .right-panel-inner-content {
        pointer-events: none;
        visibility: hidden;
        opacity: 0;
      }
      transform: translateX(var(--panel-width, ${defaultRightPanelWidth}px));
    }

    /* 窄窗口：仅保留边缘提示，悬停时以覆盖层方式展开。 */
    &.auto-hidden {
      transform: translateX(
        calc(var(--panel-width, ${defaultRightPanelWidth}px) - 28px)
      );
      cursor: pointer;

      &::after {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 10px;
        content: '';
        background: var(--nt-accent-soft);
        border-radius: var(--nt-radius-lg) 0 0 var(--nt-radius-lg);
      }

      .right-panel-action-box {
        visibility: hidden;
        pointer-events: none;
      }

      &:hover,
      &:focus-within {
        cursor: default;
        /* 展开后贴齐视口右侧，让指针始终落在面板内。 */
        transform: translateX(16px);

        &::after {
          display: none;
        }

        .right-panel-inner-content {
          pointer-events: auto;
          visibility: visible;
          opacity: 1;
        }
      }
    }

    /* 拖拽期间禁用 transition，避免布局滞后于鼠标 */
    body.dragging-resize & {
      transition: none;
    }

    .right-panel-action-box {
      position: absolute;
      box-sizing: border-box;
      top: 0;
      left: -36px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
      justify-content: center;
      visibility: visible;
    }
  }

  .right-panel-inner-content {
    width: 100%;
    height: 100%;
    padding: 0;
  }
`;

export default {
  name: 'option-layout-styled',
};
