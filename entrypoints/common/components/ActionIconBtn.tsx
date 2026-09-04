import { useCallback, type KeyboardEvent } from 'react';
import type { ActionBtnStyle } from '~/entrypoints/types';
import { classNames } from '~/entrypoints/common/utils';
import {
  StyledActionIconBtn,
  StyledActionTextBtn,
} from '~/entrypoints/common/style/Common.styled';

export interface ActionBtnProps {
  className?: string;
  label?: string;
  btnStyle?: ActionBtnStyle;
  size?: number;
  disabled?: boolean;
  hoverColor?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function ActionIconBtn({
  className,
  label,
  btnStyle = 'icon',
  size,
  disabled,
  hoverColor,
  onClick,
  children,
}: ActionBtnProps) {
  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick?.();
  }, [disabled, onClick]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      event.currentTarget.click();
    },
    [handleClick],
  );

  return btnStyle === 'icon' ? (
    <StyledActionIconBtn
      className={classNames(className, disabled && 'disabled')}
      $size={size}
      $hoverColor={hoverColor}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </StyledActionIconBtn>
  ) : (
    <StyledActionTextBtn
      className={classNames(className, disabled && 'disabled')}
      $hoverColor={hoverColor}
      onClick={handleClick}
    >
      {children || label}
    </StyledActionTextBtn>
  );
}
