import styled from 'styled-components';
import type { StyledThemeProps } from '~/entrypoints/types';
import { StyledEllipsis } from '~/entrypoints/common/style/Common.styled';

export const StyledContainer = styled.div<{ theme: StyledThemeProps }>`
  min-width: 460px;
  max-width: 600px;
  min-height: 420px;
  max-height: 590px; // 浏览器popup高度最大为600px, 超过这个高度会出现body滚动条
  display: flex;
  flex-direction: column;

  .fixed-top {
    flex-shrink: 0;
    flex-grow: 0;
    position: relative;
    border-bottom: 1px solid var(--nt-border);

    &.compact {
      .block {
        padding: 4px 10px;
        min-height: 32px;
        gap: 4px;
        .block-title {
          font-size: 12px;
        }
        .action-btn {
          font-size: 12px;
        }
      }
    }

    .compact-toolbar {
      display: flex;
      align-items: center;
      padding: 4px 42px 4px 6px;
      min-height: 38px;
      gap: 2px;

      button {
        color: ${props => props.theme.colorTextSecondary || '#333'};
        border: none;
        box-shadow: none;
        &:hover {
          color: ${props => props.theme.colorPrimary};
          background: var(--nt-surface-muted);
        }
      }
    }
    .toggle-compact-btn {
      position: absolute;
      top: 4px;
      right: 6px;
      z-index: 10;
      cursor: pointer;
      color: ${props => props.theme.colorTextSecondary || '#333'};
      border: none;
      box-shadow: none;
      &:hover {
        color: ${props => props.theme.colorPrimary};
        background: var(--nt-surface-muted);
      }
    }
  }
  .block {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid var(--nt-border);
    gap: 8px;
    font-size: 13px;
    .block-title {
      flex-shrink: 0;
      font-weight: bold;
    }
    button {
      font-size: 12px;
    }
    .block-content {
      flex: 1;
      width: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    &.quick-actions {
      .action-btn {
        display: inline-flex;
        color: ${props => props.theme.colorTextSecondary || '#333'};
        cursor: pointer;
        &:not(.disabled):hover {
          color: ${props => props.theme.colorPrimary};
        }
        &.disabled {
          color: ${props => props.theme.colorTextQuaternary || 'rgba(0, 0, 0, 0.25)'};
          cursor: not-allowed;
        }
      }
    }
    &.theme-colors {
      display: flex;
      align-items: center;
    }
  }
  .tab-list-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    font-size: 14px;
    font-weight: bold;
  }
  .block-opened-tabs {
    flex: 1;
    padding: 8px;
    min-height: 0;
    overflow-y: auto;
  }
  .opened-tabs-empty {
    flex: 1;
    display: grid;
    min-height: 260px;
    padding: 24px;
    place-items: center;

    .nicetab-empty {
      margin: 0;
    }
    .empty-copy {
      display: flex;
      flex-direction: column;
      gap: 6px;
      color: var(--nt-text-secondary);
      font-size: 12px;

      strong {
        color: var(--nt-text);
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
`;

export const StyledGroupWrapper = styled.div<{ $color?: string }>`
  margin: 4px 0;
  position: relative;
  .group-title {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    min-height: 36px;
    box-sizing: border-box;
    gap: 8px;
    cursor: pointer;
    .collapse-icon-btn {
      font-size: 14px;
    }
    .group-name {
      flex: 1;
      overflow: hidden;
      font-size: 14px;
      color: ${props => props.theme.colorText || '#000'};
      ${StyledEllipsis}
    }
    .group-actions {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }
  }
  .tab-list {
    display: block;
    .tab-list-item {
      position: relative;
      padding-left: 28px;
      .group-color-flag {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        background-color: ${props => props.$color || 'transparent'};
      }
    }
  }
  &.collapsed {
    .tab-list {
      display: none;
    }
  }
`;

export const StyledTabItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: 36px;
  padding: 5px 8px;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: var(--nt-radius-sm);
  cursor: pointer;
  &:hover {
    border-color: var(--nt-border);
    background: var(--nt-surface-muted);
  }
  &.active {
    background: ${props => props.theme.colorPrimaryBg};
  }
  .tab-item-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    font-size: 14px;
    line-height: 24px;
    color: var(--nt-text);
    ${StyledEllipsis}
  }
  .tab-close {
    display: flex;
    flex-shrink: 0;
  }
  &.discarded .tab-item-title {
    color: var(--nt-text-secondary);
  }
`;

export default {
  name: 'popup-app-styled',
};
