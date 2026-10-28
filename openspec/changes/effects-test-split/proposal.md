## Why

`src/engine/effects.ts` was split into `effects/{shared,investigator,cards,board,monsters}.ts` long ago, but its tests stayed in one 511-line `effects.test.ts`, the largest test file in the repo, with twelve describe blocks that each exercise one of those modules. A failing effect now means scrolling a file that covers everything. Tooling only; no rulebook source.

## What Changes

- The describe blocks move into `src/engine/effects/<module>.test.ts` beside the module each exercises; the shared set-up (content loading, the game fixture, the helpers) moves to `src/engine/effects/fixture.ts`; `effects.test.ts` is deleted. No test changes its assertions.
- **Deviations**: none.
- Non-goals: new tests, changing the effect modules.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- none (tests; `skip_specs`).

## Impact

- `src/engine/effects.test.ts` removed; `src/engine/effects/*.test.ts` and `fixture.ts` added. Test count unchanged.
