import styled from 'styled-components';
import { StyledEllipsis } from '~/entrypoints/common/style/Common.styled';
import type { StyledThemeProps } from '~/entrypoints/types';

export const StyledGroupWrapper = styled.div<{ $color?: string }>`
  margin-bottom: 8px;

  .group-header {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: 6px;
    cursor: pointer;
    min-height: 30px;
    padding: 4px 6px;
    border-radius: var(--nt-radius-sm);
    font-size: 12px;
    color: var(--nt-text-secondary);
    user-select: none;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;

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
      width: 0;
      min-width: 0;
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
      min-width: 0;
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
  width: 100%;
  min-width: 0;
  min-height: 32px;
  padding: 3px 6px;
  gap: 7px;
  border-radius: var(--nt-radius-sm);
  transition: background-color 0.15s ease;
  &:hover,
  &.active {
    background: ${props => props.theme.colorPrimaryBg || 'rgba(0, 0, 0, 0.1)'};
  }
  &::before {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 0;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: ${props => props.theme.colorPrimary};
    content: '';
    opacity: 0;
    transition: opacity 0.15s ease;
  }
  &:hover::before,
  &.active::before {
    opacity: 1;
  }
  .nicetab-checkbox-wrapper,
  .ant-checkbox-wrapper {
    flex: 0 0 auto;
  }
  .anticon,
  .img-favicon {
    flex: 0 0 auto;
  }
  &.highlighted {
    background: ${props => props.theme.colorWarningHover};
  }
  .img-favicon {
    margin-right: 0;
  }
  .tab-item-title {
    width: 0;
    min-width: 0;
    flex: 1 1 auto;
    display: block;
    overflow: hidden;
    font-size: 13px;
    line-height: 20px;
    cursor: pointer;
    color: ${props => props.theme.colorText || '#000'};
    ${StyledEllipsis}
  }
  .action-icon-btn {
    flex: 0 0 auto;
    flex-shrink: 0;
  }
  .action-btn-confirm-target {
    display: flex;
    flex: 0 0 auto;
  }
  &.discarded {
    .tab-item-title,
    .btn-discarded,
    .action-icon-btn.disabled {
      color: ${props => props.theme.colorTextQuaternary || 'rgba(0, 0, 0, 0.25)'};
    }
  }
`;

export const StyledOpenedTabsActions = styled.div<{ theme: StyledThemeProps }>`
  display: flex;
  align-items: center;
  min-width: 0;
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
    flex: 0 0 auto;
    gap: 8px;
  }
  .selected-count-text {
    color: ${props => props.theme.colorPrimary};
    font-weight: 600;
  }
  .group-action-btns {
    flex-shrink: 0;
    margin-left: auto;
  }
`;

export default {
  name: 'opened-tabs-styled',
};
