import type { HTMLAttributes, ReactNode } from 'react';
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo, FaTriangleExclamation } from 'react-icons/fa6';
import { joinClassNames } from './uiClassNames';
import styles from './UiComponents.module.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const alertIcons = {
  info: FaCircleInfo,
  success: FaCircleCheck,
  warning: FaTriangleExclamation,
  error: FaCircleExclamation,
} as const;

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  title?: ReactNode;
  children: ReactNode;
};

export default function Alert({
  variant = 'info',
  title,
  children,
  className,
  role,
  ...alertProps
}: AlertProps) {
  const AlertIcon = alertIcons[variant];

  return (
    <div
      {...alertProps}
      className={joinClassNames(
        styles.alert,
        styles[`alert${variant[0].toUpperCase()}${variant.slice(1)}`],
        className,
      )}
      role={role ?? (variant === 'error' ? 'alert' : 'status')}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <AlertIcon className={styles.alertIcon} aria-hidden="true" />
      <div>
        {title ? <strong className={styles.alertTitle}>{title}</strong> : null}
        <div className={styles.alertContent}>{children}</div>
      </div>
    </div>
  );
}
