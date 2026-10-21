import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import styles from './Tabs.module.css';

export type TabsOrientation = 'horizontal' | 'vertical';

export interface TabItem {
  /** Unique id for this tab, used as the controlled/uncontrolled value */
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  /** Tabs, in order */
  items: TabItem[];
  /** Controlled selected value. Omit to let Tabs manage its own state */
  value?: string;
  /** Initial selected value when uncontrolled. Defaults to the first enabled tab */
  defaultValue?: string;
  /** Called whenever the selected tab changes (click or arrow-key navigation) */
  onChange?: (value: string) => void;
  /** Layout and arrow-key direction. Default `'horizontal'` */
  orientation?: TabsOrientation;
  /** Additional class applied to the root element */
  className?: string;
}

/**
 * Accessible tabs following the ARIA APG tabs pattern: roving tabindex, arrow-key
 * navigation (`Home`/`End` jump to the first/last enabled tab), and automatic
 * activation — moving focus with the keyboard selects the tab immediately,
 * matching how native OS tabs behave. Disabled tabs are skipped during
 * navigation. Data-driven (`items`), not a compound component — consistent with
 * {@link DropdownMenu}, the only other data-driven list component in this
 * library.
 *
 * @example
 * ```tsx
 * <Tabs
 *   items={[
 *     { value: 'account', label: 'Account', content: <AccountForm /> },
 *     { value: 'billing', label: 'Billing', content: <BillingForm /> },
 *   ]}
 * />
 * ```
 */
export function Tabs({
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  orientation = 'horizontal',
  className,
}: TabsProps) {
  const baseId = useId();
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    () => defaultValue ?? items.find((item) => !item.disabled)?.value,
  );
  const activeValue = isControlled ? controlledValue : uncontrolledValue;

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const enabledValues = items.filter((item) => !item.disabled).map((item) => item.value);

  const selectTab = (nextValue: string) => {
    if (!isControlled) setUncontrolledValue(nextValue);
    onChange?.(nextValue);
  };

  const focusAndSelectTab = (nextValue: string) => {
    tabRefs.current[nextValue]?.focus();
    selectTab(nextValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = enabledValues.indexOf(activeValue ?? '');
    if (currentIndex === -1) return;

    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

    if (event.key === nextKey) {
      event.preventDefault();
      focusAndSelectTab(enabledValues[(currentIndex + 1) % enabledValues.length]);
    } else if (event.key === prevKey) {
      event.preventDefault();
      focusAndSelectTab(
        enabledValues[(currentIndex - 1 + enabledValues.length) % enabledValues.length],
      );
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusAndSelectTab(enabledValues[0]);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusAndSelectTab(enabledValues[enabledValues.length - 1]);
    }
  };

  return (
    <div className={[styles.tabs, styles[orientation], className].filter(Boolean).join(' ')}>
      <div role="tablist" aria-orientation={orientation} className={styles.tabList}>
        {items.map((item) => {
          const selected = item.value === activeValue;
          return (
            <button
              key={item.value}
              ref={(node) => {
                tabRefs.current[item.value] = node;
              }}
              id={`${baseId}-tab-${item.value}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.value}`}
              disabled={item.disabled}
              tabIndex={selected ? 0 : -1}
              className={[styles.tab, selected ? styles.selected : ''].filter(Boolean).join(' ')}
              onClick={() => selectTab(item.value)}
              onKeyDown={handleKeyDown}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => {
        const selected = item.value === activeValue;
        return (
          <div
            key={item.value}
            role="tabpanel"
            id={`${baseId}-panel-${item.value}`}
            aria-labelledby={`${baseId}-tab-${item.value}`}
            hidden={!selected}
            tabIndex={0}
            className={styles.panel}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
