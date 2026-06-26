import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Radio.module.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text rendered adjacent to the radio */
  label?: ReactNode;
  /** Error state */
  error?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Radio button with accessible label.
 *
 * @example
 * ```tsx
 * <Radio name="plan" value="free" label="Free plan" />
 * <Radio name="plan" value="pro" label="Pro plan" />
 * ```
 */
export function Radio({ label, error = false, disabled, className, id, ...props }: RadioProps) {
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
      <span className={styles.radioWrapper}>
        <input
          type="radio"
          id={id}
          className={styles.input}
          disabled={disabled}
          aria-invalid={error || undefined}
          {...props}
        />
        <span className={styles.dot} aria-hidden="true" />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
