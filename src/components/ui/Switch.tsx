import type { InputHTMLAttributes, ReactNode } from 'react';
import { joinClassNames } from './uiClassNames';
import styles from './UiComponents.module.css';

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  id: string;
  label: ReactNode;
  description?: ReactNode;
};

export default function Switch({
  id,
  label,
  description,
  className,
  'aria-describedby': ariaDescribedBy,
  ...switchProps
}: SwitchProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const descriptionIds = [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined;

  return (
    <label className={joinClassNames(styles.switchLabel, className)} htmlFor={id}>
      <span className={styles.switchText}>
        <strong>{label}</strong>
        {description ? (
          <span id={descriptionId} className={styles.choiceDescription}>
            {description}
          </span>
        ) : null}
      </span>
      <span className={styles.switchControl}>
        <input
          {...switchProps}
          id={id}
          className={styles.nativeChoice}
          type="checkbox"
          role="switch"
          aria-describedby={descriptionIds}
        />
        <span className={styles.switchTrack} aria-hidden="true">
          <span className={styles.switchThumb} />
        </span>
      </span>
    </label>
  );
}
