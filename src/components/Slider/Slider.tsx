import { useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';
import styles from './Slider.module.css';

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value' | 'defaultValue' | 'onChange'> {
  /** Controlled value */
  value?: number;
  /** Uncontrolled initial value. Default `min` */
  defaultValue?: number;
  /** Called with the new numeric value as the thumb moves */
  onChange?: (value: number) => void;
  /** Default `0` */
  min?: number;
  /** Default `100` */
  max?: number;
  /** Default `1` */
  step?: number;
  size?: SliderSize;
  /** Shows the current numeric value next to the track. Default `false` */
  showValue?: boolean;
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Single-value range slider built on the native `<input type="range">` —
 * keyboard support (arrow keys, Home/End, Page Up/Down) and the `slider` ARIA
 * role/`aria-valuenow` come for free from the browser. Has no label of its
 * own, same as {@link Input}/{@link Select}: pair it with an external
 * {@link Label} or {@link FieldGroup}, or pass `aria-label` directly.
 *
 * @example
 * ```tsx
 * <Slider aria-label="Volume" value={volume} onChange={setVolume} showValue />
 * ```
 */
export function Slider({
  value: controlledValue,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  size = 'md',
  showValue = false,
  disabled = false,
  className,
  id,
  ...props
}: SliderProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? min);
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (!isControlled) setUncontrolledValue(next);
    onChange?.(next);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        className={[styles.slider, styles[size]].filter(Boolean).join(' ')}
        style={{
          background: `linear-gradient(to right, var(--pulse-color-primary, #555ab9) ${percentage}%, var(--pulse-color-border, rgba(0, 0, 0, 0.1)) ${percentage}%)`,
        }}
        {...props}
      />
      {showValue && <span className={styles.value}>{value}</span>}
    </div>
  );
}
