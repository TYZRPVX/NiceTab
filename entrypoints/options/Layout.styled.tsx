import styled from 'styled-components';
import type { StyledThemeProps } from '~/entrypoints/types';

export const defaultRightPanelWidth = 400;
export const defaultSidebarWidth = defaultRightPanelWidth;

export const StyledBaseSidebarWrapper = styled.div<{
  theme: StyledThemeProps;
}>`
  position: relative;

  .sidebar-hover-trigger {
    position: fixed;
    top: 64px;
    bottom: 0;
    z-index: 11;
    width: 20px;
    background: transparent;
  }
  .sidebar-hover-trigger-left {
    left: 0;
  }

  .sidebar-inner-box {
    box-sizing: border-box;
    width: var(--sidebar-width, ${defaultSidebarWidth}px);
    height: calc(100vh - 64px);
    position: fixed;
    top: 64px;
    left: 0;
    padding: 20px 16px;
    transition: transform 180ms cubic-bezier(0.2, 0, 0, 1);
    transform: translateX(0);
    border-right: 1px solid var(--nt-border);
    background: var(--nt-page);
    overflow: visible;
    z-index: 10;

    &.collapsed {
      transform: translateX(calc(-1 * var(--sidebar-width, ${defaultSidebarWidth}px)));
      border-color: transparent;
      background: transparent;
      cursor: pointer;

      .sidebar-inner-content {
        pointer-events: none;
        visibility: hidden;
        opacity: 0;
      }
      .sidebar-action-box {
        visibility: hidden;
        pointer-events: none;
      }
      .sidebar-collapse-btn {
        visibility: hidden;
        pointer-events: none;
      }

      &.hover-expanded {
        transform: translateX(0);
      }
      &.hover-expanded,
      &.hover-closing {
        border-color: var(--nt-border);
        background: var(--nt-page);
        cursor: default;

        .sidebar-inner-content {
          pointer-events: auto;
          visibility: visible;
          opacity: 1;
        }
        .sidebar-action-box {
          visibility: visible;
          pointer-events: auto;
        }
        .sidebar-collapse-btn {
          visibility: visible;
          pointer-events: auto;
        }
      }
    }

    /* 拖拽期间禁用 transition，避免布局滞后于鼠标 */
    body.dragging-resize & {
      transition: none;
    }

    .sidebar-action-box {
      box-sizing: border-box;
      flex-shrink: 0;
      display: flex;
      flex-direction: row;
      gap: 6px;
      align-items: center;
      justify-content: flex-end;
      min-height: 32px;
      margin-bottom: 12px;
      visibility: visible;

      .computing-icon {
        margin-left: 10px;
      }
    }
    .sidebar-collapse-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 12;

      button {
        display: grid;
        width: 32px;
        height: 32px;
        padding: 0;
        border: 0;
        box-shadow: none;
        color: var(--nt-text-secondary);
        background: var(--nt-surface-muted);
        place-items: center;
      }
      button:hover {
        color: ${props => props.theme.colorPrimary};
        background: var(--nt-accent-soft);
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

  .sidebar-hover-trigger {
    position: fixed;
    top: 64px;
    bottom: 0;
    z-index: 11;
    width: 20px;
    background: transparent;
  }
  .sidebar-hover-trigger-right {
    right: 0;
  }

  .right-panel-inner-box {
    box-sizing: border-box;
    width: var(--panel-width, ${defaultRightPanelWidth}px);
    height: calc(100vh - 64px);
    position: fixed;
    top: 64px;
    right: 0;
    padding: 20px 16px;
    transition: transform 180ms cubic-bezier(0.2, 0, 0, 1);
    transform: translateX(0);
    border-left: 1px solid var(--nt-border);
    background: var(--nt-page);
    overflow: visible;
    z-index: 10;

    &.collapsed,
    &.auto-hidden {
      transform: translateX(var(--panel-width, ${defaultRightPanelWidth}px));
      border-color: transparent;
      background: transparent;
      cursor: pointer;

      .right-panel-inner-content {
        pointer-events: none;
        visibility: hidden;
        opacity: 0;
      }
      .right-panel-action-box {
        visibility: hidden;
        pointer-events: none;
      }
      .right-panel-collapse-btn {
        visibility: hidden;
        pointer-events: none;
      }

      &.hover-expanded {
        transform: translateX(0);
      }
      &.hover-expanded,
      &.hover-closing {
        cursor: default;
        border-color: var(--nt-border);
        background: var(--nt-page);

        .right-panel-inner-content {
          pointer-events: auto;
          visibility: visible;
          opacity: 1;
        }
        .right-panel-action-box {
          visibility: visible;
          pointer-events: auto;
        }
        .right-panel-collapse-btn {
          visibility: visible;
          pointer-events: auto;
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
      top: 16px;
      left: -36px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
      justify-content: center;
      visibility: visible;
    }
    .right-panel-collapse-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 12;

      button {
        display: grid;
        width: 32px;
        height: 32px;
        padding: 0;
        border: 0;
        box-shadow: none;
        color: var(--nt-text-secondary);
        background: var(--nt-surface-muted);
        place-items: center;
      }
      button:hover {
        color: ${props => props.theme.colorPrimary};
        background: var(--nt-accent-soft);
      }
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
