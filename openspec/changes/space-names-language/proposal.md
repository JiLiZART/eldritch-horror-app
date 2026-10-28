## Why

The board carries every space name in both languages, and the 3D board prints the Russian ones when Russian is chosen, yet the panel keeps naming spaces in English: the Status table's Space column, the space list, the neighbours, and every "move to London" style control in the phase panels and card-text groups. A Russian table reads Лондон on the board and London beside it. The names are already in `content/board/board.json`.

## What Changes

- Every space name the panel prints comes from the board data in the chosen language; the Selected space section keeps showing both.
- **Deviations**: none.
- Non-goals: space names inside engine log lines, card and investigator names.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `panel-language`: space names follow the chosen language.

## Impact

- `src/table/lang.tsx`: a `useSpaceName()` hook; `src/table/Panel.tsx`, `Turn.tsx`, `Encounter.tsx`, `Mythos.tsx`, `Acquire.tsx`, `Trade.tsx`, `effects/*.tsx` where they call the engine's `spaceName` or read `name.en`. Panel only.
