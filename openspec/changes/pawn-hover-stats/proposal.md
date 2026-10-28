## Why

Monsters and gates now tell their numbers on hover; a pawn tells only its name, so checking who is close to defeat means the Status table or a sheet below the board. Health, sanity and clues are the three numbers a player reads off another's sheet across the table (manual p.3 "Health and Sanity"). The state has them; the badge has a second line.

## What Changes

- A pawn's hover badge adds the investigator's health, sanity and clues, in the panel's language.
- **Deviations**: none.
- Non-goals: tickets, possessions and skills on hover (the sheet shows them), the panel's piece list.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: a pawn's label carries health, sanity and clues.

## Impact

- `src/table/pieces.ts`: a `hint` on pawn pieces; `content/panel/i18n/{en,ru}.json`: `piece.investigatorHint`. View model and content.
