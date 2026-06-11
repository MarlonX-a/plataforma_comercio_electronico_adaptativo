import type { HTMLAttributes, ReactNode } from 'react';
import Card from './Card';
import { joinClassNames } from './uiClassNames';
import styles from './UiComponents.module.css';

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...emptyStateProps
}: EmptyStateProps) {
  return (
    <Card
      {...emptyStateProps}
      className={joinClassNames(styles.emptyState, className)}
      padding="large"
    >
      {icon ? (
        <span className={styles.emptyStateIcon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <h2 className={styles.emptyStateTitle}>{title}</h2>
      <div className={styles.emptyStateDescription}>{description}</div>
      {action ? <div className={styles.emptyStateAction}>{action}</div> : null}
    </Card>
  );
}
