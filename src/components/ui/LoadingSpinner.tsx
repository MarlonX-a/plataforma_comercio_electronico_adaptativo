import type { HTMLAttributes } from 'react';
import { joinClassNames } from './uiClassNames';
import styles from './UiComponents.module.css';

export type LoadingSpinnerProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
  size?: 'small' | 'medium' | 'large';
};

export default function LoadingSpinner({
  label = 'Cargando',
  size = 'medium',
  className,
  ...spinnerProps
}: LoadingSpinnerProps) {
  return (
    <div
      {...spinnerProps}
      className={joinClassNames(styles.loading, className)}
      role="status"
      aria-live="polite"
    >
      <span
        className={joinClassNames(
          styles.spinner,
          styles[`spinner${size[0].toUpperCase()}${size.slice(1)}`],
        )}
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
