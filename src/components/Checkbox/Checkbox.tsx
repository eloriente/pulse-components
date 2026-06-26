import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text rendered adjacent to the checkbox */
  label?: ReactNode;
  /** Indeterminate state (partially checked) */
  indeterminate?: boolean;
  /** Error state */
  error?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Checkbox with indeterminate support and accessible label.
 *
 * @example
 * ```tsx
 * <Checkbox label="Accept terms" checked={checked} onChange={handleChange} />
 * ```
 */
export function Checkbox({
  label,
  indeterminate = false,
  error = false,
  disabled,
  className,
  id,
  ...props
}: CheckboxProps) {
  return (
    <label
      className={[
        styles.wrapper,
        disabled ? styles.disabled : '',
        error ? styles.error : '',
        className,
      ].filter(Boolean).join(' ')}
      htmlFor={id}
    >
      <span className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          id={id}
          className={styles.input}
          disabled={disabled}
          aria-invalid={error || undefined}
          ref={(el) => {
            if (el) el.indeterminate = indeterminate;
          }}
          {...props}
        />
        <span className={styles.checkmark} aria-hidden="true" />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
