import { useEffect, useId } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import {
  useFloating,
  useInteractions,
  useDismiss,
  useRole,
  FloatingPortal,
  FloatingFocusManager,
} from '@floating-ui/react';
import { Icon } from '../Icon';
import styles from './Modal.module.css';

export interface ModalProps {
  /** Whether the modal is open. Modal has no trigger of its own — rendering is fully controlled */
  open: boolean;
  /** Called to request closing (Escape, backdrop click, or the built-in close button) */
  onClose: () => void;
  /** Visible heading rendered at the top of the panel; also wired up as the dialog's accessible name */
  title?: ReactNode;
  /** Panel content */
  children: ReactNode;
  /** Accessible name fallback when there's no visible `title` (required in that case for valid ARIA) */
  'aria-label'?: string;
  /** Closes the modal when the backdrop is clicked. Default `true` */
  closeOnBackdropClick?: boolean;
  /** Closes the modal on `Escape`. Default `true` */
  closeOnEscape?: boolean;
  /** Additional class applied to the panel */
  className?: string;
}

/**
 * Accessible modal dialog: traps focus inside the panel while open (`FloatingFocusManager`,
 * modal), locks background scroll, and returns focus to the previously focused element
 * on close. Unlike {@link Popover} and {@link DropdownMenu}, it has no trigger — rendering
 * is fully controlled via the `open`/`onClose` props.
 *
 * @example
 * ```tsx
 * <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Delete item?">
 *   <p>This can't be undone.</p>
 *   <Button label="Delete" onClick={handleDelete} />
 * </Modal>
 * ```
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  'aria-label': ariaLabel,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
}: ModalProps) {
  const titleId = useId();

  const { refs, context } = useFloating({
    open,
    onOpenChange: (next) => {
      if (!next) onClose();
    },
  });

  const { getFloatingProps } = useInteractions([
    useDismiss(context, { escapeKey: closeOnEscape, outsidePress: closeOnBackdropClick }),
    useRole(context, { role: 'dialog' }),
  ]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <FloatingPortal>
      <div className={styles.backdrop}>
        <FloatingFocusManager context={context} modal>
          <div
            ref={refs.setFloating}
            className={[styles.panel, className].filter(Boolean).join(' ')}
            {...getFloatingProps()}
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-label={title ? undefined : ariaLabel}
          >
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Close"
              onClick={onClose}
            >
              <Icon as={X} size="sm" />
            </button>
            {title && (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            )}
            <div className={styles.content}>{children}</div>
          </div>
        </FloatingFocusManager>
      </div>
    </FloatingPortal>
  );
}
