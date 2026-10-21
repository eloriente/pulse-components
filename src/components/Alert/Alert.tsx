import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { Icon } from '../Icon';
import styles from './Alert.module.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  /** Visual and semantic tone of the alert */
  variant?: AlertVariant;
  /** Bold heading above the description */
  title?: ReactNode;
  /** Description content */
  children?: ReactNode;
  /** Shows a close button */
  dismissible?: boolean;
  /**
   * Auto-dismisses the alert after `autoDismissDelay`. Off by default — Alert is
   * meant to be a *persistent* banner (unlike Toast, which already auto-dismisses).
   *
   * ⚠️ Avoid for messages the user must read or act on: an alert that disappears
   * on its own without user input can conflict with WCAG 2.2.1 (Timing Adjustable).
   * Prefer `dismissible` (manual close) for anything important.
   */
  autoDismiss?: boolean;
  /** Delay in ms before auto-dismissing. Only applies when `autoDismiss` is true. Default `8000` */
  autoDismissDelay?: number;
  /** Called when the alert is dismissed, manually or automatically. Required when `dismissible` or `autoDismiss` is true */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
}

const VARIANT_ICON = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
} as const;

/**
 * Inline, persistent banner for page-level messages (as opposed to {@link Toast},
 * which is for transient notifications that appear and disappear on their own).
 * Persistent by default; pass `autoDismiss` to opt into auto-hiding it instead.
 *
 * @example
 * ```tsx
 * <Alert variant="warning" title="Trial ending soon" dismissible onDismiss={handleDismiss}>
 *   Your trial ends in 3 days. Upgrade to keep access.
 * </Alert>
 * ```
 */
export function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  autoDismiss = false,
  autoDismissDelay = 8000,
  onDismiss,
  className,
}: AlertProps) {
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!autoDismiss) return;
    const timer = setTimeout(() => onDismissRef.current?.(), autoDismissDelay);
    return () => clearTimeout(timer);
  }, [autoDismiss, autoDismissDelay]);

  return (
    <div
      className={[styles.alert, styles[variant], className].filter(Boolean).join(' ')}
      role="alert"
    >
      <Icon as={VARIANT_ICON[variant]} size="sm" className={styles.icon} />
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.description}>{children}</div>}
      </div>
      {dismissible && (
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <Icon as={X} size="xs" />
        </button>
      )}
    </div>
  );
}
