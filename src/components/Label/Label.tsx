import type { LabelHTMLAttributes, ReactNode } from 'react';
import styles from './Label.module.css';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  /** Marks the associated field as required with a visual indicator */
  required?: boolean;
  /** Visually mutes the label (e.g. for disabled fields) */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Semantic label for form fields.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email" required>Email address</Label>
 * <input id="email" type="email" />
 * ```
 */
export function Label({ children, required, disabled, className, ...props }: LabelProps) {
  return (
    <label
      className={[
        styles.label,
        disabled ? styles.disabled : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
      {required && (
        <span className={styles.required} aria-hidden="true"> *</span>
      )}
    </label>
  );
}
