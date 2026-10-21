# Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-component`
3. Add your component under `src/components/MyComponent/`
4. Write stories in `MyComponent.stories.tsx` and tests in `MyComponent.test.tsx`
5. Export it from `src/components/index.ts` **and** `src/index.ts`
6. Run `npm run generate:mcp-data` to refresh the MCP server's metadata
7. Open a pull request

## Adding a new component — checklist

- [ ] `ComponentName.tsx` — component with TypeScript props, JSDoc and a `className` prop
- [ ] `ComponentName.module.css` — styles using `--pulse-*` tokens
- [ ] `ComponentName.stories.tsx` — CSF3, at least one story per variant, `title: 'Components/...'`
- [ ] `ComponentName.test.tsx` — Vitest + Testing Library
- [ ] `index.ts` — barrel export for the component and its types
- [ ] Exported from both `src/components/index.ts` and `src/index.ts`
- [ ] `npm run generate:mcp-data` run and the regenerated file committed

See [CLAUDE.md](./CLAUDE.md) for the full set of code conventions this project follows.
