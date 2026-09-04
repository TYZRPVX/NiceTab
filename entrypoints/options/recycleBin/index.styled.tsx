import styled from 'styled-components';
import { StyledThemeProps } from '~/entrypoints/types';

export const StyledEmptyBox = styled.div`
  display: flex;
  justify-content: center;
  padding: 100px 0;
`;

export const StyledRecycleBinWrapper = styled.div`
  .header-action-btns {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 0;
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
