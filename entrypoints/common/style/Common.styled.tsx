import styled, { css, createGlobalStyle } from 'styled-components';
import type { StyledThemeProps } from '~/entrypoints/types';

export type { StyledThemeProps } from '~/entrypoints/types';

export const StyleBtnDisabled = css`
  color: ${props => props.theme.colorTextDisabled || 'rgba(0,0,0,0.25)'};
  cursor: not-allowed;
`;

// 单行超长省略
export const StyledEllipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
// 多行超长省略
export const StyledEllipsisLines = css<{ $lines?: number }>`
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${props => props.$lines || 2};
`;

// action icon btn
export const StyledActionIconBtn = styled.i<{
  theme: StyledThemeProps;
  disabled?: boolean;
  $size?: number | string;
  $color?: string;
  $hoverColor?: string;
  $hoverScale?: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: ${props => `${+(props.$size || 16) + 2}px`};
  height: ${props => `${+(props.$size || 16) + 2}px`};
  border-radius: 6px;
  font-size: ${props => `${props.$size || 14}px`};
  transition:
    transform 0.2s,
    color 0.2s,
    background-color 0.2s;
  cursor: pointer;
  transform: scale(1);
  ${props =>
    props.disabled
      ? `
        color: ${props.theme.colorTextDisabled || 'rgba(0,0,0,0.25)'};
        cursor: not-allowed;
      `
      : `
        color: ${props.$color || props.theme.colorTextSecondary || '#666'};
        &:hover {
          transform: scale(${props.$hoverScale || 1.08});
          color: ${props.$hoverColor || props.theme.colorPrimary || '#666'};
          background: var(--nt-surface-muted);
        }
      `};

  &:focus-visible {
    outline: 2px solid ${props => props.theme.colorPrimary};
    outline-offset: 2px;
  }

  &.disabled {
    transform: scale(1);
    ${StyleBtnDisabled}
  }
`;

export const StyledActionTextBtn = styled.span<{
  theme: StyledThemeProps;
  disabled?: boolean;
  $color?: string;
  $hoverColor?: string;
}>`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colorTextSecondary || '#333'};
  cursor: pointer;
  &:hover {
    color: ${props => props.$hoverColor || props.theme.colorPrimary || '#666'};
  }
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colorPrimary};
    outline-offset: 2px;
    border-radius: 4px;
  }
  &.disabled {
    ${StyleBtnDisabled}
  }
`;

// toogle theme color block item
export const StyledColorItem = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  box-sizing: border-box;
  border: 2px solid var(--nt-surface);
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--nt-border);
  cursor: pointer;
  transition:
    box-shadow 0.15s ease,
    transform 0.15s ease;
  &:hover {
    transform: translateY(-1px);
  }
  &.active {
    box-shadow:
      0 0 0 2px var(--nt-surface),
      0 0 0 4px currentColor;
  }
`;

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg-color: ${props => props.theme.colorBgContainer || '#fff'};
    --nt-page: ${props =>
      props.theme.type === 'light'
        ? '#fff'
        : props.theme.colorBgLayout || props.theme.colorBgContainer || '#141414'};
    --nt-surface: ${props => props.theme.colorBgContainer || '#fff'};
    --nt-surface-muted: ${props => props.theme.colorFillAlter || '#f3f5f8'};
    --nt-border: ${props => props.theme.colorBorderSecondary || props.theme.colorBorder || '#e6eaf0'};
    --nt-text: ${props => props.theme.colorText || '#1d2939'};
    --nt-text-secondary: ${props => props.theme.colorTextSecondary || '#667085'};
    --nt-text-tertiary: ${props => props.theme.colorTextTertiary || '#98a2b3'};
    --nt-accent-soft: ${props => props.theme.colorPrimaryBg || '#eff6ff'};
    --nt-radius-sm: 6px;
    --nt-radius-md: 10px;
    --nt-radius-lg: 14px;
    --nt-shadow-sm: ${props =>
      props.theme.type === 'light'
        ? '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.08)'
        : '0 1px 2px rgba(0, 0, 0, 0.2)'};
    --nt-shadow-md: ${props =>
      props.theme.type === 'light'
        ? '0 8px 24px rgba(16, 24, 40, 0.08)'
        : '0 8px 24px rgba(0, 0, 0, 0.32)'};
    --link-color: ${props =>
      props.theme.type === 'light' ? props.theme.colorLink : '#8AB4F8'};
    --link-color-hover: ${props =>
      props.theme.type === 'light' ? props.theme.colorLinkHover : '#8AB4F8b6'};
  }
  html, body {
    --bg-color: ${props => props.theme.colorBgContainer || '#fff'};
    --text-color: ${props => props.theme.colorText || 'rgba(0, 0, 0, 0.88)'};
    background: var(--nt-page);
    color: ${props => props.theme.colorText || 'rgba(0, 0, 0, 0.88)'};
  }

  .ellipsis {
    ${StyledEllipsis}
  }

  a.link {
    color: var(--link-color);
    cursor: pointer;
    &:hover {
      color: var(--link-color-hover);
    }
  }

  ::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
  }
  .nicetab-tree-list-scrollbar-vertical,
  .rc-virtual-list-scrollbar-vertical {
    width: 8px !important;
  }

  ::-webkit-scrollbar-track {
    border-radius: 4px;
    background: transparent !important;
  }

  ::-webkit-scrollbar-thumb,
  .nicetab-tree-list-scrollbar-thumb,
  .rc-virtual-list-scrollbar-thumb {
    border-radius: 4px;
    background: transparent !important;
    box-shadow: none !important;
  }

  html.nt-scrollbar-visible::-webkit-scrollbar-thumb,
  html.nt-scrollbar-visible ::-webkit-scrollbar-thumb,
  html.nt-scrollbar-visible .nicetab-tree-list-scrollbar-thumb,
  html.nt-scrollbar-visible .rc-virtual-list-scrollbar-thumb {
    background: ${props =>
      `${props.theme.type === 'light' ? '#d9d9d9' : '#555'} !important`};
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
  }
  html.nt-scrollbar-visible::-webkit-scrollbar-thumb:hover,
  html.nt-scrollbar-visible ::-webkit-scrollbar-thumb:hover,
  html.nt-scrollbar-visible .nicetab-tree-list-scrollbar-thumb:hover,
  html.nt-scrollbar-visible .rc-virtual-list-scrollbar-thumb:hover {
    background: ${props =>
      `${props.theme.type === 'light' ? '#bfbfbf' : '#888'} !important`};
  }

  .nicetab-ul-list {
    padding-left: 16px;
    list-style-type: disc;
    &.circle {
      list-style-type: circle;
    }
    li:not(:last-of-type) {
      margin-bottom: 8px;
    }
  }
`;
