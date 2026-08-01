---
name: update-mcp-data
description: Regenerate src/mcp/components-data.json after adding or editing a component, and report what changed.
---

Run `npm run generate:mcp-data`, then run `git diff --stat -- src/mcp/components-data.json` (or `git diff -- src/mcp/components-data.json` for full detail if the diff is small).

Summarize for the user which components' metadata changed (added props, new variants/sizes, new examples, etc). If the diff is empty, say so explicitly instead of assuming everything is up to date without checking.

This is a convenience shortcut for local development. It does not replace the `mcp-data` CI job in `.github/workflows/quality-checks.yml`, which independently regenerates and diff-checks this file on every push/PR.
