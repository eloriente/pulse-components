import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import type { ChevronProps, Matcher } from 'react-day-picker';
import { Popover } from '../Popover';
import { Input } from '../Input';
import { Icon } from '../Icon';
import styles from './DatePicker.module.css';

export interface DatePickerProps {
  /** Controlled selected date */
  value?: Date;
  /** Uncontrolled initial selected date */
  defaultValue?: Date;
  /** Called with the newly selected date, or `undefined` if the user clears the native picker state */
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  /** Formats the date shown in the input. Defaults to `date.toLocaleDateString()` */
  formatDate?: (date: Date) => string;
  /** Earliest selectable date (inclusive) */
  minDate?: Date;
  /** Latest selectable date (inclusive) */
  maxDate?: Date;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  id?: string;
  /** Accessible name for the input — required when there's no associated visible `<label htmlFor>` */
  'aria-label'?: string;
  className?: string;
}

function Chevron({ orientation }: ChevronProps) {
  return <Icon as={orientation === 'left' ? ChevronLeft : ChevronRight} size="sm" />;
}

const CLASS_NAMES = {
  root: styles.calendar,
  months: styles.months,
  month: styles.month,
  month_caption: styles.monthCaption,
  caption_label: styles.captionLabel,
  button_previous: styles.navButton,
  button_next: styles.navButton,
  month_grid: styles.monthGrid,
  weekdays: styles.weekdays,
  weekday: styles.weekday,
  weeks: styles.weeks,
  week: styles.week,
  day: styles.day,
  day_button: styles.dayButton,
  selected: styles.selected,
  today: styles.today,
  outside: styles.outside,
  disabled: styles.dayDisabled,
  hidden: styles.hidden,
};

/**
 * Date field that opens a calendar panel on click. The calendar grid itself
 * is {@link https://daypicker.dev react-day-picker} (ARIA grid pattern,
 * keyboard navigation, and date math are genuinely hard to get right — see
 * the roadmap notes for why this one wraps a library instead of being built
 * from scratch like the rest of this package); everything around it — the
 * trigger field, the popover positioning, the visual style via `classNames`
 * — is this library's own, so it looks and composes like every other
 * component here. Single-date selection only; wrap `react-day-picker`
 * directly if you need multi-date or range selection.
 *
 * @example
 * ```tsx
 * <DatePicker aria-label="Due date" value={dueDate} onChange={setDueDate} />
 * ```
 */
export function DatePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = 'Select a date',
  formatDate = (date) => date.toLocaleDateString(),
  minDate,
  maxDate,
  disabled = false,
  error = false,
  errorMessage,
  id,
  'aria-label': ariaLabel,
  className,
}: DatePickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : uncontrolledValue;

  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (!isControlled) setUncontrolledValue(date);
    onChange?.(date);
    setOpen(false);
  };

  const disabledMatcher: Matcher | Matcher[] | undefined =
    minDate && maxDate
      ? [{ before: minDate }, { after: maxDate }]
      : (minDate && { before: minDate }) || (maxDate && { after: maxDate }) || undefined;

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        disabled={disabled}
        aria-label="Choose a date"
        content={
          <DayPicker
            mode="single"
            navLayout="around"
            selected={value}
            defaultMonth={value}
            onSelect={handleSelect}
            disabled={disabledMatcher}
            classNames={CLASS_NAMES}
            components={{ Chevron }}
          />
        }
      >
        <Input
          id={inputId}
          readOnly
          value={value ? formatDate(value) : ''}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          iconRight={CalendarIcon}
          aria-label={ariaLabel}
          onKeyDown={handleInputKeyDown}
          className={styles.input}
        />
      </Popover>
      {error && errorMessage && (
        <span role="alert" className={styles.errorMessage}>
          {errorMessage}
        </span>
      )}
    </div>
  );
}
