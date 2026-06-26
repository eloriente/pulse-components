import type { ElementType, ReactNode } from 'react';
import styles from './Text.module.css';

// ─── Heading ────────────────────────────────────────────────────────────────

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';

export interface HeadingProps {
  /** Semantic heading level (h1–h6) */
  level?: HeadingLevel;
  /**
   * Visual size — independent from semantic level.
   * Defaults to matching the level (h1 → xl, h2 → lg, …).
   */
  size?: HeadingSize;
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  id?: string;
}

const HEADING_DEFAULT_SIZE: Record<HeadingLevel, HeadingSize> = {
  1: 'xl',
  2: 'lg',
  3: 'md',
  4: 'sm',
  5: 'xs',
  6: '2xs',
};

/**
 * Semantic heading (h1–h6) with independent visual sizing.
 *
 * @example
 * ```tsx
 * <Heading level={2} size="xl">Page title</Heading>
 * ```
 */
export function Heading({ level = 1, size, children, className, id }: HeadingProps) {
  const Tag = `h${level}` as ElementType;
  const resolvedSize = size ?? HEADING_DEFAULT_SIZE[level];

  return (
    <Tag
      id={id}
      className={[styles.heading, styles[`heading-${resolvedSize}`], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}

// ─── Text ────────────────────────────────────────────────────────────────────

export type TextVariant = 'body' | 'caption' | 'overline' | 'code';
export type TextSize = 'lg' | 'md' | 'sm' | 'xs';
export type TextWeight = 'regular' | 'medium' | 'bold';
export type TextAlign = 'left' | 'center' | 'right';
export type TextColor = 'default' | 'muted' | 'subtle' | 'inverse' | 'error' | 'success' | 'warning';

export interface TextProps {
  /** Semantic HTML element to render */
  as?: 'p' | 'span' | 'label' | 'div' | 'strong' | 'em' | 'small';
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  align?: TextAlign;
  color?: TextColor;
  /** Truncate text with ellipsis when overflowing */
  truncate?: boolean;
  children: ReactNode;
  className?: string;
  /** Forwarded htmlFor — useful when as="label" */
  htmlFor?: string;
}

/**
 * Polymorphic text primitive for body copy, captions, code, and labels.
 *
 * @example
 * ```tsx
 * <Text size="sm" color="muted">Helper text</Text>
 * <Text as="code" variant="code">const x = 1</Text>
 * ```
 */
export function Text({
  as: Tag = 'p',
  variant = 'body',
  size = 'md',
  weight = 'regular',
  align = 'left',
  color = 'default',
  truncate = false,
  children,
  className,
  htmlFor,
}: TextProps) {
  return (
    <Tag
      className={[
        styles.text,
        styles[`text-${variant}`],
        styles[`text-size-${size}`],
        styles[`text-weight-${weight}`],
        styles[`text-align-${align}`],
        styles[`text-color-${color}`],
        truncate ? styles['text-truncate'] : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...(htmlFor ? { htmlFor } : {})}
    >
      {children}
    </Tag>
  );
}
