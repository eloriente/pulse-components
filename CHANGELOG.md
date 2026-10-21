# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-10-22

### Changed

- Renamed the package from `pulse-components` to **`@pulseui/react`**
  (scoped, to make room for future framework packages like `@pulseui/vue`),
  and the GitHub repository from `pulse-components` to `pulseui-react`.
  **Breaking** for anyone who already depended on the old name — but
  `v1.0.2` was never published to npm, so there are no real consumers to
  break. All install/import examples across the README, Storybook docs and
  MCP config are updated accordingly. The product/brand name was already
  "PulseUI" (see `brand/`); this aligns the package and repo names with it.

## [1.0.2] - 2026-10-22

Branding, accessibility fixes, and a live Storybook preview on GitHub Pages.

### Removed

- `Header` and `Page` — the legacy Storybook template demo components — are
  gone entirely (`src/components/Header/`, `src/components/Page/`). They were
  already excluded from the public package API since `1.0.1`; this removes
  them from the codebase and Storybook altogether. The public component count
  is now 25.

### Fixed

- CSS fallback values that didn't match their real design tokens — some
  failing WCAG AA contrast on their own — across `Text`, `Input`, `Textarea`,
  `Select`, `Checkbox`, `Radio`, `Label` and `Badge` (e.g.
  `var(--pulse-color-error, #e53e3e)` when the real token is `#d0312d`;
  `#9ca3af` vs the real `--pulse-color-text-subtle` of `#666666`). Every
  fallback now matches its token exactly, so a consumer who somehow doesn't
  load `pulse-components/tokens` still gets an accessible, on-brand color
  instead of an unrelated, sometimes-failing one.
- `design-tokens.mdx`: `--pulse-color-warning` was documented as `#f5a623`;
  the real value in `colors.css` is `#92400e`. Fixed in both the color
  palette and the reference table.
- `Text` now has its own Storybook page (`Text.stories.tsx`) instead of being
  folded into `Heading`'s, since both share `src/components/Text/Text.tsx`.
  Previously `Text`'s props (`variant`, `size`, `weight`, `align`, `color`,
  `truncate`) never got an autodocs props table, since the shared `meta`
  pointed `component` at `Heading`. `scripts/generate-mcp-data.ts` now
  resolves a component's example stories by the component's own name first,
  falling back to the folder name, so `Heading` and `Text` each get their
  correct examples in `components-data.json` instead of sharing one list.

### Added

- `Text.stories.tsx` expanded with an interactive `Default` story (full
  Controls support via `argTypes`) and dedicated stories for `Sizes`,
  `Weights`, `Alignment` and `InverseColor` (demoed correctly on a dark
  surface) — previously `weight`, `align` and `inverse` had no story coverage
  at all.
- Project branding: a `brand/` directory with the PulseUI mark (`logo.svg`,
  `logo-dark.svg`, `logo-mono.svg`, `wordmark.svg`, `social-preview.svg`/`.png`).
- Favicon (SVG + PNG fallbacks + apple-touch-icon) replacing the generic
  Vite template placeholder, wired into both `index.html` and Storybook
  (`staticDirs`, `.storybook/manager-head.html`).
- Storybook now uses a custom theme (`.storybook/manager.ts`) with the
  PulseUI logo and name in the sidebar, and the `Welcome.mdx` page and
  `README.md` now show the wordmark.
- `public/favicon.svg` now switches to white on dark system/browser themes via
  an embedded `prefers-color-scheme` media query, instead of staying the
  brand-purple mark (low contrast in dark tabs/sidebars).
- `.github/workflows/deploy-storybook.yml`: deploys the static Storybook build
  to GitHub Pages on every push to `main` (and manually via
  `workflow_dispatch`), for sharing a live preview ahead of an npm publish.
- `src/docs/accessibility.mdx`: documents the WCAG 2.1 AA target, how it's
  enforced (axe-core via `addon-a11y`, checked in CI), how to check any
  component's accessibility live in Storybook, the ARIA pattern used per
  component, and known trade-offs. Linked from `Welcome.mdx` and `README.md`.

### Changed

- Every component's Storybook `title` is now prefixed with its category
  (`Components/<Category>/Name`, matching the grouping already used in
  `src/components/index.ts` — Primitives / Form / Display / Overlay /
  Feedback / Navigation / Legacy), so the sidebar is organized instead of one
  flat list of 27 components.

### Fixed

- Several stale references in `src/Welcome.mdx` and `src/docs/*.mdx`: broken
  "Where to go next" links (missing their Storybook category prefix),
  mentions of `Button`'s removed `primary`/`backgroundColor` props and of the
  no-longer-public `Header`/`Page` components, a nonexistent `npm run dev`
  script, "Oxlint" instead of ESLint, and the missing `--pulse-color-text-muted`/
  `-surface`/`-surface-subtle` tokens in the Design Tokens reference.

## [1.0.1] - 2026-10-21

Fixes and hardening from a post-1.0.0 QA pass. `v1.0.0` was never published
to npm, so none of this is a breaking release for real consumers despite
touching `Button`'s public API.

### Removed

- `Header` and `Page` are no longer exported from the public entry point
  (`src/index.ts`). They were Storybook template example components with no
  tests of their own, never intended as part of the design system; they
  remain in `src/components/index.ts` for Storybook but are no longer part of
  the published package's API. **Breaking** for anyone importing them from
  `pulse-components`.
- `Button`: the `backgroundColor` prop was removed — it let consumers bypass
  the design system with an arbitrary inline style. **Breaking.**

### Changed (breaking)

- `Button`: replaced the `primary?: boolean` prop with `variant?: 'primary' |
  'secondary'` (default `'secondary'`, same as before), matching the
  `variant` pattern every other component in this library already uses.
  **Breaking**: replace `primary` with `variant="primary"`, and omit `primary`
  (or `primary={false}`) with nothing (secondary is the default).

### Added

- `DropdownMenu` now supports controlled (`open`/`onOpenChange`) and
  uncontrolled (`defaultOpen`) modes, matching `Popover`'s API.
- `--pulse-color-surface`, `--pulse-color-surface-subtle` and
  `--pulse-color-text-muted` design tokens, now actually defined in
  `tokens/colors.css` (several components already referenced them via
  `var(--token, #fallback)`, so they worked, but weren't real/overridable
  tokens).
- `eslint-plugin-react-hooks` (`rules-of-hooks` + `exhaustive-deps`) in
  `eslint.config.ts`.
- `build` job in CI (`npm run build`), so build-time-only failures are caught
  independently of typecheck/lint.
- `author` field in `package.json`.

### Fixed

- `Switch`: the thumb turned the same color as the track when checked (a
  duplicated/misordered CSS rule made it nearly invisible).
- `src/mcp/server.ts`: the MCP server reported a hardcoded version (`0.1.0`)
  instead of matching the package version.
- `@modelcontextprotocol/sdk` bumped to `1.32.1` (latest non-breaking patch).
- `Avatar`: a broken/404 `src` now falls back to the initials instead of
  showing forever as a broken image.
- `Divider`: the labelled variant (`label` prop set) now forwards extra props
  (`id`, `data-*`, `aria-*`, event handlers) like the other two variants
  already did.
- `Checkbox`: the indeterminate-state ref callback is now memoized, instead of
  being a new function on every render.
- `Pagination`: an out-of-range `currentPage` (e.g. stale after the result set
  shrank) is now clamped into `[1, totalPages]` instead of highlighting no
  page; rendering with `totalPages < 1` now renders nothing instead of an
  empty, inert control.
- `Badge`: the `subtle` variant's success/warning/error/info colors were
  hardcoded hex values unrelated to the design tokens; now derived from
  `--pulse-color-success`/`-warning`/`-error`/`-info` (error and info keep a
  safe literal text color instead of the token directly, since those two
  tokens are too light for text at this size/weight — same reasoning as the
  `Alert` error-contrast fix above).
- `ToastProvider`: the internal toast-id counter was module-level (`let
  idCounter`), shared across every `ToastProvider` instance; two providers
  mounted at once could hand out colliding ids. Now a per-instance `useRef`.

### Changed

- `strict: true` enabled in `tsconfig.app.json`, `tsconfig.node.json` and
  `tsconfig.mcp.json` (previously only had a few individual compiler flags).
  No code changes were needed — everything already type-checked cleanly.
- CI's `NODE_VERSION` is now pinned to `22.12.0` (previously the floating
  `22`), to stay in sync with `engines.node` in `package.json`.
- CI workflow now declares `permissions: contents: read` at the top level
  (least privilege — it only reads the repo and uploads a coverage artifact)
  and pins every third-party GitHub Action to its resolved commit SHA instead
  of a mutable `@v4` tag.

### Tests

- Added coverage for previously-untested edge cases: `DropdownMenu` typeahead
  and an empty `items` array, `Tabs` with an empty `items` array, `Accordion`
  with an empty `items` array, and `ToastProvider` with two provider
  instances mounted simultaneously (id collisions, independent dismissal).

### Security

- A critical advisory in `proxy-addr` (and moderate ones in `hono`/`ip-address`/`qs`),
  all transitive through `@modelcontextprotocol/sdk`'s optional HTTP transport,
  remains in `node_modules` — no fix is available upstream without downgrading
  Vite. Confirmed `src/mcp/server.ts` only imports the SDK's stdio transport
  and never loads the vulnerable HTTP transport code, so it isn't reachable at
  runtime in this package. Tracked for when the SDK ships a fix.

## [1.0.0] - 2026-10-21

First stable release. Every component listed below is exported from both the
package entry point (`pulse-components`) and documented in Storybook.

### Added

- Ten new components, bringing the public API to 27 components total:
  - **Overlay**: `Tooltip`, `Popover`, `DropdownMenu`, `Modal` — built on `@floating-ui/react` for positioning, focus management and dismiss behavior
  - **Feedback**: `Toast` (with `ToastProvider` / `useToast`), `Alert` (with optional auto-dismiss)
  - **Navigation**: `Tabs`, `Accordion`, `Breadcrumb`, `Pagination`
- `@floating-ui/react` as a runtime dependency.
- MCP server metadata regenerated to cover all 27 components.
- `LICENSE` file (MIT).
- `repository`, `homepage`, `bugs` and `engines` fields in `package.json`.
- `.github/dependabot.yml` for automated dependency updates.
- `.claude/agents/` (component scaffolding, accessibility review, PR review) and
  `.claude/settings.json` (permissions and quality hooks) for contributors using
  Claude Code.

### Changed

- `src/index.ts` (the public entry point) now re-exports every component from
  `src/components/index.ts`, including components that existed before this
  release (`Radio`, `Input`, `Checkbox`, `Label`, `Spinner`, `Textarea`,
  `Divider`, `Avatar`, `Switch`, `Text`/`Heading`, `Select`, `Icon`, `Badge`) but
  were previously missing from it — only `Button`, `Header` and `Page` were
  reachable from outside the package before.
- Minimum supported Node.js version is now 22.12.0 (previously undeclared).

### Fixed

- ESLint no longer lints build artifacts (`dist/`, `coverage/`, `storybook-static/`),
  which previously produced hundreds of false positives whenever those
  directories existed locally.
- `coverage/` is now gitignored.
- A color-contrast issue in `Alert`'s `error` variant (text on its tinted
  background fell short of the WCAG AA 4.5:1 ratio).

## [0.1.0] - 2026-06-26

Initial release: `Button`, `Header`, `Page`, `Radio`, `Input`, `Checkbox`,
`Label`, `Spinner`, `Textarea`, `Divider`, `Avatar`, `Switch`, `Text`, `Select`,
`Icon`, `Badge`.
