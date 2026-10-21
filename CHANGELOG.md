# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Fixes from a post-1.0.0 QA pass. Not yet published — version number to be
decided when ready to publish.

### Removed

- `Header` and `Page` are no longer exported from the public entry point
  (`src/index.ts`). They were Storybook template example components with no
  tests of their own, never intended as part of the design system; they
  remain in `src/components/index.ts` for Storybook but are no longer part of
  the published package's API. **Breaking** for anyone importing them from
  `pulse-components`.

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

### Changed

- `strict: true` enabled in `tsconfig.app.json`, `tsconfig.node.json` and
  `tsconfig.mcp.json` (previously only had a few individual compiler flags).
  No code changes were needed — everything already type-checked cleanly.

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
