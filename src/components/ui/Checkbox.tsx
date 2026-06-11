import type { InputHTMLAttributes, ReactNode } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { joinClassNames } from './uiClassNames';
import styles from './UiComponents.module.css';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
};

export default function Checkbox({
  id,
  label,
  description,
  error,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...checkboxProps
}: CheckboxProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const descriptionIds =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={joinClassNames(styles.choiceField, className)}>
      <label className={styles.choiceLabel} htmlFor={id}>
        <input
          {...checkboxProps}
          id={id}
          className={styles.nativeChoice}
          type="checkbox"
          aria-invalid={error ? true : ariaInvalid}
          aria-describedby={descriptionIds}
        />
        <span className={styles.checkboxControl} aria-hidden="true">
          <FaCheck />
        </span>
        <span>
          <strong>{label}</strong>
          {description ? (
            <span id={descriptionId} className={styles.choiceDescription}>
              {description}
            </span>
          ) : null}
        </span>
      </label>
      {error ? (
        <span id={errorId} className={styles.fieldError} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
