import styles from './Spinner.module.css';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'ring' | 'dots';

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  color?: string;
  /** Accessible label for screen readers */
  label?: string;
  className?: string;
}

/**
 * Loading spinner indicator.
 *
 * @example
 * ```tsx
 * <Spinner size="md" label="Loading results..." />
 * ```
 */
export function Spinner({
  size = 'md',
  variant = 'ring',
  color,
  label = 'Loading...',
  className,
}: SpinnerProps) {
  return (
    <span
      className={[styles.spinner, styles[variant], styles[size], className].filter(Boolean).join(' ')}
      style={color ? ({ '--spinner-color': color } as React.CSSProperties) : undefined}
      role="status"
      aria-label={label}
    >
      {variant === 'dots' && (
        <>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </>
      )}
    </span>
  );
}
