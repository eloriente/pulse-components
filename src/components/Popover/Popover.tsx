import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  offset,
  flip,
  shift,
  arrow,
  autoUpdate,
  FloatingPortal,
  FloatingArrow,
  FloatingFocusManager,
} from '@floating-ui/react';
import styles from './Popover.module.css';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface PopoverProps {
  /** Interactive content rendered inside the popover panel */
  content: ReactNode;
  /** Trigger element that toggles the popover on click */
  children: ReactNode;
  /** Preferred side; flips automatically when there isn't room in the viewport */
  placement?: PopoverPlacement;
  /** Controlled open state. Omit to let the popover manage its own state */
  open?: boolean;
  /** Initial open state when uncontrolled */
  defaultOpen?: boolean;
  /** Called whenever the open state changes (click on trigger, outside click, Escape) */
  onOpenChange?: (open: boolean) => void;
  /** Disables the popover entirely; children render without any wrapper or listeners */
  disabled?: boolean;
  /** Additional class applied to the popover panel */
  className?: string;
  /**
   * Accessible name for the panel (`role="dialog"` requires one). Required unless
   * `content` already renders a visible, labelled heading referenced via
   * `aria-labelledby` on a wrapper you control.
   */
  'aria-label'?: string;
}

/**
 * Accessible popover for interactive content, positioned with Floating UI
 * (flips/shifts to stay in the viewport).
 *
 * Unlike {@link Tooltip}, it opens on click (not hover), traps focus inside the
 * panel while open (`FloatingFocusManager`, non-modal), and returns focus to the
 * trigger on close. The trigger is wrapped in a `<span>` rather than cloned onto
 * `children`, so it works with any trigger — including this library's own
 * components, none of which use `forwardRef`. Because of that wrapper, `aria-expanded`
 * can't be exposed on the actual interactive trigger element, so pass `aria-label`
 * to describe the panel instead (required for `role="dialog"` to be valid ARIA).
 *
 * @example
 * ```tsx
 * <Popover content={<Menu items={items} />} aria-label="Options menu">
 *   <Button label="Options" />
 * </Popover>
 * ```
 */
export function Popover({
  content,
  children,
  placement = 'bottom',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

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
    useClick(context),
    useDismiss(context),
    useRole(context),
  ]);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <>
      {/*
        `aria-expanded` is overridden back to undefined: `getReferenceProps()` adds it,
        but it's only valid ARIA on elements with a role that supports it, and this
        wrapper is a plain `<span>` (see the class JSDoc for why it can't be the
        actual interactive trigger element).
      */}
      <span
        ref={refs.setReference}
        className={styles.trigger}
        {...getReferenceProps()}
        aria-expanded={undefined}
      >
        {children}
      </span>
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className={[styles.popover, className].filter(Boolean).join(' ')}
              aria-label={ariaLabel}
              {...getFloatingProps()}
            >
              {content}
              <FloatingArrow ref={arrowRef} context={context} className={styles.arrow} />
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
