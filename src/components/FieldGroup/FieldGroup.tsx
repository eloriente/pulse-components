import { useId, cloneElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Label } from '../Label';
import styles from './FieldGroup.module.css';

export interface FieldControlProps {
  id?: string;
  required?: boolean;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-describedby'?: string;
}

export interface FieldGroupProps {
  /** Label content for the field */
  label: ReactNode;
  /** Marks the field as required: shows the visual indicator on the label and sets `required` on the control unless it already declares its own */
  required?: boolean;
  /** Helper text shown below the control. Replaced by `errorMessage` when both are given */
  helperText?: ReactNode;
  /** Error message shown below the control; also sets `aria-invalid`/`aria-describedby` on it */
  errorMessage?: ReactNode;
  /**
   * The form control — a single element (`Input`, `Textarea`, `Select`…). Receives a generated
   * `id`, `aria-invalid` and `aria-describedby` via `cloneElement` (this repo never uses
   * `forwardRef`, so prop injection — not ref forwarding — is how the id/aria wiring reaches the
   * control). Don't also pass the control's own `error`/`errorMessage` props (on `Input`/`Select`)
   * — that would render a second, duplicate message. Not meant for `Checkbox`/`Radio`/`Switch`:
   * those already render their own `<label>` wrapper via their `label` prop, and pairing them with
   * FieldGroup's external `Label` would point two `<label>` elements at the same control.
   */
  children: ReactElement<FieldControlProps>;
  /** Explicit id for the control. Auto-generated via `useId` when omitted */
  id?: string;
  /** Additional class applied to the wrapper */
  className?: string;
}

/**
 * Groups a `Label`, a form control, and its helper/error message, wiring up
 * the id and ARIA attributes (`aria-invalid`, `aria-describedby`) between them
 * so every form field doesn't have to repeat that plumbing by hand.
 *
 * @example
 * ```tsx
 * <FieldGroup label="Email" required errorMessage={errors.email}>
 *   <Input type="email" value={email} onChange={handleChange} />
 * </FieldGroup>
 * ```
 */
export function FieldGroup({
  label,
  required = false,
  helperText,
  errorMessage,
  children,
  id,
  className,
}: FieldGroupProps) {
  const generatedId = useId();
  const controlId = children.props.id ?? id ?? generatedId;
  const hasError = Boolean(errorMessage);
  const hasDescription = Boolean(errorMessage || helperText);
  const descriptionId = hasDescription ? `${controlId}-description` : undefined;

  const describedBy = [children.props['aria-describedby'], descriptionId]
    .filter(Boolean)
    .join(' ');

  const control = cloneElement(children, {
    id: controlId,
    required: children.props.required ?? required,
    'aria-invalid': hasError ? true : children.props['aria-invalid'],
    'aria-describedby': describedBy || undefined,
  });

  return (
    <div className={[styles.fieldGroup, className].filter(Boolean).join(' ')}>
      <Label htmlFor={controlId} required={required}>
        {label}
      </Label>
      {control}
      {hasDescription && (
        <span
          id={descriptionId}
          className={hasError ? styles.errorMessage : styles.helperText}
          role={hasError ? 'alert' : undefined}
        >
          {errorMessage ?? helperText}
        </span>
      )}
    </div>
  );
}
