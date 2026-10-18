import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  useFloating,
  useInteractions,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  offset,
  flip,
  shift,
  arrow,
  autoUpdate,
  FloatingPortal,
  FloatingArrow,
} from '@floating-ui/react';
import styles from './Tooltip.module.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Content rendered inside the tooltip bubble when open */
  content: ReactNode;
  /** Trigger element(s) the tooltip is attached to */
  children: ReactNode;
  /** Preferred side; flips automatically when there isn't room in the viewport */
  placement?: TooltipPlacement;
  /** Delay (ms) before showing/hiding on hover. A number applies to both; pass an object to set them independently */
  delay?: number | { open?: number; close?: number };
  /** Disables the tooltip entirely; children render without any wrapper or listeners */
  disabled?: boolean;
  /** Additional class applied to the tooltip bubble */
  className?: string;
}

/**
 * Accessible tooltip positioned with Floating UI (flips/shifts to stay in the viewport).
 *
 * The trigger is wrapped in a `<span>` rather than cloned onto `children`, so it works
 * with any trigger — including this library's own components, none of which use
 * `forwardRef`. The tooltip opens on hover and on keyboard focus, and closes on
 * `Escape` or on blur/mouse leave.
 *
 * @example
 * ```tsx
 * <Tooltip content="Delete item">
 *   <Button iconOnly={Trash2} aria-label="Delete" />
 * </Tooltip>
 * ```
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 200,
  disabled = false,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { delay, move: false }),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
  ]);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <>
      <span ref={refs.setReference} className={styles.trigger} {...getReferenceProps()}>
        {children}
      </span>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={[styles.tooltip, className].filter(Boolean).join(' ')}
            {...getFloatingProps()}
          >
            {content}
            <FloatingArrow ref={arrowRef} context={context} className={styles.arrow} />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
