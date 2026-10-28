## Why

About one build in four fails with `ENOTEMPTY, Directory not empty: dist/cards` and passes on a rerun. Vite empties `dist/` with a plain recursive remove, and Finder writes `.DS_Store` into the folder while it is being removed, so the remove sees a file appear under it and gives up. Node's remove can retry on that very error. No rulebook source: tooling.

## What Changes

- The content plugin in `vite.config.ts` empties the output folder itself at build start with Node's retrying remove, and Vite's own emptying is turned off, so a file appearing mid-removal is retried instead of failing the build.
- **Deviations**: none; tooling only, `skip_specs`.
- Non-goals: stopping Finder from writing `.DS_Store`, changing the output folder.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- none (tooling, `skip_specs: true`)

## Impact

- `vite.config.ts` only.
