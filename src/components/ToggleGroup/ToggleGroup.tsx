import { useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import styles from './ToggleGroup.module.css';

export type ToggleGroupType = 'single' | 'multiple';
export type ToggleGroupOrientation = 'horizontal' | 'vertical';
export type ToggleGroupSize = 'sm' | 'md' | 'lg';

export interface ToggleGroupItem {
  /** Unique id for this item, used as the controlled/uncontrolled value */
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  /** Items, in order */
  items: ToggleGroupItem[];
  /** `'single'` behaves like a radio group (exactly zero or one selected, can't
   * deselect by clicking the active item again); `'multiple'` behaves like a
   * set of independent toggle buttons. Default `'single'` */
  type?: ToggleGroupType;
  /** Layout and, in `'single'` mode, arrow-key direction. Default `'horizontal'` */
  orientation?: ToggleGroupOrientation;
  /**
   * Controlled selected values. Always a `string[]` regardless of `type` (in
   * `'single'` mode it holds at most one value) — same convention as
   * {@link Accordion}, to avoid a type that changes shape with a prop.
   */
  value?: string[];
  /** Uncontrolled initial selected values. Default `[]` (nothing selected) */
  defaultValue?: string[];
  /** Called with the full set of selected values after a click or, in `'single'` mode, arrow-key navigation */
  onChange?: (value: string[]) => void;
  size?: ToggleGroupSize;
  /** Disables every item */
  disabled?: boolean;
  /** Accessible name for the group — required for valid ARIA (there's no visible heading) */
  'aria-label'?: string;
  /** Additional class applied to the root element */
  className?: string;
}

/**
 * Segmented control / toggle button group. `type="single"` renders an ARIA
 * `radiogroup` (roving tabindex, arrow keys move focus *and* select — same
 * automatic-activation pattern {@link Tabs} uses — `Home`/`End` jump to the
 * first/last enabled item, and clicking the already-selected item is a no-op,
 * matching native radio buttons: you can't deselect down to nothing by
 * clicking). `type="multiple"` renders a plain `group` of independently
 * tabbable toggle buttons (`aria-pressed`) with no roving focus, since there's
 * no mutual-exclusivity to coordinate with arrow keys.
 *
 * @example
 * ```tsx
 * <ToggleGroup
 *   aria-label="Text alignment"
 *   items={[
 *     { value: 'left', label: 'Left' },
 *     { value: 'center', label: 'Center' },
 *     { value: 'right', label: 'Right' },
 *   ]}
 *   value={alignment}
 *   onChange={([next]) => setAlignment(next)}
 * />
 * ```
 */
export function ToggleGroup({
  items,
  type = 'single',
  orientation = 'horizontal',
  value: controlledValue,
  defaultValue = [],
  onChange,
  size = 'md',
  disabled = false,
  'aria-label': ariaLabel,
  className,
}: ToggleGroupProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const activeValues = isControlled ? controlledValue : uncontrolledValue;

  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const enabledValues = items.filter((item) => !item.disabled).map((item) => item.value);

  const commit = (next: string[]) => {
    if (!isControlled) setUncontrolledValue(next);
    onChange?.(next);
  };

  const selectSingle = (itemValue: string) => commit([itemValue]);

  const toggleMultiple = (itemValue: string) => {
    commit(
      activeValues.includes(itemValue)
        ? activeValues.filter((v) => v !== itemValue)
        : [...activeValues, itemValue],
    );
  };

  const handleClick = (item: ToggleGroupItem) => {
    if (item.disabled || disabled) return;
    if (type === 'single') {
      if (activeValues.includes(item.value)) return;
      selectSingle(item.value);
    } else {
      toggleMultiple(item.value);
    }
  };

  const focusAndSelect = (nextValue: string) => {
    itemRefs.current[nextValue]?.focus();
    selectSingle(nextValue);
  };

  const rovingValue = activeValues[0] ?? enabledValues[0];

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (type !== 'single' || disabled) return;
    const currentIndex = enabledValues.indexOf(rovingValue ?? '');
    if (currentIndex === -1) return;

    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

    if (event.key === nextKey) {
      event.preventDefault();
      focusAndSelect(enabledValues[(currentIndex + 1) % enabledValues.length]);
    } else if (event.key === prevKey) {
      event.preventDefault();
      focusAndSelect(
        enabledValues[(currentIndex - 1 + enabledValues.length) % enabledValues.length],
      );
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusAndSelect(enabledValues[0]);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusAndSelect(enabledValues[enabledValues.length - 1]);
    }
  };

  return (
    <div
      role={type === 'single' ? 'radiogroup' : 'group'}
      aria-label={ariaLabel}
      aria-orientation={type === 'single' ? orientation : undefined}
      className={[styles.toggleGroup, styles[orientation], className].filter(Boolean).join(' ')}
    >
      {items.map((item) => {
        const selected = activeValues.includes(item.value);
        const itemDisabled = disabled || item.disabled;

        return (
          <button
            key={item.value}
            ref={(node) => {
              itemRefs.current[item.value] = node;
            }}
            type="button"
            role={type === 'single' ? 'radio' : undefined}
            aria-checked={type === 'single' ? selected : undefined}
            aria-pressed={type === 'multiple' ? selected : undefined}
            disabled={itemDisabled}
            tabIndex={type === 'single' ? (item.value === rovingValue ? 0 : -1) : 0}
            className={[styles.item, styles[size], selected ? styles.selected : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleClick(item)}
            onKeyDown={type === 'single' ? handleKeyDown : undefined}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
