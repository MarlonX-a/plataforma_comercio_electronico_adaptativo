import type { InputHTMLAttributes, ReactNode } from 'react';
import { joinClassNames } from './uiClassNames';
import styles from './UiComponents.module.css';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  leadingIcon?: ReactNode;
  trailingAction?: ReactNode;
};

export default function Input({
  id,
  label,
  hint,
  error,
  leadingIcon,
  trailingAction,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...inputProps
}: InputProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const descriptionIds = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {label}
      </label>
      <div className={styles.controlWrapper}>
        {leadingIcon ? (
          <span className={styles.leadingIcon} aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        <input
          {...inputProps}
          id={id}
          className={joinClassNames(
            styles.control,
            Boolean(leadingIcon) && styles.controlWithLeadingIcon,
            Boolean(trailingAction) && styles.controlWithTrailingAction,
            className,
          )}
          aria-invalid={error ? true : ariaInvalid}
          aria-describedby={descriptionIds}
        />
        {trailingAction ? <span className={styles.trailingAction}>{trailingAction}</span> : null}
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
