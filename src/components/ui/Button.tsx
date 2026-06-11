import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { joinClassNames } from './uiClassNames';
import styles from './UiComponents.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'medium',
  isFullWidth = false,
  isLoading = false,
  loadingLabel = 'Procesando',
  leadingIcon,
  trailingIcon,
  disabled,
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      {...buttonProps}
      className={joinClassNames(
        styles.button,
        styles[`button${variant[0].toUpperCase()}${variant.slice(1)}`],
        styles[`button${size[0].toUpperCase()}${size.slice(1)}`],
        isFullWidth && styles.fullWidth,
        className,
      )}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
    >
      {isLoading ? <span className={styles.buttonSpinner} aria-hidden="true" /> : leadingIcon}
      <span>{isLoading ? loadingLabel : children}</span>
      {!isLoading ? trailingIcon : null}
    </button>
  );
}
