import { useEffect, useId, useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';
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
import styles from './Drawer.module.css';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg';

const HORIZONTAL_SIZE_PX: Record<DrawerSize, number> = { sm: 280, md: 360, lg: 480 };
const VERTICAL_SIZE_PX: Record<DrawerSize, number> = { sm: 200, md: 320, lg: 440 };

export interface DrawerProps {
  /** Whether the drawer is open. Drawer has no trigger of its own — rendering is fully controlled */
  open: boolean;
  /** Called to request closing (Escape, backdrop click, or the built-in close button) */
  onClose: () => void;
  /** Visible heading rendered at the top of the panel; also wired up as the dialog's accessible name */
  title?: ReactNode;
  /** Panel content */
  children: ReactNode;
  /** Accessible name fallback when there's no visible `title` (required in that case for valid ARIA) */
  'aria-label'?: string;
  /** Edge the panel slides in from. Default `'right'` */
  placement?: DrawerPlacement;
  /** Width (for `left`/`right`) or height (for `top`/`bottom`) of the panel. Default `'md'` */
  size?: DrawerSize;
  /** Closes the drawer when the backdrop is clicked. Default `true` */
  closeOnBackdropClick?: boolean;
  /** Closes the drawer on `Escape`. Default `true` */
  closeOnEscape?: boolean;
  /** Additional class applied to the panel */
  className?: string;
}

/**
 * Accessible slide-in panel docked to a viewport edge: traps focus inside the panel
 * while open (`FloatingFocusManager`, modal), locks background scroll, and returns
 * focus to the previously focused element on close. Shares Modal's portal/focus-trap
 * pattern, but the panel is docked to and slides in from a viewport edge instead of
 * being centered. Like {@link Modal}, it has no trigger — rendering is fully
 * controlled via the `open`/`onClose` props.
 *
 * @example
 * ```tsx
 * <Drawer open={isOpen} onClose={() => setIsOpen(false)} title="Filters" placement="left">
 *   <p>Filter controls go here.</p>
 * </Drawer>
 * ```
 */
export function Drawer({
  open,
  onClose,
  title,
  children,
  'aria-label': ariaLabel,
  placement = 'right',
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
}: DrawerProps) {
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

  const isHorizontal = placement === 'left' || placement === 'right';
  const panelSizePx = isHorizontal ? HORIZONTAL_SIZE_PX[size] : VERTICAL_SIZE_PX[size];
  const panelStyle = useMemo<CSSProperties>(
    () => ({ '--pulse-drawer-size': `${panelSizePx}px` } as CSSProperties),
    [panelSizePx],
  );

  if (!open) return null;

  return (
    <FloatingPortal>
      <div className={[styles.backdrop, styles[placement]].join(' ')}>
        <FloatingFocusManager context={context} modal>
          <div
            ref={refs.setFloating}
            style={panelStyle}
            className={[styles.panel, styles[placement], className].filter(Boolean).join(' ')}
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
