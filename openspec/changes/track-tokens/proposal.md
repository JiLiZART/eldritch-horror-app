## Why

The board image prints a doom track along its top and an omen track in its corner, and the physical game lives by sliding the doom token and turning the omen token on them. The table keeps both only as numbers in the Status panel, so the board never shows how close the Ancient One is or which colour the omen points at (`inspired/manual_eng.pdf` p.3 "Omen", p.4 "Doom"; `inspired/EH_reference.pdf` p.4). The set ships the token images.

## What Changes

- Board data declares the tracks: the doom track as its first and last space in board coordinates with 21 spaces between, the omen track as its centre and radius with the comet on top and the colours clockwise.
- The table draws the doom token on the current doom space, the omen token on the current omen space, and the eldritch tokens on the track fanned beside their space, all from the set's token images; they move as the state changes and vanish without a game.
- Content validation checks the track data lies within the board.
- **Deviations**: none; the printed tracks are reproduced, not modelled further.
- Non-goals: dragging tokens, the reserve slots, the mystery token.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the doom and omen tokens stand on their tracks.

## Impact

- `content/board/board.json` gains `tracks`; `src/content/types.ts` and `validate.ts`; `src/table/geometry.ts` (positions on the tracks, tested); `src/table/Table.tsx` (three token kinds drawn from the state). 3D table; the panel is untouched.
- `content/rules/glossary.md`: Doom and Omen exist; no new terms.
