import type { InputHTMLAttributes } from 'react';
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { Icon } from '../Icon';
import styles from './Input.module.css';

export type InputVariant = 'outline' | 'filled' | 'underline';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual variant */
  variant?: InputVariant;
  size?: InputSize;
  /** Error state — renders error styling */
  error?: boolean;
  /** Error message displayed below the input */
  errorMessage?: string;
  /** Icon shown on the left side */
  iconLeft?: ComponentType<LucideProps>;
  /** Icon shown on the right side */
  iconRight?: ComponentType<LucideProps>;
  /** Full width */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Text input with variants, sizes, icons, and error state.
 *
 * @example
 * ```tsx
 * <Input placeholder="Search..." iconLeft={Search} />
 * <Input variant="filled" error errorMessage="This field is required" />
 * ```
 */
export function Input({
  variant = 'outline',
  size = 'md',
  error = false,
  errorMessage,
  iconLeft,
  iconRight,
  fullWidth = false,
  className,
  id,
  disabled,
  ...props
}: InputProps) {
  const wrapperClasses = [
    styles.wrapper,
    fullWidth ? styles.fullWidth : '',
  ].filter(Boolean).join(' ');

  const inputClasses = [
    styles.input,
    styles[variant],
    styles[size],
    error ? styles.error : '',
    iconLeft ? styles.hasIconLeft : '',
    iconRight ? styles.hasIconRight : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      <div className={styles.inputWrapper}>
        {iconLeft && (
          <span className={styles.iconLeft} aria-hidden="true">
            <Icon as={iconLeft} size="sm" />
          </span>
        )}
        <input
          id={id}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={errorMessage && id ? `${id}-error` : undefined}
          {...props}
        />
        {iconRight && (
          <span className={styles.iconRight} aria-hidden="true">
            <Icon as={iconRight} size="sm" />
          </span>
        )}
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
