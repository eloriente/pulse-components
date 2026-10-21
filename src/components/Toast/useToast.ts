import { useContext } from 'react';
import { ToastContext } from './ToastProvider';

/**
 * Returns `{ toast, dismiss }` to queue or remove toast notifications. Must be
 * called from a component rendered inside a {@link ToastProvider}.
 *
 * @example
 * ```tsx
 * const { toast } = useToast();
 * toast({ variant: 'error', title: 'Something went wrong' });
 * ```
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return context;
}
