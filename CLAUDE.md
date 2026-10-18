# CLAUDE.md

Librería de componentes React (pulse-components) — React 19 + TypeScript + CSS Modules, documentada con Storybook y testeada con Vitest + Testing Library.

## Stack y arquitectura

- **Build**: Vite 8 en modo librería. Entry `src/index.ts` → `dist/index.js` (ESM) y `dist/index.cjs` (CJS) + `dist/index.d.ts`. CSS se emite unificado en `dist/style.css`. `react`, `react-dom`, `react/jsx-runtime` y `lucide-react` van externalizados (peer deps).
- **Exports del package.json**: `.` (componentes), `./tokens` (`dist/tokens/index.css`), `./styles` (`dist/style.css`).
- **TypeScript**: `tsconfig.json` es solution-style, referencia `tsconfig.app.json` y `tsconfig.node.json`.
- **Lint**: ESLint 10 flat config (`eslint.config.ts`) con `typescript-eslint` recommended + `js/recommended`.
- **Estructura de `src/`**:
  - `components/` — un folder por componente.
  - `tokens/` — design tokens en CSS (`colors.css`, `spacing.css`, `typography.css`, `index.css`), consumidos como variables `--pulse-*` en los `.module.css` de cada componente.
  - `docs/`, `Welcome.mdx` — documentación de Storybook.
  - `test-setup.ts` — setup global de Vitest/RTL.
- **CI** (`.github/workflows/quality-checks.yml`, en cada push/PR): `lint` → `typecheck` (`tsc --noEmit`) → `test-unit` (Vitest) → `test-storybook` (Playwright/Chromium) → `coverage` (80% mínimo, sube artifact).
- `src/index.ts` reexporta todos los componentes de `src/components/index.ts` (mismas categorías: Primitives / Form / Display / Legacy). Si se agrega un componente nuevo a `src/components/index.ts`, replícalo también en `src/index.ts` para que llegue al entry point público.

## Componentes (`src/components/`)

Componentes actuales: `Page, Radio, Input, Checkbox, Label, Spinner, Textarea, Button, Divider, Avatar, Switch, Text, Select, Icon, Header, Badge`.

Cada carpeta sigue siempre la misma estructura:

```
ComponentName/
  ComponentName.tsx          # componente + interfaz de props + JSDoc
  ComponentName.module.css   # estilos con CSS Modules
  ComponentName.stories.tsx  # historias de Storybook (CSF3)
  ComponentName.test.tsx     # tests (Vitest + RTL)
  index.ts                   # barrel: reexporta componente y tipos
```

Convenciones de código:

- **Props**: `interface XProps`, a menudo extendiendo atributos HTML nativos con `Omit<...HTMLAttributes<...>, 'type' | 'size'>`. Variantes/tamaños como union types exportados aparte (`export type InputVariant = 'outline' | 'filled' | 'underline'`).
- **Componentes**: function declarations (`export function Button(...)`), sin `forwardRef` ni `React.FC`. Props desestructuradas con defaults inline.
- **Estilos**: CSS Modules; clases compuestas manualmente (`[styles.button, styles[size], ...].filter(Boolean).join(' ')`). No se usa `clsx`/`cva`.
- **Naming**: componentes y tipos en PascalCase, props/variables en camelCase, clases CSS en camelCase.
- **Accesibilidad**: siempre se cuida (`aria-invalid`, `aria-describedby`, `aria-busy`, `role="alert"` en mensajes de error).
- **Compartido**: no hay carpeta `utils/`/`hooks/`; lo único transversal es el componente `Icon` (wrapper de `lucide-react`) usado por Button/Input/Select, y los tokens CSS globales.
- **Exports**: cada `index.ts` reexporta componente + tipos; `src/components/index.ts` agrupa todo por categorías comentadas (Primitives / Form / Display / Legacy).

## Storybook

- Config en `.storybook/main.ts` (framework `@storybook/react-vite`, stories en `src/**/*.stories.tsx` y `**/*.mdx`) y `.storybook/preview.tsx` (importa tokens globalmente, `a11y.test: 'error'` — las violaciones de accesibilidad rompen el build).
- Addons: `@chromatic-com/storybook`, `@storybook/addon-vitest`, `@storybook/addon-a11y`, `@storybook/addon-docs`.
- Formato **CSF3**: `meta` con `satisfies Meta<typeof Component>`, `title: 'Components/X'`, `tags: ['autodocs']`, `argTypes` tipados por control; stories como `StoryObj` nombradas semánticamente (`Primary`, `Disabled`, `Loading`, `WithIconLeft`, no solo `Default`).
- Los tests de interacción viven en `play` functions dentro de las stories (`within`, `userEvent`, `expect` de `storybook/test`) y se ejecutan como parte del proyecto Vitest `storybook` (Playwright/Chromium).

## Tests

- Stack: Vitest (2 projects definidos en `vite.config.ts`: `unit` con jsdom, `storybook` con Playwright/Chromium) + React Testing Library + `@testing-library/user-event` + `jest-dom`.
- Scripts: `test` (todo), `test:unit`, `test:storybook`, `coverage` (v8, umbral 80% en líneas/funciones/branches/statements sobre `src/components/**`).
- Setup global en `src/test-setup.ts` (matchers de jest-dom + `cleanup()` tras cada test).
- Patrón habitual en `*.test.tsx`: `describe` agrupado por aspecto (Rendering, Variants, Sizes, Disabled/Loading, Interactions, Styling), `render` + `screen.getByRole`, `userEvent` para interacción, `it.each` para variantes parametrizadas, aserciones sobre className/`aria-*`/`toBeDisabled`. No hay snapshot testing.

## Estilo de código general

- TypeScript estricto con interfaces explícitas para props; tipos de variante como union types exportados junto al componente.
- Sin librerías de utilidades de clases (no `clsx`/`cva`/`tailwind-merge`); composición manual de clases con CSS Modules.
- JSDoc encima de props y componente (incluyendo bloque `@example`) en vez de comentarios inline.
- Convención de nombres consistente: PascalCase para componentes/tipos, camelCase para props/variables/clases CSS.

## MCP server (consulta de componentes)

El paquete incluye un servidor MCP de solo consulta (`bin: pulse-components-mcp`), embebido en el mismo `package.json` — solo es invocable si `pulse-components` está instalado como dependencia; no existe como paquete separado.

- **Metadata versionada**: `src/mcp/components-data.json` se genera con `npm run generate:mcp-data` (`scripts/generate-mcp-data.ts`, usa `ts-morph` para parsear props/JSDoc/variantes/tamaños de cada `*.tsx` y ejemplos de cada `*.stories.tsx`). **No se edita a mano.**
- Tras crear o modificar un componente, regenera el JSON con `npm run generate:mcp-data` (o el skill `/update-mcp-data`) antes de commitear.
- El job `mcp-data` en `.github/workflows/quality-checks.yml` falla el PR si el JSON versionado no coincide con el que generaría el código actual (`npm run check:mcp-data`).
- Servidor (`src/mcp/server.ts`, build Node-only vía `tsconfig.mcp.json` → `dist/mcp/`) expone dos tools de solo lectura: `list_components` y `get_component(name)`. No recomienda qué componente usar — esa decisión es del desarrollador.
- Probar localmente: `npm run build && npx @modelcontextprotocol/inspector node dist/mcp/server.js`.
