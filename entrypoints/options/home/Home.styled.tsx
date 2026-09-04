import styled from 'styled-components';
import { StyledEllipsis } from '~/entrypoints/common/style/Common.styled';
import type { StyledThemeProps } from '~/entrypoints/types';
import { StyledBaseMainWrapper } from '../Layout.styled';
import SidebarLayout from '../components/SidebarLayout';
import RightPanelLayout from '../components/RightPanelLayout';

export const StyledMainWrapper = StyledBaseMainWrapper;

export const StyledSidebarWrapper = styled(SidebarLayout)<{
  theme: StyledThemeProps;
}>`
  .sidebar-inner-content {
    padding-right: 0;

    .tag-list-title {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 15px;
      font-weight: 650;
    }
    .count-info {
      flex-shrink: 0;
      padding: 4px 0 14px;
      margin: 0;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      color: var(--nt-text-secondary);
      font-size: 12px;
    }
    .sidebar-action-btns-wrapper {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--nt-border);
      gap: 8px;
    }
    .tree-controls {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: 6px 0 18px;
    }
    .tree-filters {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .tree-search {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .tree-search-input {
      min-width: 0;
      flex: 1;
    }
    .tree-search-button {
      flex: 0 0 42px;
    }
    .sidebar-tree-wrapper {
      flex: 1;
      height: 0;
      .no-data {
        padding: 16px 0;
        button {
          font-size: 12px;
        }
      }
      .nicetab-tree {
        background: transparent;

        .nicetab-tree-treenode {
          padding: 2px 0;
        }
        /* Keep child groups clearly nested without wasting a full row-width step. */
        .nicetab-tree-indent-unit {
          width: 16px;
        }
        .nicetab-tree-node-content-wrapper {
          min-height: 30px;
          padding: 3px 6px;
          border-radius: var(--nt-radius-sm);
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .nicetab-tree-node-content-wrapper:hover {
          background: var(--nt-surface-muted);
        }
        .nicetab-tree-node-selected {
          background: var(--nt-accent-soft) !important;
          color: ${props => props.theme.colorPrimary};
        }
      }
    }

    .nicetab-input-affix-wrapper,
    .nicetab-input-outlined {
      border-radius: var(--nt-radius-sm);
    }
  }
`;

export const StyledTreeNodeItem = styled.div`
  display: flex;
  align-items: center;
  padding-right: 8px;
  cursor: pointer;
  .tree-node-title {
    width: 0;
    flex: 1;
    ${StyledEllipsis}
  }

  .tree-node-icon-group {
    display: flex;
    align-items: center;
    margin-left: 8px;
    flex-shrink: 0;
    gap: 2px;
    visibility: hidden;
    pointer-events: none;
  }
  &:hover {
    .tree-node-icon-group {
      visibility: visible;
      pointer-events: auto;
    }
  }
`;

export const StyledHelpInfoBox = styled.div`
  ul {
    padding-left: 16px;
    list-style-type: disc;
    li {
      margin-bottom: 8px;
    }
  }
`;

export const StyledRightPanelWrapper = styled(RightPanelLayout)<{
  theme: StyledThemeProps;
}>`
  .right-panel-inner-content {
    display: flex;
    flex-direction: column;
    .opened-tabs-title {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 650;
      font-size: 15px;
      margin-bottom: 8px;
    }

    .opened-tabs-list {
      flex: 1;
      height: 0;
      overflow-y: auto;
      .no-data {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
    }
    .tab-list-checkbox-group {
      width: 100%;
      display: block;
    }
  }
`;

export const StyledGroupList = styled.div`
  .count-info {
    box-sizing: border-box;
    width: fit-content;
    display: flex;
    align-items: center;
    padding: 6px 10px;
    margin-bottom: 16px;
    border: 1px solid var(--nt-border);
    border-radius: 999px;
    background: var(--nt-surface);
    color: var(--nt-text-secondary);
    font-size: 12px;
    .count-item {
      margin-right: 6px;
    }
  }
`;

export default {
  name: 'option-home-styled',
};
