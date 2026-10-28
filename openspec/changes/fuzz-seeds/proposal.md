## Why

The fuzz test plays six seeds on every `pnpm test`, enough to keep the suite fast but a thin sample of random play. Before a release or after an engine change a longer run finds rarer paths; today that means editing the seed list by hand. Tooling only; no rulebook source.

## What Changes

- `FUZZ_SEEDS=<n>` makes the fuzz test play seeds 1 to n; unset, it plays six as now. `pnpm test:fuzz` runs sixty. The README's Developing section names the command.
- **Deviations**: none.
- Non-goals: parallel runs, a seed range start, reporting coverage.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- none (test tooling; `skip_specs`).

## Impact

- `src/engine/fuzz.test.ts`, `package.json`, `README.md`.
