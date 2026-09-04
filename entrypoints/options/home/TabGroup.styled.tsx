import styled from 'styled-components';
import { PRIMARY_COLOR } from '~/entrypoints/common/constants';
import type { StyledThemeProps } from '~/entrypoints/types';

export const StyledGroupWrapper = styled.div<{ $bgColor?: string; $active?: boolean }>`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 0 4px 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--nt-border);

  &::before {
    position: absolute;
    top: 4px;
    bottom: 20px;
    left: -4px;
    width: 2px;
    background: ${props => props.theme.colorPrimary};
    content: '';
    opacity: ${props => (props.$active ? 1 : 0)};
    transition: opacity 0.15s ease;
  }
`;
export const StyledGroupStickyHeader = styled.div<{
  $bgColor?: string;
  $active?: boolean;
}>`
  position: sticky;
  top: 76px;
  z-index: 3;
  padding: 8px 0 6px;
  background: var(--nt-page);
`;

export const StyledGroupHeader = styled.div<{ theme: StyledThemeProps }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
  padding: 0;
  .group-header-top {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 220px;
    gap: 8px;
    .group-status-wrapper {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      gap: 4px;
    }
    .group-name-wrapper {
      width: 0;
      flex: 1 1 auto;
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
      flex: 0 1 auto;
      min-width: 0;
      gap: 8px;
      color: var(--nt-text-secondary);
      font-size: 12px;
      .tab-count {
        color: inherit;
      }
    }
    .group-select-toggle {
      flex: 0 0 auto;
      margin-left: 4px;
      padding: 0;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s ease;
    }
  }
  .group-action-btns {
    display: flex;
    flex: 0 0 auto;
    justify-content: flex-end;
    flex-wrap: wrap;
    min-width: 0;
    margin-top: 0;
    gap: 8px;
    font-size: 13px;
  }
  &:hover .group-select-toggle,
  &:focus-within .group-select-toggle,
  &.has-selection .group-select-toggle {
    opacity: 1;
    pointer-events: auto;
  }
  @media (max-width: 760px) {
    .group-header-top {
      min-width: 0;
    }
    .group-action-btns {
      flex-basis: 100%;
      justify-content: flex-end;
    }
  }
`;

export const StyledGroupHeaderRecycle = styled(StyledGroupHeader)`
  .group-header-top {
    .group-name-wrapper {
      margin-right: 0;
    }
  }
  .group-action-btns {
    padding: 0;
    .action-btn {
      display: flex;
      align-items: center;
    }
  }
`;

export const StyledTabActions = styled.div<{ theme: StyledThemeProps }>`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 32px;
  margin: 8px 0 0;
  padding: 6px 0;
  border-top: 1px solid var(--nt-border);
  border-bottom: 1px solid var(--nt-border);
  font-size: 12px;
  user-select: none;
  .tab-selection-actions {
    min-width: 0;
    margin-left: auto;
    .group-action-btns {
      flex-wrap: wrap;
      margin: 0;
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
  }
  .selected-count-text {
    color: ${props => props.theme.colorPrimary};
    font-weight: 600;
  }
`;

export const StyledDayDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  margin: 24px 0 12px;
  color: var(--nt-text-tertiary);
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.06em;
  line-height: 20px;
  text-transform: uppercase;
  .day-divider-label {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }
  .day-divider-line {
    flex: 1;
    min-width: 24px;
    height: 1px;
    background: var(--nt-border);
  }
`;

export const StyledTabListWrapper = styled.div`
  min-height: 24px;
  margin-top: 8px;
  padding: 0 4px;
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
  .no-data {
    display: flex;
    justify-content: center;
    padding: 48px 16px;
  }
`;

export default {
  name: 'option-tab-group-styled',
};
