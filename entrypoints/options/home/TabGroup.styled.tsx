import styled from 'styled-components';
import { PRIMARY_COLOR } from '~/entrypoints/common/constants';
import type { StyledThemeProps } from '~/entrypoints/types';
import { StyleBtnDisabled } from '~/entrypoints/common/style/Common.styled';

export const StyledGroupWrapper = styled.div<{ $bgColor?: string; $active?: boolean }>`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 14px 12px 12px;
  margin-bottom: 16px;
  border: 1px solid ${props => (props.$active ? props.theme.colorPrimaryBorder : 'var(--nt-border)')};
  border-radius: var(--nt-radius-md);
  box-shadow: var(--nt-shadow-sm);
  background: ${props => props.$bgColor || '#fff'};
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;

  &::before {
    position: absolute;
    top: 14px;
    bottom: 14px;
    left: -1px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: ${props => props.theme.colorPrimary};
    content: '';
    opacity: ${props => (props.$active ? 1 : 0)};
    transition: opacity 0.15s ease;
  }

  &:hover {
    box-shadow: var(--nt-shadow-md);
  }
`;
export const StyledGroupStickyHeader = styled.div<{ $bgColor?: string; $active?: boolean }>`
  position: sticky;
  top: 76px;
  z-index: 3;
  padding: 0 4px 6px;
  border-radius: var(--nt-radius-sm);
  background: ${props => props.$bgColor || '#fff'};
`;

export const StyledGroupHeader = styled.div<{ theme: StyledThemeProps }>`
  padding: 0;
  .group-header-top {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: 8px;
    .group-status-wrapper {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .group-name-wrapper {
      min-width: 0;
      margin-right: 4px;
      .text-readonly {
        font-weight: 650;
        letter-spacing: -0.01em;
      }
    }
    .group-info {
      display: flex;
      align-items: center;
      min-width: 0;
      gap: 8px;
      color: var(--nt-text-secondary);
      font-size: 12px;
      .tab-count {
        color: inherit;
      }
      .group-create-time {
        overflow: hidden;
        color: var(--nt-text-tertiary);
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .group-action-btns {
    margin-top: 6px;
    font-size: 14px;
  }
`;

export const StyledGroupHeaderRecycle = styled(StyledGroupHeader)`
  display: flex;
  align-items: center;
  .group-header-top {
    .group-name-wrapper {
      margin-right: 0;
    }
  }
  .group-action-btns {
    margin-top: 0;
    padding: 0 8px;
    .action-btn {
      display: flex;
      align-items: center;
      color: ${props => props.theme.colorTextSecondary || '#333'};
      cursor: pointer;
      &:hover {
        color: ${props => props.theme.colorPrimary || PRIMARY_COLOR};
      }
      &.disabled {
        ${StyleBtnDisabled}
      }
    }
  }
`;

export const StyledTabActions = styled.div<{ theme: StyledThemeProps }>`
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 32px;
  margin-top: 8px;
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
  .tab-action-btns {
    margin: 4px 0;
    font-size: 12px;
    .action-btn {
      display: flex;
      align-items: center;
      color: ${props => props.theme.colorTextSecondary || '#333'};
      cursor: pointer;
      &:hover {
        color: ${props => props.theme.colorPrimary || PRIMARY_COLOR};
      }
    }
  }
  .selected-count-text {
    color: ${props => props.theme.colorPrimary};
    font-weight: 600;
  }
`;

export const StyledTabListWrapper = styled.div`
  min-height: 24px;
  margin-top: 6px;
  .tab-list-checkbox-group {
    width: 100%;
    display: block;
  }
  .show-rest-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 12px;
    cursor: pointer;
    color: ${props => props.theme.colorTextSecondary || '#666'};
  }
`;

export default {
  name: 'option-tab-group-styled',
};
