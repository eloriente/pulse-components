import type { ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'solid' | 'subtle' | 'outline';
export type BadgeColor = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  /** Optional dot indicator */
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Status badge / label chip for counts, states, and categories.
 *
 * @example
 * ```tsx
 * <Badge color="success">Active</Badge>
 * <Badge color="error" variant="subtle">3 errors</Badge>
 * ```
 */
export function Badge({
  variant = 'subtle',
  color = 'default',
  size = 'md',
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={[
        styles.badge,
        styles[variant],
        styles[`color-${color}`],
        styles[size],
        className,
      ].filter(Boolean).join(' ')}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
