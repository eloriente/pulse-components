# pulse-components

An open-source React component library built with TypeScript and CSS Modules.  
Designed to be used as-is, forked, or extended to match your own design system.

## Features

- **React 19** + **TypeScript**
- **CSS Modules** — scoped styles with zero class-name collisions
- **Design tokens** — CSS custom properties (`--pulse-*`) for colors, typography and spacing
- **Tailwind compatible** — every component accepts a `className` prop for utility overrides
- **Storybook 10** — interactive component explorer with a11y checks and interaction tests
- **Vitest + Playwright** — story-based tests run in a real browser

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

## Development

### Prerequisites

- Node.js >= 18
- npm >= 9

### Running Storybook

```bash
npm run dev
```

Opens Storybook at [http://localhost:6006](http://localhost:6006).

### Running tests

```bash
npm test
```

Runs all story-based interaction and a11y tests via Vitest + Playwright (headless Chromium).

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

Uses [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) for fast linting.

## Project structure

```
pulse-components/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx           # Component source
│   │   │   ├── Button.module.css    # Scoped styles (CSS Modules)
│   │   │   ├── Button.stories.ts    # Storybook stories + tests
│   │   │   └── index.ts             # Barrel export
│   │   ├── Header/
│   │   ├── Page/
│   │   └── index.ts                 # All components re-exported
│   ├── tokens/
│   │   ├── colors.css               # --pulse-color-* variables
│   │   ├── typography.css           # --pulse-font-* variables
│   │   ├── spacing.css              # --pulse-space-* and --pulse-radius-* variables
│   │   └── index.css                # Imports all token files
│   └── index.ts                     # Package entry point
├── .storybook/
│   ├── main.ts
│   └── preview.tsx                  # Imports tokens globally for Storybook
└── vite.config.ts                   # Vite + Vitest configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-component`
3. Add your component under `src/components/MyComponent/`
4. Write stories in `MyComponent.stories.ts`
5. Export it from `src/components/index.ts` and `src/index.ts`
6. Open a pull request

### Adding a new component — checklist

- [ ] `ComponentName.tsx` — component with TypeScript props and `className` prop
- [ ] `ComponentName.module.css` — styles using `--pulse-*` tokens
- [ ] `ComponentName.stories.ts` — at least one story per variant, `title: 'Components/...'`
- [ ] `index.ts` — barrel export for the component and its types

## License

MIT
