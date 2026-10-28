## Why

Every piece and card on the table names itself on hover; the doom, omen and eldritch tokens on the printed tracks are the last mute ones, and the doom number under the token is small at full zoom-out. The values are in the state and the badge exists. No rulebook source.

## What Changes

- The doom token's badge shows the doom value, the omen token's the colour and its eldritch count, each eldritch token's its omen space; in the panel's language.
- **Deviations**: none.
- Non-goals: the mystery tokens on the card (the card names itself).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the track tokens name themselves on hover.

## Impact

- `src/table/Table.tsx`: `Tracks` takes labels and shows the badge; `src/table/App.tsx`: the three strings built through the panel's translator; `content/panel/i18n/{en,ru}.json`: `track.doom`, `track.omen`, `track.eldritch`. 3D table and content.
