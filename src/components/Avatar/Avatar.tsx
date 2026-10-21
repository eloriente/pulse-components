import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** Image URL */
  src?: string;
  /** Alt text — also used to generate initials fallback */
  alt: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  /** Background color for the initials fallback */
  color?: string;
  className?: string;
}

const SIZE_PX: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * User avatar — shows an image or falls back to initials. Also falls back to
 * initials if the image fails to load (e.g. a broken or 404 `src`).
 *
 * @example
 * ```tsx
 * <Avatar src="/photo.jpg" alt="Ana García" />
 * <Avatar alt="John Doe" />  // shows "JD"
 * ```
 */
export function Avatar({ src, alt, size = 'md', shape = 'circle', color, className, ...props }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | undefined>(undefined);
  const px = SIZE_PX[size];

  const containerClass = [
    styles.avatar,
    styles[size],
    styles[shape],
    className,
  ].filter(Boolean).join(' ');

  if (src && src !== failedSrc) {
    return (
      <img
        src={src}
        alt={alt}
        className={containerClass}
        width={px}
        height={px}
        onError={() => setFailedSrc(src)}
        {...props}
      />
    );
  }

  return (
    <span
      className={containerClass}
      style={color ? { backgroundColor: color } : undefined}
      aria-label={alt}
      role="img"
    >
      <span className={styles.initials} aria-hidden="true">
        {getInitials(alt)}
      </span>
    </span>
  );
}
