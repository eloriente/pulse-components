import { useRef, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { LucideProps } from 'lucide-react';
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  useTypeahead,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
  FloatingFocusManager,
} from '@floating-ui/react';
import { Icon } from '../Icon';
import styles from './DropdownMenu.module.css';

export type DropdownMenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export interface DropdownMenuAction {
  type?: 'item';
  /** Unique key; falls back to the array index when omitted */
  key?: string;
  label: ReactNode;
  /** Lucide icon rendered to the left of the label */
  icon?: ComponentType<LucideProps>;
  disabled?: boolean;
  /** Styles the item as a destructive action (e.g. "Delete") */
  danger?: boolean;
  onSelect?: () => void;
}

export interface DropdownMenuSeparator {
  type: 'separator';
  key?: string;
}

export type DropdownMenuEntry = DropdownMenuAction | DropdownMenuSeparator;

export interface DropdownMenuProps {
  /** Trigger element that opens the menu on click */
  children: ReactNode;
  /** Menu entries, in order */
  items: DropdownMenuEntry[];
  /** Preferred corner; flips automatically when there isn't room in the viewport */
  placement?: DropdownMenuPlacement;
  /** Controlled open state. Omit to let the menu manage its own state */
  open?: boolean;
  /** Initial open state when uncontrolled */
  defaultOpen?: boolean;
  /** Called whenever the open state changes (click on trigger, select an item, outside click, Escape) */
  onOpenChange?: (open: boolean) => void;
  /** Disables the menu entirely; children render without any wrapper or listeners */
  disabled?: boolean;
  /** Additional class applied to the menu panel */
  className?: string;
}

/**
 * Accessible dropdown menu positioned with Floating UI (flips/shifts to stay in
 * the viewport). Supports arrow-key navigation, typeahead (type a letter to jump
 * to a matching item), `Escape` to close with focus returned to the trigger, and
 * disabled items/separators. Supports controlled (`open`/`onOpenChange`) and
 * uncontrolled (`defaultOpen`) modes, same as {@link Popover}. The trigger is
 * wrapped in a `<span>` rather than cloned onto `children`, so it works with
 * any trigger — including this library's own components, none of which use
 * `forwardRef`.
 *
 * @example
 * ```tsx
 * <DropdownMenu
 *   items={[
 *     { label: 'Rename', icon: Pencil, onSelect: handleRename },
 *     { type: 'separator' },
 *     { label: 'Delete', icon: Trash2, danger: true, onSelect: handleDelete },
 *   ]}
 * >
 *   <Button label="Options" />
 * </DropdownMenu>
 * ```
 */
export function DropdownMenu({
  children,
  items,
  placement = 'bottom-start',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  });

  const listRef = useRef<Array<HTMLElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context, { role: 'menu' }),
    useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      loop: true,
      // Always focus the first item on open, even when triggered by a pointer click
      // (the default only does this for keyboard-triggered opens).
      focusItemOnOpen: true,
    }),
    useTypeahead(context, {
      listRef: labelsRef,
      activeIndex,
      onMatch: setActiveIndex,
    }),
  ]);

  if (disabled) {
    return <>{children}</>;
  }

  const handleSelect = (entry: DropdownMenuAction) => {
    if (entry.disabled) return;
    entry.onSelect?.();
    setOpen(false);
  };

  return (
    <>
      <span
        ref={refs.setReference}
        className={styles.trigger}
        {...getReferenceProps()}
        aria-expanded={undefined}
      >
        {children}
      </span>
      {open && (
        <FloatingPortal preserveTabOrder={false}>
          <FloatingFocusManager context={context} modal={false} guards={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className={[styles.menu, className].filter(Boolean).join(' ')}
              {...getFloatingProps()}
            >
              {items.map((entry, index) => {
                if (entry.type === 'separator') {
                  return (
                    <div
                      key={entry.key ?? `separator-${index}`}
                      role="separator"
                      className={styles.separator}
                    />
                  );
                }

                const label = typeof entry.label === 'string' ? entry.label : null;

                return (
                  <button
                    key={entry.key ?? index}
                    type="button"
                    ref={(node) => {
                      listRef.current[index] = entry.disabled ? null : node;
                      labelsRef.current[index] = entry.disabled ? null : label;
                    }}
                    role="menuitem"
                    tabIndex={activeIndex === index ? 0 : -1}
                    disabled={entry.disabled}
                    className={[styles.item, entry.danger ? styles.danger : '']
                      .filter(Boolean)
                      .join(' ')}
                    {...getItemProps({ onClick: () => handleSelect(entry) })}
                  >
                    {entry.icon && <Icon as={entry.icon} size="sm" />}
                    {entry.label}
                  </button>
                );
              })}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
