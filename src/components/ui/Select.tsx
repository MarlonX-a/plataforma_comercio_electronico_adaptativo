import type { ReactNode, SelectHTMLAttributes } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { joinClassNames } from './uiClassNames';
import styles from './UiComponents.module.css';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
};

export default function Select({
  id,
  label,
  hint,
  error,
  children,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...selectProps
}: SelectProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const descriptionIds = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {label}
      </label>
      <div className={styles.selectWrapper}>
        <select
          {...selectProps}
          id={id}
          className={joinClassNames(styles.control, styles.select, className)}
          aria-invalid={error ? true : ariaInvalid}
          aria-describedby={descriptionIds}
        >
          {children}
        </select>
        <FaChevronDown className={styles.selectIcon} aria-hidden="true" />
      </div>
      {hint ? (
        <span id={hintId} className={styles.fieldHint}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className={styles.fieldError} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
