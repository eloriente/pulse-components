import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import styles from './TagInput.module.css';

export interface TagInputProps {
  /** Controlled list of tags */
  value?: string[];
  /** Uncontrolled initial list of tags. Default `[]` */
  defaultValue?: string[];
  /** Called with the full list of tags after an add or remove */
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  /** Stops accepting new tags once this many are present */
  maxTags?: number;
  /** Keys (in addition to Enter) that commit the current text as a tag. Default `[',']` */
  delimiters?: string[];
  /** Rejects a tag that already exists, case-insensitively. Default `true` */
  preventDuplicates?: boolean;
  id?: string;
  /** Accessible name for the text input — required when there's no associated visible `<label htmlFor>` */
  'aria-label'?: string;
  className?: string;
}

/**
 * Multi-value input: type text and press Enter (or a delimiter key, comma by
 * default) to add it as a removable tag; Backspace on an empty input removes
 * the last tag. Each tag renders as a {@link Badge} with its own remove
 * button, so there's no new chip styling to maintain — just a close button
 * appended to Badge's existing layout.
 *
 * @example
 * ```tsx
 * <TagInput aria-label="Skills" value={skills} onChange={setSkills} />
 * ```
 */
export function TagInput({
  value: controlledValue,
  defaultValue = [],
  onChange,
  placeholder,
  disabled = false,
  error = false,
  errorMessage,
  maxTags,
  delimiters = [','],
  preventDuplicates = true,
  id,
  'aria-label': ariaLabel,
  className,
}: TagInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const isControlled = controlledValue !== undefined;
  const [uncontrolledTags, setUncontrolledTags] = useState(defaultValue);
  const tags = isControlled ? controlledValue : uncontrolledTags;

  const [inputValue, setInputValue] = useState('');

  const canAddMore = maxTags === undefined || tags.length < maxTags;

  const commitTag = (rawTag: string) => {
    const tag = rawTag.trim();
    if (!tag || !canAddMore) return;
    if (preventDuplicates && tags.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      return;
    }

    const next = [...tags, tag];
    if (!isControlled) setUncontrolledTags(next);
    onChange?.(next);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    const next = tags.filter((_, i) => i !== index);
    if (!isControlled) setUncontrolledTags(next);
    onChange?.(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || delimiters.includes(event.key)) {
      event.preventDefault();
      commitTag(inputValue);
      return;
    }
    if (event.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <div className={[styles.field, error ? styles.error : '', disabled ? styles.disabled : '']
        .filter(Boolean)
        .join(' ')}
      >
        {tags.map((tag, index) => (
          <Badge key={`${tag}-${index}`} variant="subtle">
            {tag}
            {!disabled && (
              <button
                type="button"
                className={styles.removeButton}
                aria-label={`Remove ${tag}`}
                onClick={() => removeTag(index)}
              >
                <Icon as={X} size="xs" />
              </button>
            )}
          </Badge>
        ))}
        <input
          id={inputId}
          type="text"
          className={styles.input}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : undefined}
          disabled={disabled || !canAddMore}
          aria-label={ariaLabel}
          aria-invalid={error || undefined}
          aria-describedby={error && errorMessage ? `${inputId}-error` : undefined}
        />
      </div>
      {error && errorMessage && (
        <span id={`${inputId}-error`} role="alert" className={styles.errorMessage}>
          {errorMessage}
        </span>
      )}
    </div>
  );
}
