<p align="center">
  <img src="brand/wordmark.svg" alt="PulseUI" width="280" />
</p>

# pulse-components

An open-source React component library built with TypeScript and CSS Modules.
Designed to be used as-is, forked, or extended to match your own design system.

## Features

- **React 19** + **TypeScript**
- **25 components** — primitives, form controls, display, overlays, feedback and navigation
- **CSS Modules** — scoped styles with zero class-name collisions
- **Design tokens** — CSS custom properties (`--pulse-*`) for colors, typography and spacing
- **Accessible by default** — every interactive component follows the relevant ARIA pattern (dialog, menu, tabs, accordion...); Storybook's a11y addon fails the build on any violation. See the [Accessibility guide](https://eloriente.github.io/pulse-components/?path=/docs/guide-accessibility--docs) for the full breakdown
- **Tailwind compatible** — every component accepts a `className` prop for utility overrides
- **Storybook 10** — interactive component explorer with a11y checks and interaction tests
- **Vitest + Playwright** — story-based tests run in a real browser
- **MCP server included** — query component props, variants and examples directly from an AI coding assistant (see [MCP server](#mcp-server))

## Getting started

### Installation

```bash
npm install pulse-components
```

### Basic usage

```tsx
import { Button } from 'pulse-components';
// Include the base styles once in your app entry point
import 'pulse-components/styles';

export default function App() {
  return <Button primary label="Hello world" />;
}
```

### Design tokens

Import the tokens CSS to get access to all `--pulse-*` custom properties in your own styles:

```css
@import 'pulse-components/tokens';
```

You can override any token in your root styles:

```css
:root {
  --pulse-color-primary: #e63946;
  --pulse-font-family-base: 'Inter', sans-serif;
}
```

### Tailwind CSS compatibility

All components accept a `className` prop. Pass Tailwind utility classes to extend or override the default styles:

```tsx
import { Button } from 'pulse-components';
import 'pulse-components/styles';

// Tailwind classes are merged with the component's base styles
<Button label="Custom" className="shadow-lg tracking-wide" />
```

> The component ships its own base styles via CSS Modules. Tailwind utilities added through `className` are applied on top, so standard Tailwind specificity rules apply. If you need a utility to override a component style, use the `!` modifier (e.g. `!bg-red-500`).

## Components

Full props, variants and live examples for every component are in Storybook — browse the [live preview](https://eloriente.github.io/pulse-components/) or run `npm run storybook` locally.

| Category | Components |
| --- | --- |
| Primitives | Icon, Button, Heading, Text |
| Form | Label, Input, Textarea, Checkbox, Radio, Select, Switch |
| Display | Badge, Avatar, Spinner, Divider |
| Overlay | Tooltip, Popover, DropdownMenu, Modal |
| Feedback | Toast (+ `ToastProvider`/`useToast`), Alert |
| Navigation | Tabs, Accordion, Breadcrumb, Pagination |

Overlay components (Tooltip, Popover, DropdownMenu, Modal) are built on [Floating UI](https://floating-ui.com/) for positioning, focus management and dismiss behavior. None of this library's components use `forwardRef`; these wrap their trigger in a `<span>` instead of cloning it, so they work with any trigger element, including this library's own components.

```tsx
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Tooltip, Button, Modal } from 'pulse-components';
import 'pulse-components/styles';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip content="Delete this item">
        <Button iconOnly={Trash2} aria-label="Delete" onClick={() => setOpen(true)} />
      </Tooltip>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete item?">
        <p>This can't be undone.</p>
      </Modal>
    </>
  );
}
```

## MCP server

The package ships a read-only [Model Context Protocol](https://modelcontextprotocol.io) server so an AI coding assistant can look up component props, variants, sizes and usage examples instead of guessing. It only works when `pulse-components` is installed as a project dependency — it isn't published as a separate package.

```json
{
  "mcpServers": {
    "pulse-components": {
      "command": "npx",
      "args": ["pulse-components-mcp"]
    }
  }
}
```

It exposes two read-only tools, `list_components` and `get_component(name)`. It doesn't recommend which component to use for a given task — that decision stays with the developer. See [CLAUDE.md](./CLAUDE.md) for how its data is generated and kept in sync.

## Development

### Prerequisites

- Node.js >= 22.12
- npm >= 9

### Running Storybook

```bash
npm run storybook
```

Opens Storybook at [http://localhost:6006](http://localhost:6006).

### Running tests

```bash
npm test
```

Runs both Vitest projects: unit tests (jsdom) and story-based interaction/a11y tests (Playwright, headless Chromium). Run them separately with `npm run test:unit` / `npm run test:storybook`, or `npm run coverage` for a coverage report (80% minimum on `src/components/**`).

### Building the library

```bash
npm run build
```

Outputs to `dist/`. Generates ESM (`index.js`), CJS (`index.cjs`), TypeScript declarations and a bundled `style.css`.

### Building Storybook

```bash
npm run build:storybook
```

Generates a static Storybook site in `storybook-static/`.

### Type checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

Uses [ESLint](https://eslint.org/) (flat config, `typescript-eslint` recommended rules).

## Project structure

```
pulse-components/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx           # Component source + props + JSDoc
│   │   │   ├── Button.module.css    # Scoped styles (CSS Modules)
│   │   │   ├── Button.stories.tsx   # Storybook stories (CSF3) + interaction tests
│   │   │   ├── Button.test.tsx      # Vitest + Testing Library unit tests
│   │   │   └── index.ts             # Barrel export
│   │   ├── Toast/                   # Multi-file example: component + ToastProvider + useToast
│   │   ├── ...                      # One folder per component, same structure
│   │   └── index.ts                 # All components re-exported, grouped by category
│   ├── tokens/
│   │   ├── colors.css               # --pulse-color-* variables
│   │   ├── typography.css           # --pulse-font-* variables
│   │   ├── spacing.css              # --pulse-space-* and --pulse-radius-* variables
│   │   └── index.css                # Imports all token files
│   ├── mcp/                         # MCP server (server.ts, generated components-data.json)
│   └── index.ts                     # Package entry point — mirrors src/components/index.ts
├── .storybook/
│   ├── main.ts
│   └── preview.tsx                  # Imports tokens globally for Storybook
└── vite.config.ts                   # Vite + Vitest configuration
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT](./LICENSE)
