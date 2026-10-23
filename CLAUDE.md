# CLAUDE.md

PulseUI for React (npm package `@pulseui/react`) — React 19 + TypeScript + CSS Modules, documented with Storybook and tested with Vitest + Testing Library.

## Stack and architecture

- **Build**: Vite 8 in library mode. Entry `src/index.ts` → `dist/index.js` (ESM) and `dist/index.cjs` (CJS) + `dist/index.d.ts`. CSS is emitted unified into `dist/style.css`. `react`, `react-dom`, `react/jsx-runtime` and `lucide-react` are externalized (peer deps).
- **package.json exports**: `.` (components), `./tokens` (`dist/tokens/index.css`), `./styles` (`dist/style.css`).
- **TypeScript**: `tsconfig.json` is solution-style, references `tsconfig.app.json` and `tsconfig.node.json`.
- **Lint**: ESLint 10 flat config (`eslint.config.ts`) with `typescript-eslint` recommended + `js/recommended`.
- **`src/` structure**:
  - `components/` — one folder per component.
  - `tokens/` — design tokens in CSS (`colors.css`, `spacing.css`, `typography.css`, `index.css`), consumed as `--pulse-*` variables in each component's `.module.css`.
  - `docs/`, `Welcome.mdx` — Storybook documentation.
  - `test-setup.ts` — global Vitest/RTL setup.
- **CI** (`.github/workflows/quality-checks.yml`, on every push/PR): `lint` → `typecheck` (`tsc -b`, builds every project referenced by `tsconfig.json`) → `mcp-data` (`check:mcp-data`) → `build` (`npm run build`, catches build-only errors) → `test-unit` (Vitest) → `test-storybook` (Playwright/Chromium) → `coverage` (80% minimum, uploads artifact). All jobs run in parallel except `coverage`, which depends on `test-unit`+`test-storybook`.
- `src/index.ts` re-exports every component from `src/components/index.ts` (same categories: Primitives / Form / Display / Overlay / Feedback / Navigation). If a new component is added to `src/components/index.ts`, replicate it in `src/index.ts` too so it reaches the public entry point.

## Components (`src/components/`)

Current components (25): `Icon, Button, Heading, Text, Label, Input, Textarea, Checkbox, Radio, Select, Switch, Badge, Avatar, Spinner, Divider, Tooltip, Popover, DropdownMenu, Modal, Toast, Alert, Tabs, Accordion, Breadcrumb, Pagination`.

Every folder always follows the same structure:

```
ComponentName/
  ComponentName.tsx          # component + props interface + JSDoc
  ComponentName.module.css   # CSS Modules styles
  ComponentName.stories.tsx  # Storybook stories (CSF3)
  ComponentName.test.tsx     # tests (Vitest + RTL)
  index.ts                   # barrel: re-exports component and types
```

Code conventions:

- **Props**: `interface XProps`, often extending native HTML attributes with `Omit<...HTMLAttributes<...>, 'type' | 'size'>`. Variants/sizes as separately exported union types (`export type InputVariant = 'outline' | 'filled' | 'underline'`).
- **Components**: function declarations (`export function Button(...)`), never `forwardRef` or `React.FC`. Destructured props with inline defaults.
- **Styles**: CSS Modules; classes composed manually (`[styles.button, styles[size], ...].filter(Boolean).join(' ')`). No `clsx`/`cva`.
- **Naming**: components and types in PascalCase, props/variables in camelCase, CSS classes in camelCase.
- **Accessibility**: always considered (`aria-invalid`, `aria-describedby`, `aria-busy`, `role="alert"` on error messages).
- **Shared code**: no `utils/`/`hooks/` folder; the only cross-cutting piece is the `Icon` component (wrapper around `lucide-react`) used by Button/Input/Select, and the global CSS tokens.
- **Exports**: each `index.ts` re-exports component + types; `src/components/index.ts` groups everything under commented categories (Primitives / Form / Display / Overlay / Feedback / Navigation).

## Storybook

- Config in `.storybook/main.ts` (framework `@storybook/react-vite`, stories in `src/**/*.stories.tsx` and `**/*.mdx`) and `.storybook/preview.tsx` (imports tokens globally, `a11y.test: 'error'` — accessibility violations break the build).
- Addons: `@chromatic-com/storybook`, `@storybook/addon-vitest`, `@storybook/addon-a11y`, `@storybook/addon-docs`.
- **CSF3** format: `meta` with `satisfies Meta<typeof Component>`, `title: 'Components/<Category>/X'` (the category is one of Primitives / Form / Display / Overlay / Feedback / Navigation, same as in `src/components/index.ts` — groups the Storybook sidebar), `tags: ['autodocs']`, `argTypes` typed per control; stories as `StoryObj` named semantically (`Primary`, `Disabled`, `Loading`, `WithIconLeft`, not just `Default`).
- Interaction tests live in `play` functions inside the stories (`within`, `userEvent`, `expect` from `storybook/test`) and run as part of the `storybook` Vitest project (Playwright/Chromium).

## Tests

- Stack: Vitest (2 projects defined in `vite.config.ts`: `unit` with jsdom, `storybook` with Playwright/Chromium) + React Testing Library + `@testing-library/user-event` + `jest-dom`.
- Scripts: `test` (all), `test:unit`, `test:storybook`, `coverage` (v8, 80% threshold on lines/functions/branches/statements over `src/components/**`).
- Global setup in `src/test-setup.ts` (jest-dom matchers + `cleanup()` after each test).
- Usual pattern in `*.test.tsx`: `describe` grouped by aspect (Rendering, Variants, Sizes, Disabled/Loading, Interactions, Styling), `render` + `screen.getByRole`, `userEvent` for interaction, `it.each` for parameterized variants, assertions on className/`aria-*`/`toBeDisabled`. No snapshot testing.

## General code style

- Strict TypeScript with explicit interfaces for props; variant types as union types exported alongside the component.
- No class-utility libraries (no `clsx`/`cva`/`tailwind-merge`); manual class composition with CSS Modules.
- JSDoc above props and the component (including an `@example` block) instead of inline comments.
- Consistent naming convention: PascalCase for components/types, camelCase for props/variables/CSS classes.

## MCP server (component lookup)

The package includes a read-only MCP server (`bin: pulseui-react-mcp`), embedded in the same `package.json` — it's only invokable if `@pulseui/react` is installed as a dependency; it doesn't exist as a separate package.

- **Versioned metadata**: `src/mcp/components-data.json` is generated with `npm run generate:mcp-data` (`scripts/generate-mcp-data.ts`, uses `ts-morph` to parse props/JSDoc/variants/sizes from each `*.tsx` and examples from each `*.stories.tsx`). **Never edited by hand.**
- After creating or modifying a component, regenerate the JSON with `npm run generate:mcp-data` (or the `/update-mcp-data` skill) before committing.
- The `mcp-data` job in `.github/workflows/quality-checks.yml` fails the PR if the versioned JSON doesn't match what the current code would generate (`npm run check:mcp-data`).
- The server (`src/mcp/server.ts`, Node-only build via `tsconfig.mcp.json` → `dist/mcp/`) exposes two read-only tools: `list_components` and `get_component(name)`. It doesn't recommend which component to use — that decision is the developer's.
- Test locally: `npm run build && npx @modelcontextprotocol/inspector node dist/mcp/server.js`.
