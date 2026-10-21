import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Icon } from '../Icon';
import styles from './Accordion.module.css';

export type AccordionType = 'single' | 'multiple';
export type AccordionIconPosition = 'left' | 'right';

export interface AccordionItem {
  /** Unique id for this item, used in the controlled/uncontrolled `value` array */
  value: string;
  /** Header content (rendered inside the clickable trigger) */
  trigger: ReactNode;
  /** Panel content, shown when expanded */
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  /** Accordion items, in order */
  items: AccordionItem[];
  /** `'single'` allows only one item open at a time; `'multiple'` allows any number. Default `'single'` */
  type?: AccordionType;
  /** Controlled set of expanded item values. Omit to let Accordion manage its own state */
  value?: string[];
  /** Initial expanded values when uncontrolled. Default `[]` (all collapsed) */
  defaultValue?: string[];
  /** Called whenever the expanded set changes */
  onChange?: (value: string[]) => void;
  /** When `type` is `'single'`, allows clicking the open item to collapse it, leaving none open. Default `true` */
  collapsible?: boolean;
  /** Which side of the trigger label the expand/collapse chevron renders on. Default `'right'` */
  iconPosition?: AccordionIconPosition;
  /** Additional class applied to the root element */
  className?: string;
}

/**
 * Accessible accordion following the ARIA APG accordion pattern: each header is a
 * button (`aria-expanded`/`aria-controls`) inside an `<h3>`, each panel is a
 * `role="region"` labelled by its header. Arrow-key navigation moves focus
 * between headers (`Home`/`End` jump to the first/last enabled one); `Enter`/
 * `Space` toggle natively since headers are real `<button>` elements. Data-driven
 * (`items`), consistent with {@link DropdownMenu} and {@link Tabs}. Always fills
 * its container's width (doesn't shrink-wrap to the currently expanded content),
 * so its width stays stable as items open and close.
 *
 * @example
 * ```tsx
 * <Accordion
 *   items={[
 *     { value: 'shipping', trigger: 'Shipping', content: <ShippingInfo /> },
 *     { value: 'returns', trigger: 'Returns', content: <ReturnsPolicy /> },
 *   ]}
 * />
 * ```
 */
export function Accordion({
  items,
  type = 'single',
  value: controlledValue,
  defaultValue = [],
  onChange,
  collapsible = true,
  iconPosition = 'right',
  className,
}: AccordionProps) {
  const baseId = useId();
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const expandedValues = isControlled ? controlledValue : uncontrolledValue;

  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const enabledValues = items.filter((item) => !item.disabled).map((item) => item.value);

  const setExpanded = (next: string[]) => {
    if (!isControlled) setUncontrolledValue(next);
    onChange?.(next);
  };

  const toggle = (itemValue: string) => {
    const isOpen = expandedValues.includes(itemValue);
    if (type === 'multiple') {
      setExpanded(
        isOpen ? expandedValues.filter((v) => v !== itemValue) : [...expandedValues, itemValue],
      );
    } else {
      if (isOpen) {
        setExpanded(collapsible ? [] : expandedValues);
      } else {
        setExpanded([itemValue]);
      }
    }
  };

  const focusTrigger = (itemValue: string) => {
    triggerRefs.current[itemValue]?.focus();
  };

  const handleKeyDown = (itemValue: string) => (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = enabledValues.indexOf(itemValue);
    if (currentIndex === -1) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusTrigger(enabledValues[(currentIndex + 1) % enabledValues.length]);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusTrigger(enabledValues[(currentIndex - 1 + enabledValues.length) % enabledValues.length]);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusTrigger(enabledValues[0]);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusTrigger(enabledValues[enabledValues.length - 1]);
    }
  };

  return (
    <div className={[styles.accordion, className].filter(Boolean).join(' ')}>
      {items.map((item) => {
        const expanded = expandedValues.includes(item.value);
        const triggerId = `${baseId}-trigger-${item.value}`;
        const panelId = `${baseId}-panel-${item.value}`;
        return (
          <div key={item.value} className={styles.item}>
            <h3 className={styles.heading}>
              <button
                ref={(node) => {
                  triggerRefs.current[item.value] = node;
                }}
                id={triggerId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                disabled={item.disabled}
                className={[
                  styles.trigger,
                  expanded ? styles.expanded : '',
                  iconPosition === 'left' ? styles.iconLeft : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => toggle(item.value)}
                onKeyDown={handleKeyDown(item.value)}
              >
                {iconPosition === 'left' && (
                  <Icon as={ChevronDown} size="sm" className={styles.chevron} />
                )}
                <span className={styles.triggerLabel}>{item.trigger}</span>
                {iconPosition === 'right' && (
                  <Icon as={ChevronDown} size="sm" className={styles.chevron} />
                )}
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!expanded}
              className={styles.panel}
            >
              <div className={styles.panelContent}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
