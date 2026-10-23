import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  useFloating,
  useInteractions,
  useListNavigation,
  useDismiss,
  useRole,
  offset,
  flip,
  size as sizeMiddleware,
  autoUpdate,
  FloatingPortal,
} from '@floating-ui/react';
import { Icon } from '../Icon';
import styles from './Combobox.module.css';

export interface ComboboxOption {
  /** Unique value committed via `onChange` */
  value: string;
  /** Text shown in the list and in the input once selected */
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** All selectable options; filtered client-side as the user types */
  options: ComboboxOption[];
  /** Controlled: the selected option's `value` */
  value?: string;
  /** Uncontrolled: initial selected option's `value` */
  defaultValue?: string;
  /** Called with the selected option's `value` when the user commits a choice */
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Message shown when no option matches the current input text. Default `'No results'` */
  noOptionsMessage?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  id?: string;
  /** Accessible name — required when there's no associated visible `<label htmlFor>` */
  'aria-label'?: string;
  className?: string;
}

/**
 * Accessible combobox: a text input that filters a list of options as you type.
 * Follows the ARIA APG "editable combobox with list autocomplete" pattern via
 * Floating UI's purpose-built support for it — `useRole(context, { role:
 * 'combobox' })` wires `role="combobox"`/`aria-expanded`/`aria-controls`/
 * `aria-autocomplete` on the input and `role="listbox"`/`role="option"` on the
 * popup, and `useListNavigation({ virtual: true })` moves `aria-activedescendant`
 * instead of real DOM focus — so, unlike {@link DropdownMenu}, there's no
 * `FloatingFocusManager`/focus trap: focus never leaves the input. The trigger
 * is the input itself (`refs.setReference`), reusing the span-wrapper-free
 * approach this repo already uses wherever a real `<input>` can serve as the
 * reference, since no component here uses `forwardRef`.
 *
 * Manages its own input text internally; `value`/`defaultValue`/`onChange`
 * track only the committed selection (controlled/uncontrolled, same pattern as
 * {@link Popover}), not the in-progress search text.
 *
 * @example
 * ```tsx
 * <Combobox
 *   aria-label="Country"
 *   options={[{ value: 'es', label: 'Spain' }, { value: 'fr', label: 'France' }]}
 *   onChange={setCountry}
 * />
 * ```
 */
export function Combobox({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder,
  noOptionsMessage = 'No results',
  disabled = false,
  error = false,
  errorMessage,
  id,
  'aria-label': ariaLabel,
  className,
}: ComboboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selectedValue = isControlled ? controlledValue : uncontrolledValue;
  const selectedOption = options.find((option) => option.value === selectedValue);

  const [inputValue, setInputValue] = useState(selectedOption?.label ?? '');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setInputValue(selectedOption?.label ?? '');
    // Only re-sync when the committed selection itself changes (controlled
    // from outside, or just committed) — never on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue]);

  const filteredOptions = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    if (!query || query === selectedOption?.label.toLowerCase()) return options;
    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, inputValue, selectedOption]);

  const { refs, floatingStyles, context } = useFloating({
    open: open && !disabled,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      sizeMiddleware({
        padding: 8,
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.min(availableHeight, 280)}px`,
          });
        },
      }),
    ],
  });

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useRole(context, { role: 'combobox' }),
    useDismiss(context),
    useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      virtual: true,
      loop: false,
    }),
  ]);

  const commitSelection = (option: ComboboxOption) => {
    if (option.disabled) return;
    if (!isControlled) setUncontrolledValue(option.value);
    setInputValue(option.label);
    onChange?.(option.value);
    setOpen(false);
    setActiveIndex(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && activeIndex !== null) {
      event.preventDefault();
      const option = filteredOptions[activeIndex];
      if (option) commitSelection(option);
    }
  };

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <div className={styles.inputWrapper}>
        <input
          id={inputId}
          type="text"
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={inputValue}
          aria-label={ariaLabel}
          aria-invalid={error || undefined}
          aria-describedby={error && errorMessage ? `${inputId}-error` : undefined}
          className={[styles.input, error ? styles.error : ''].filter(Boolean).join(' ')}
          ref={refs.setReference}
          {...getReferenceProps({
            onChange(event) {
              setInputValue(event.target.value);
              setActiveIndex(null);
              setOpen(true);
            },
            onFocus() {
              setOpen(true);
            },
            onKeyDown: handleKeyDown,
          })}
        />
        <span className={styles.chevron} aria-hidden="true">
          <Icon as={ChevronDown} size="sm" />
        </span>
      </div>
      {open && !disabled && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={styles.listbox}
            {...getFloatingProps()}
          >
            {filteredOptions.length === 0 ? (
              // A `role="listbox"` must contain `option`/`group` children per
              // ARIA (axe: aria-required-children) — this is a non-interactive
              // `option` rather than a plain div, kept out of listRef/navigation.
              <div role="option" aria-disabled="true" aria-selected="false" className={styles.noOptions}>
                {noOptionsMessage}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  ref={(node) => {
                    listRef.current[index] = option.disabled ? null : node;
                  }}
                  className={[
                    styles.option,
                    index === activeIndex ? styles.active : '',
                    option.disabled ? styles.disabled : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-disabled={option.disabled || undefined}
                  {...getItemProps({
                    active: index === activeIndex,
                    selected: option.value === selectedValue,
                    onClick: () => commitSelection(option),
                  })}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </FloatingPortal>
      )}
      {error && errorMessage && (
        <span id={`${inputId}-error`} role="alert" className={styles.errorMessage}>
          {errorMessage}
        </span>
      )}
    </div>
  );
}
