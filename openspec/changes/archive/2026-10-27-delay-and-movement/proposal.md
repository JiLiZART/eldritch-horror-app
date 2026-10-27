## Why

Card text can now change health, sanity, clues, gates and cards, but the two most common remaining lines, "move to a space" and "become Delayed", still have to be remembered at the table, and a defeated investigator's pawn stays where it fell instead of lying in the nearest city (`inspired/manual_eng.pdf` p.4 "Delayed", "Defeated" step 2 "Relocation"). This closes the last gaps in what a round of card text needs from the state.

## What Changes

- Movement by card text: in the Encounter and Mythos phases a standing investigator may be moved to any space the players name, without a ticket or an action (`manual_eng.pdf` p.3–4; `EH_reference.pdf` p.2 "nearest" is the players' call).
- Delayed: card text lays an investigator's token on its side. A delayed investigator cannot perform actions; in the next Action phase their turn stands the token up instead (`manual_eng.pdf` p.4 "Delayed"; `EH_reference.pdf` p.4). They still encounter.
- Defeat relocation: a defeated investigator's pawn moves to the nearest city space and their conditions are shuffled back into the condition deck; possessions stay on the sheet (`manual_eng.pdf` p.4 "Defeated" steps 2–3).
- The panel offers Move (space choice) and Delay beside the other effects; the Action turn of a delayed investigator shows only the stand-up; delayed and defeated investigators are marked on the table and in the status table.
- **Deviations**: among several nearest cities the first in board order is taken; "you are no longer delayed" text, Detained and local paths are left to the players; no replacement investigator.
- Non-goals: monster movement, mysteries, awakening, skill improvement, Detained.

## Capabilities

### New Capabilities
- `delayed-investigator`: becoming delayed, the lost Action turn, the stand-up.

### Modified Capabilities
- `card-effects`: an investigator is moved by card text.
- `encounter-phase`: a defeated investigator relocates to the nearest city and loses their conditions.

## Impact

- `src/engine/types.ts`: `InvestigatorState.delayed`; `src/engine/effects.ts` gains `moveInvestigator` and `delay`; `src/engine/actions.ts` refuses actions of a delayed investigator and `endTurn` stands them up; `defeat` in `src/engine/encounter.ts` relocates with `distance` from `src/content/board.ts` and reshuffles conditions.
- `src/table/Effects.tsx` (space select, Move, Delay), `Turn.tsx` (stand-up turn), `Panel.tsx` and `pieces.ts` (marks), 2D and 3D labels.
- `content/rules/glossary.md`: Delayed, Nearest, Defeated exist; no new terms.
