import type { TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.css';

export type TextareaVariant = 'outline' | 'filled';
export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
  size?: TextareaSize;
  error?: boolean;
  errorMessage?: string;
  resize?: TextareaResize;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Multi-line text input with variants, sizes, and error state.
 */
export function Textarea({
  variant = 'outline',
  size = 'md',
  error = false,
  errorMessage,
  resize = 'vertical',
  fullWidth = false,
  className,
  id,
  style,
  ...props
}: TextareaProps) {
  return (
    <div className={[styles.wrapper, fullWidth ? styles.fullWidth : ''].filter(Boolean).join(' ')}>
      <textarea
        id={id}
        className={[
          styles.textarea,
          styles[variant],
          styles[size],
          error ? styles.error : '',
          className,
        ].filter(Boolean).join(' ')}
        style={{ resize, ...style }}
        aria-invalid={error || undefined}
        aria-describedby={errorMessage && id ? `${id}-error` : undefined}
        {...props}
      />
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
