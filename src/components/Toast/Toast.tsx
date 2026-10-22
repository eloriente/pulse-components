import type { ReactNode } from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { Icon } from '../Icon';
import styles from './Toast.module.css';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. `0` or `Infinity` disables auto-dismiss. Default `5000` */
  duration?: number;
}

export interface ToastProps {
  variant?: ToastVariant;
  title?: ReactNode;
  description?: ReactNode;
  onDismiss: () => void;
}

const VARIANT_ICON = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
} as const;

/**
 * A single toast notification. You normally won't render this directly — call
 * `useToast().toast(...)` from inside a {@link ToastProvider}, which manages
 * the stack and renders this component for you.
 *
 * @example
 * ```tsx
 * const { toast } = useToast();
 * toast({ variant: 'success', title: 'Saved', description: 'Your changes were saved.' });
 * ```
 */
export function Toast({ variant = 'info', title, description, onDismiss }: ToastProps) {
  return (
    <div className={[styles.toast, styles[variant]].filter(Boolean).join(' ')}>
      <Icon as={VARIANT_ICON[variant]} size="sm" className={styles.icon} />
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <button
        type="button"
        className={styles.closeButton}
        aria-label="Dismiss"
        onClick={onDismiss}
      >
        <Icon as={X} size="xs" />
      </button>
    </div>
  );
}
