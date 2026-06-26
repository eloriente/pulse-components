import type { ComponentType, SVGProps } from 'react';
import type { LucideProps } from 'lucide-react';
import styles from './Icon.module.css';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export interface IconProps {
  /** Lucide icon component to render */
  as?: ComponentType<LucideProps>;
  /** Custom SVG component — alternative to `as` */
  children?: React.ReactElement<SVGProps<SVGSVGElement>>;
  /** Predefined size token */
  size?: IconSize;
  /** Explicit pixel size — overrides `size` */
  pixelSize?: number;
  /** Icon color — defaults to currentColor (inherits from text) */
  color?: string;
  /** Stroke width for Lucide icons */
  strokeWidth?: number;
  /** Accessible label. Required when the icon is standalone (no adjacent text) */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Icon component — renders Lucide icons or custom SVG components
 * with consistent sizing, color, and accessibility support.
 *
 * @example Built-in Lucide icon
 * ```tsx
 * import { Search } from 'lucide-react'
 * <Icon as={Search} size="md" label="Search" />
 * ```
 *
 * @example Custom SVG component
 * ```tsx
 * <Icon size="lg"><MyCustomSvg /></Icon>
 * ```
 */
export function Icon({
  as: LucideIcon,
  children,
  size = 'md',
  pixelSize,
  color = 'currentColor',
  strokeWidth = 2,
  label,
  className,
}: IconProps) {
  const resolvedSize = pixelSize ?? SIZE_MAP[size];
  const ariaProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const };

  if (LucideIcon) {
    return (
      <LucideIcon
        size={resolvedSize}
        color={color}
        strokeWidth={strokeWidth}
        className={[styles.icon, className].filter(Boolean).join(' ')}
        {...ariaProps}
      />
    );
  }

  if (children) {
    const child = children as React.ReactElement<SVGProps<SVGSVGElement> & { 'aria-label'?: string; 'aria-hidden'?: boolean | 'true' | 'false'; role?: string }>;
    return (
      <span
        className={[styles.iconWrapper, className].filter(Boolean).join(' ')}
        style={{ display: 'inline-flex', width: resolvedSize, height: resolvedSize }}
        {...ariaProps}
      >
        {child}
      </span>
    );
  }

  return null;
}
