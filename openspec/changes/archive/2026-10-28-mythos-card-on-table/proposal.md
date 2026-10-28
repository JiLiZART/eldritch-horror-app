## Why

The mythos card is drawn and read aloud at the table (manual p.3 "Mythos Phase"); here it appears only as a thumbnail in the Mythos panel while the tableau beside the board shows the ongoing cards and nothing of the card being resolved. With card focus on the table, the drawn card belongs where the players look.

## What Changes

- During the Mythos phase the drawn card lies first in the tableau's mythos row; it leaves when the phase ends unless it stays in play as an ongoing card.
- **Deviations**: none.
- Non-goals: the encounter card on the table, the panel's thumbnail.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the drawn mythos card lies in the tableau during the Mythos phase.

## Impact

- `src/table/App.tsx`: the tableau's mythos list starts with `phase.card` in the Mythos phase. View model only.
