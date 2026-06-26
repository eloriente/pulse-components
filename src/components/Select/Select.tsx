import type { SelectHTMLAttributes, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Icon } from '../Icon';
import styles from './Select.module.css';

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectVariant = 'outline' | 'filled';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: SelectVariant;
  size?: SelectSize;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  /** Placeholder option (disabled, empty value) */
  placeholder?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Styled native select dropdown.
 *
 * @example
 * ```tsx
 * <Select placeholder="Choose a plan" value={plan} onChange={handleChange}>
 *   <option value="free">Free</option>
 *   <option value="pro">Pro</option>
 * </Select>
 * ```
 */
export function Select({
  variant = 'outline',
  size = 'md',
  error = false,
  errorMessage,
  fullWidth = false,
  placeholder,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  return (
    <div className={[styles.wrapper, fullWidth ? styles.fullWidth : ''].filter(Boolean).join(' ')}>
      <div className={styles.selectWrapper}>
        <select
          id={id}
          className={[
            styles.select,
            styles[variant],
            styles[size],
            error ? styles.error : '',
            className,
          ].filter(Boolean).join(' ')}
          aria-invalid={error || undefined}
          aria-describedby={errorMessage && id ? `${id}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <span className={styles.chevron} aria-hidden="true">
          <Icon as={ChevronDown} size="sm" />
        </span>
      </div>
      {error && errorMessage && (
        <span
          id={id ? `${id}-error` : undefined}
          className={styles.errorMessage}
          role="alert"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}
