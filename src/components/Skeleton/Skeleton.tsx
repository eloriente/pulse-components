import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './Skeleton.module.css';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Shape of the placeholder. Default `'text'` */
  variant?: SkeletonVariant;
  /** Width (CSS length or number of px). Defaults to `'100%'` */
  width?: number | string;
  /** Height (CSS length or number of px). Defaults to `'1em'` for `text`, `40px` for `circular`, `100px` for `rectangular` */
  height?: number | string;
  /** Shimmer effect. Default `'pulse'` */
  animation?: SkeletonAnimation;
}

const DEFAULT_HEIGHT: Record<SkeletonVariant, string> = {
  text: '1em',
  circular: '40px',
  rectangular: '100px',
};

function toCssLength(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Loading placeholder that mimics the shape of the content it stands in for.
 * Purely decorative (`aria-hidden="true"`) — wrap the loading region itself
 * in `aria-busy`/`role="status"` so assistive tech announces the loading state.
 *
 * @example
 * ```tsx
 * <Skeleton variant="circular" width={40} height={40} />
 * <Skeleton variant="text" width="60%" />
 * <Skeleton variant="rectangular" height={120} />
 * ```
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
  ...props
}: SkeletonProps) {
  const style: CSSProperties = {
    width: toCssLength(width) ?? '100%',
    height: toCssLength(height) ?? DEFAULT_HEIGHT[variant],
  };

  const classes = [styles.skeleton, styles[variant], styles[animation], className]
    .filter(Boolean)
    .join(' ');

  return <div className={classes} style={style} aria-hidden="true" {...props} />;
}
