## Why

Two encounters the rules name are still missing: the Ancient One's special encounters, which Cthulhu's and Yog-Sothoth's mysteries and sheets call for, and the encounter on the back of a defeated investigator's sheet, which lets a comrade on that city recover the fallen one's possessions and takes the token off the board (`inspired/manual_eng.pdf` p.3 "Special encounters", p.4 "Defeated"; `inspired/EH_reference.pdf` p.5 "Контакты", p.12 "Побеждённые сыщики"). Both decks and sheet backs are in the content already.

## What Changes

- Special deck: shuffled at setup when the Ancient One has one; drawn like any encounter deck on any space; the card shows, then goes to its discard; refused when the Ancient One has none.
- Defeated investigator's encounter: on a space where a defeated (not devoured) investigator's token lies, the encountering investigator resolves that sheet's back as their encounter; a control takes the possessions set aside with the sheet; finishing removes the token and sheet from the game.
- The panel offers Draw special when the deck exists, and the fallen investigator's encounter with the sheet back and a Take possessions control when a token lies on the space.
- **Deviations**: when the special deck may be drawn, and whether the sheet back grants the possessions, are the players' reading; a removed investigator who was not yet replaced is still replaced at the end of the Mythos phase, as the rules say.
- Non-goals: rumor encounters, the Crippled or Insane choice (the back shows both), the sheet's other text.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `encounter-phase`: the special deck and the defeated investigator's encounter.
- `card-effects`: the fallen one's possessions are collected.
- `table-view`: a removed investigator's pawn is gone.
- `game-setup`: the special deck is shuffled.

## Impact

- `src/engine/types.ts`: `decks.special`, `InvestigatorState.removed`, `STATE_VERSION` 4; `src/engine/setup.ts`; `src/engine/encounter.ts`: `allowed` and `drawEncounter` for `special`, `encounterFallen`, `finishEncounter` removes the token; `src/engine/effects.ts`: `takePossessions`; `src/table/Encounter.tsx`, `pieces.ts`, `Panel.tsx`. 2D panel plus the table pieces.
- `content/rules/glossary.md`: Special encounter and Defeated exist; no new terms.
