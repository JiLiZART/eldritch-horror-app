## Why

The board data holds the spaces of three expansions for the panel's set toggles, and the engine is handed the whole board: a travel route can run from Istanbul into Under the Pyramids' Cairo by train, a nearest-city move can land in Alexandria, a random spawn can pick the Plateau of Leng, and none of those spaces has encounters, gates or clues in the content, so the game silently leaves the rules it models. The sets in play are the core set until a set's content exists (manual p.3 "Setup" plays the chosen expansions' components together, never a board alone).

## What Changes

- The engine receives the active board of the sets in play, the core set today; the panel's toggles keep previewing the other spaces. The random-play test plays on the same board and bounds every space to it.
- **Deviations**: none.
- Non-goals: expansion content, remembering the toggles with the game.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `board-graph`: the game plays on the sets in play.

## Impact

- `src/table/App.tsx`: a core-set board for every engine call and for the pieces; `src/engine/fuzz.test.ts`: the same board and a tighter space bound; `src/engine/actions.test.ts`: the refusal. View and tests; the engine is unchanged.
