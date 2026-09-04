import styled from 'styled-components';
import { StyledEllipsis } from '~/entrypoints/common/style/Common.styled';

export const StyledTabItemWrapper = styled.div<{ $bgColor?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  min-height: 34px;
  padding: 3px 6px;
  border: 1px solid transparent;
  border-radius: var(--nt-radius-sm);
  background: ${props => props.$bgColor || ''};
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
  .checkbox-item {
    margin-right: 8px;
  }
  .tab-item-btn {
    display: flex !important;
    flex-shrink: 0;
    margin-right: 4px;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  }
  &:hover {
    border-color: var(--nt-border);
    background: var(--nt-surface-muted);
  }
  .img-favicon {
    margin-right: 9px;
  }
`;

export const StyledTabTitle = styled.span`
  flex: 1;
  width: 0;
  ${StyledEllipsis}
  .tab-item-title-text {
    font-size: 14px;
  }
  .link {
    display: block;
    color: inherit;
  }
  &:hover .link {
    color: ${props => props.theme.colorPrimary};
  }
`;

export default {
  name: 'option-tab-item-styled',
};
