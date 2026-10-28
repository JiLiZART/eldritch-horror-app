## Why

"You are devoured" ends an investigator for good: doom advances, everything they hold is discarded, their sheet and token go back to the box, the lead passes, and the player takes a new investigator at the end of the Mythos phase unless the Ancient One has awakened (`inspired/manual_eng.pdf` p.4 "Devoured"; `inspired/EH_reference.pdf` p.12 "Сожранные сыщики"). It is printed on Ancient One sheets, mysteries and encounters, and today has no button, so a devoured player keeps a pawn on the board and a seat in turn order.

## What Changes

- Devoured by card text: in the Encounter and Mythos phases a standing investigator is devoured: doom advances by 1, their assets and artifacts go to their discards, their spells and conditions are shuffled back into their decks, clues, tickets and improvements are gone, the pawn leaves the board, their turns are skipped, the lead passes when they held it, and the game is lost when nobody stands.
- Replacement: a devoured investigator is replaced at the end of the Mythos phase like a defeated one, unless the Ancient One has awakened.
- The pawn of a devoured investigator is not drawn; Status marks them devoured; the Investigator group offers Devour.
- **Deviations**: none against the printed steps; the clue tokens a devoured investigator held leave the game, as spent clues do today.
- Non-goals: Lost in Time and Space, the defeated token's encounter.

## Capabilities

### New Capabilities
- `devoured-investigator`: the steps of being devoured.

### Modified Capabilities
- `investigator-replacement`: a devoured investigator is replaced too.
- `table-view`: a devoured investigator's pawn is gone.

## Impact

- `src/engine/types.ts`: `defeated` gains the value `"devoured"`; `src/engine/effects.ts`: `devour`; `src/engine/encounter.ts` shares the seat-skipping, lead-passing and loss check with `defeat`.
- `src/table/pieces.ts` (no pawn), `Panel.tsx` (mark), `Effects.tsx` (Devour). 2D panel plus the table pieces.
- `content/rules/glossary.md`: Devoured exists; no new terms.
