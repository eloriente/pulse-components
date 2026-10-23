/**
 * @pulseui/react
 *
 * A React component library built with TypeScript and CSS Modules.
 * Compatible with Tailwind CSS via the `className` prop on every component.
 */

// Bundle the design tokens into dist/style.css so components render with `@pulseui/react/styles` alone
import './tokens/index.css';

// ─── Primitives ───────────────────────────────────────────────────────────────

export { Icon } from './components/Icon';
export type { IconProps, IconSize } from './components/Icon';

export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant } from './components/Button';

export { Heading, Text } from './components/Text';
export type {
  HeadingProps, HeadingLevel, HeadingSize,
  TextProps, TextVariant, TextSize, TextWeight, TextAlign, TextColor,
} from './components/Text';

// ─── Form ────────────────────────────────────────────────────────────────────

export { Label } from './components/Label';
export type { LabelProps } from './components/Label';

export { Input } from './components/Input';
export type { InputProps, InputVariant, InputSize } from './components/Input';

export { Textarea } from './components/Textarea';
export type { TextareaProps, TextareaVariant, TextareaSize, TextareaResize } from './components/Textarea';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { Radio } from './components/Radio';
export type { RadioProps } from './components/Radio';

export { Select } from './components/Select';
export type { SelectProps, SelectSize, SelectVariant } from './components/Select';

export { Switch } from './components/Switch';
export type { SwitchProps, SwitchSize } from './components/Switch';

export { FieldGroup } from './components/FieldGroup';
export type { FieldGroupProps, FieldControlProps } from './components/FieldGroup';

export { Combobox } from './components/Combobox';
export type { ComboboxProps, ComboboxOption } from './components/Combobox';

export { Slider } from './components/Slider';
export type { SliderProps, SliderSize } from './components/Slider';

export { TagInput } from './components/TagInput';
export type { TagInputProps } from './components/TagInput';

export { ToggleGroup } from './components/ToggleGroup';
export type {
  ToggleGroupProps,
  ToggleGroupItem,
  ToggleGroupType,
  ToggleGroupOrientation,
  ToggleGroupSize,
} from './components/ToggleGroup';

export { DatePicker } from './components/DatePicker';
export type { DatePickerProps } from './components/DatePicker';

// ─── Display ─────────────────────────────────────────────────────────────────

export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant, BadgeColor, BadgeSize } from './components/Badge';

export { Avatar } from './components/Avatar';
export type { AvatarProps, AvatarSize, AvatarShape } from './components/Avatar';

export { Spinner } from './components/Spinner';
export type { SpinnerProps, SpinnerSize, SpinnerVariant } from './components/Spinner';

export { Divider } from './components/Divider';
export type { DividerProps, DividerOrientation, DividerVariant } from './components/Divider';

// ─── Layout ──────────────────────────────────────────────────────────────────

export { Card } from './components/Card';
export type { CardProps, CardVariant, CardPadding } from './components/Card';

export { Drawer } from './components/Drawer';
export type { DrawerProps, DrawerPlacement, DrawerSize } from './components/Drawer';

export { Skeleton } from './components/Skeleton';
export type { SkeletonProps, SkeletonVariant, SkeletonAnimation } from './components/Skeleton';

export { Table } from './components/Table';
export type { TableProps, TableColumn, TableColumnAlign, SortDirection } from './components/Table';

// ─── Overlay ─────────────────────────────────────────────────────────────────

export { Tooltip } from './components/Tooltip';
export type { TooltipProps, TooltipPlacement } from './components/Tooltip';

export { Popover } from './components/Popover';
export type { PopoverProps, PopoverPlacement } from './components/Popover';

export { DropdownMenu } from './components/DropdownMenu';
export type {
  DropdownMenuProps,
  DropdownMenuPlacement,
  DropdownMenuEntry,
  DropdownMenuAction,
  DropdownMenuSeparator,
} from './components/DropdownMenu';

export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';

// ─── Feedback ────────────────────────────────────────────────────────────────

export { Toast, ToastProvider, useToast } from './components/Toast';
export type {
  ToastProps,
  ToastOptions,
  ToastVariant,
  ToastProviderProps,
  ToastPosition,
  ToastContextValue,
} from './components/Toast';

export { Alert } from './components/Alert';
export type { AlertProps, AlertVariant } from './components/Alert';

// ─── Navigation ──────────────────────────────────────────────────────────────

export { Tabs } from './components/Tabs';
export type { TabsProps, TabsOrientation, TabItem } from './components/Tabs';

export { Accordion } from './components/Accordion';
export type { AccordionProps, AccordionType, AccordionItem } from './components/Accordion';

export { Breadcrumb } from './components/Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './components/Breadcrumb';

export { Pagination } from './components/Pagination';
export type { PaginationProps } from './components/Pagination';
