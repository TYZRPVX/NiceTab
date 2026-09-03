import styled from 'styled-components';
import { StyledEllipsis } from '~/entrypoints/common/style/Common.styled';
import type { StyledThemeProps } from '~/entrypoints/types';

export const StyledGroupWrapper = styled.div<{ $color?: string }>`
  margin-bottom: 8px;

  .group-header {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    min-height: 30px;
    padding: 4px 6px;
    border-radius: var(--nt-radius-sm);
    font-size: 12px;
    color: var(--nt-text-secondary);
    user-select: none;
    transition: background-color 0.15s ease, color 0.15s ease;

    &:hover {
      background: var(--nt-surface-muted);
      color: ${props => props.theme.colorText || '#000'};
    }

    .collapse-icon-btn {
      display: flex;
      align-items: center;
      width: 16px;
      flex-shrink: 0;
    }

    .group-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .group-actions {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      padding: 0 2px;
    }
  }

  .tab-list {
    display: block;
    .tab-list-item {
      position: relative;
      padding-left: 18px;
      .group-color-flag {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        left: 7px;
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
  min-height: 32px;
  padding: 3px 6px;
  gap: 7px;
  border-radius: var(--nt-radius-sm);
  transition: background-color 0.15s ease;
  &:hover,
  &.active {
    background: ${props => props.theme.colorPrimaryBg || 'rgba(0, 0, 0, 0.1)'};
  }
  &.highlighted {
    background: ${props => props.theme.colorWarningHover};
  }
  // &.active:before {
  //   content: '';
  //   position: absolute;
  //   left: 0;
  //   top: 0;
  //   width: 3px;
  //   height: 100%;
  //   background: ${props => props.theme.colorPrimary};
  // }
  .img-favicon {
    margin-right: 0;
  }
  .tab-item-title {
    flex: 1;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    color: ${props => props.theme.colorText || '#000'};
    ${StyledEllipsis}
  }
  .action-icon-btn {
    flex-shrink: 0;
  }
  &.discarded {
    .tab-item-title,
    .btn-discarded {
      color: ${props => props.theme.colorTextQuaternary || 'rgba(0, 0, 0, 0.25)'};
    }
  }
`;

export const StyledOpenedTabsActions = styled.div<{ theme: StyledThemeProps }>`
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 32px;
  margin: 6px 0 10px;
  padding: 4px 8px;
  border-radius: var(--nt-radius-sm);
  background: var(--nt-surface-muted);
  font-size: 12px;
  user-select: none;
  .checkall-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .selected-count-text {
    color: ${props => props.theme.colorPrimary};
    font-weight: 600;
  }
`;

export default {
  name: 'opened-tabs-styled',
};
