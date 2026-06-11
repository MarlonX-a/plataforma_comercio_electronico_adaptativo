import type { HTMLAttributes, ReactNode } from 'react';
import { joinClassNames } from './uiClassNames';
import styles from './UiComponents.module.css';

export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  children: ReactNode;
};

export default function Badge({
  variant = 'neutral',
  className,
  children,
  ...badgeProps
}: BadgeProps) {
  return (
    <span
      {...badgeProps}
      className={joinClassNames(
        styles.badge,
        styles[`badge${variant[0].toUpperCase()}${variant.slice(1)}`],
        className,
      )}
    >
      {children}
    </span>
  );
}
