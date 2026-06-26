import type { InputHTMLAttributes } from 'react';
import styles from './Switch.module.css';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Accessible label — required for screen readers */
  label?: string;
  size?: SwitchSize;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Toggle switch — a styled checkbox rendered as an on/off switch.
 *
 * @example
 * ```tsx
 * <Switch label="Enable notifications" checked={enabled} onChange={handleChange} />
 * ```
 */
export function Switch({ label, size = 'md', disabled, className, id, ...props }: SwitchProps) {
  return (
    <label
      className={[
        styles.wrapper,
        disabled ? styles.disabled : '',
        className,
      ].filter(Boolean).join(' ')}
      htmlFor={id}
    >
      <span className={[styles.track, styles[size]].join(' ')}>
        <input
          type="checkbox"
          role="switch"
          id={id}
          className={styles.input}
          disabled={disabled}
          {...props}
        />
        <span className={styles.thumb} aria-hidden="true" />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
