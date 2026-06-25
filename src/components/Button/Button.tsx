import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use. Overrides the variant color. */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button label text */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
  /**
   * Additional CSS classes to apply to the button.
   * Use this to extend or override styles (e.g. with Tailwind utilities).
   */
  className?: string;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  className,
  ...props
}: ButtonProps) => {
  const classes = [
    styles.button,
    styles[size],
    primary ? styles.primary : styles.secondary,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      style={backgroundColor ? { backgroundColor } : undefined}
      {...props}
    >
      {label}
    </button>
  );
};
