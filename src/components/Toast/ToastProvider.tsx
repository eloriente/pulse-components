import { createContext, useCallback, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Toast } from './Toast';
import type { ToastOptions } from './Toast';
import styles from './Toast.module.css';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastContextValue {
  /** Queues a toast; returns its id (pass to `dismiss` to remove it early) */
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

interface ToastItem extends Required<Pick<ToastOptions, 'variant'>> {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  /** Corner of the viewport the stack renders in. Default `'bottom-right'` */
  position?: ToastPosition;
}

/**
 * Provides `useToast()` to the component tree below it and renders the
 * notification stack in a portal. Mount it once, near the root of your app.
 *
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 *
 * // anywhere inside <App />:
 * const { toast } = useToast();
 * toast({ variant: 'success', title: 'Saved' });
 * ```
 */
export function ToastProvider({ children, position = 'bottom-right' }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const idCounter = useRef(0);

  const dismiss = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'info', duration = 5000 }: ToastOptions) => {
      const id = `toast-${++idCounter.current}`;
      setItems((current) => [...current, { id, title, description, variant }]);
      if (duration > 0 && Number.isFinite(duration)) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration),
        );
      }
      return id;
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {createPortal(
        <div
          className={[styles.viewport, styles[position]].filter(Boolean).join(' ')}
          role="region"
          aria-label="Notifications"
          aria-live="polite"
          aria-atomic="false"
        >
          {items.map((item) => (
            <Toast
              key={item.id}
              variant={item.variant}
              title={item.title}
              description={item.description}
              onDismiss={() => dismiss(item.id)}
            />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
