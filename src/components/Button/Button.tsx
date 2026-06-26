import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { Icon } from '../Icon';
import styles from './Button.module.css';

export interface ButtonProps {
  /** Primary call to action variant */
  primary?: boolean;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button label text */
  label?: string;
  /** Lucide icon rendered to the left of the label */
  iconLeft?: ComponentType<LucideProps>;
  /** Lucide icon rendered to the right of the label */
  iconRight?: ComponentType<LucideProps>;
  /** Renders only an icon (no label). Requires `aria-label` for accessibility */
  iconOnly?: ComponentType<LucideProps>;
  /** Shows a loading spinner and disables interaction */
  loading?: boolean;
  /** Disables the button */
  disabled?: boolean;
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
  /** Background color override */
  backgroundColor?: string;
  /** Optional click handler */
  onClick?: () => void;
  /**
   * Accessible label — required when using `iconOnly` or when label
   * alone is not descriptive enough.
   */
  'aria-label'?: string;
  /**
   * Additional CSS classes (e.g. Tailwind utilities).
   */
  className?: string;
}

const ICON_SIZE_MAP = {
  small: 'xs',
  medium: 'sm',
  large: 'md',
} as const;

/** Primary UI component for user interaction */
export function Button({
  primary = false,
  size = 'medium',
  label,
  iconLeft,
  iconRight,
  iconOnly,
  loading = false,
  disabled = false,
  type = 'button',
  backgroundColor,
  className,
  ...props
}: ButtonProps) {
  const iconSize = ICON_SIZE_MAP[size];
  const isDisabled = disabled || loading;

  const classes = [
    styles.button,
    styles[size],
    primary ? styles.primary : styles.secondary,
    iconOnly ? styles.iconOnly : '',
    loading ? styles.loading : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      style={backgroundColor ? { backgroundColor } : undefined}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true" />
      )}
      {!loading && iconOnly && (
        <Icon as={iconOnly} size={iconSize} />
      )}
      {!loading && !iconOnly && (
        <>
          {iconLeft && <Icon as={iconLeft} size={iconSize} />}
          {label && <span>{label}</span>}
          {iconRight && <Icon as={iconRight} size={iconSize} />}
        </>
      )}
    </button>
  );
}
