## Why

The random-play test checks every accepted state but never the state it was computed from: an engine step that edits its input before refusing, or that shares an array with the state it returns, would corrupt undo and the saved game without failing a bound. The table keeps earlier states for Undo and Redo, so each step must leave its input as it was. Tooling only.

## What Changes

- The fuzz driver snapshots the state before each step and asserts, after an accepted step and after a refusal alike, that the input state still equals its snapshot.
- **Deviations**: none.
- Non-goals: new engine behaviour; a failing seed becomes its own change.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- none (tests; `skip_specs`).

## Impact

- `src/engine/fuzz.test.ts`.
