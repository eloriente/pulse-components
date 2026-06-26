import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import {
  Search,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  Star,
  Heart,
  User,
  Settings,
  Loader2,
} from 'lucide-react';
import { Icon } from './Icon';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: { control: 'color' },
    strokeWidth: { control: { type: 'number', min: 0.5, max: 4, step: 0.5 } },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    as: Search,
    size: 'md',
    label: 'Search',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = canvas.getByRole('img', { name: 'Search' });
    await expect(icon).toBeInTheDocument();
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Icon as={Star} size="xs" label="Star xs" />
      <Icon as={Star} size="sm" label="Star sm" />
      <Icon as={Star} size="md" label="Star md" />
      <Icon as={Star} size="lg" label="Star lg" />
      <Icon as={Star} size="xl" label="Star xl" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Star xs' })).toBeInTheDocument();
    await expect(canvas.getByRole('img', { name: 'Star xl' })).toBeInTheDocument();
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Icon as={Heart} size="lg" color="var(--pulse-color-primary, #555ab9)" label="Primary" />
      <Icon as={Heart} size="lg" color="var(--pulse-color-error, #e53e3e)" label="Error" />
      <Icon as={Heart} size="lg" color="var(--pulse-color-success, #38a169)" label="Success" />
      <Icon as={Heart} size="lg" color="var(--pulse-color-warning, #d69e2e)" label="Warning" />
    </div>
  ),
};

export const CommonIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Icon as={Search} size="md" label="Search" />
      <Icon as={X} size="md" label="Close" />
      <Icon as={Check} size="md" label="Check" />
      <Icon as={ChevronDown} size="md" label="Chevron down" />
      <Icon as={ChevronRight} size="md" label="Chevron right" />
      <Icon as={Eye} size="md" label="Show" />
      <Icon as={EyeOff} size="md" label="Hide" />
      <Icon as={AlertCircle} size="md" label="Alert" />
      <Icon as={Info} size="md" label="Info" />
      <Icon as={User} size="md" label="User" />
      <Icon as={Settings} size="md" label="Settings" />
      <Icon as={Loader2} size="md" label="Loading" />
    </div>
  ),
};

export const CustomSvg: Story = {
  render: () => (
    <Icon size="lg" label="Custom lightning bolt">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    </Icon>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const wrapper = canvas.getByRole('img', { name: 'Custom lightning bolt' });
    await expect(wrapper).toBeInTheDocument();
  },
};

export const HiddenFromScreenReaders: Story = {
  render: () => (
    <button style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Icon as={Search} size="sm" />
      <span>Search</span>
    </button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Icon without label should be hidden from screen readers (aria-hidden)
    const btn = canvas.getByRole('button', { name: 'Search' });
    await expect(btn).toBeInTheDocument();
  },
};
