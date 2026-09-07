import styled from 'styled-components';
import { StyledThemeProps } from '~/entrypoints/types';

export const StyledEmptyBox = styled.div`
  display: flex;
  justify-content: center;
  padding: 100px 0;
`;

export const StyledRecycleBinWrapper = styled.div`
  .recycle-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin: 12px 0;
    padding: 12px 0;
  }
  .recycle-summary,
  .recycle-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .recycle-summary {
    min-width: 0;
    color: var(--nt-text-secondary);
    font-size: 12px;
    strong {
      color: var(--nt-text);
      font-size: 15px;
      font-weight: 600;
    }
  }
  .recycle-actions {
    flex-shrink: 0;
  }
  @media (max-width: 640px) {
    .recycle-toolbar {
      align-items: stretch;
      flex-direction: column;
    }
    .recycle-actions button {
      flex: 1;
    }
  }
`;

export const StyledTagNode = styled.div<{ theme: StyledThemeProps }>`
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 32px;
  padding: 0 4px;
  gap: 8px;
  .tag-name {
    min-width: 0;
    overflow: hidden;
    flex: 0 1 auto;
    font-size: 16px;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${props => props.theme.colorText || '#333'};
  }
  .count {
    flex: 0 0 auto;
    font-size: 12px;
    color: ${props => props.theme.colorTextTertiary || '#999'};
  }
  .action-btns {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    gap: 4px;
    margin-left: auto;
    .action-btn {
      display: flex;
      align-items: center;
    }
  }
`;

export default {
  name: 'option-recycle-bin-styled',
};
