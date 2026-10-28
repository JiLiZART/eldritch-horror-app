## Why

Mystery cards collect tokens by their own text: Azathoth's The True Name reads "place that Eldritch token on this card" and is solved when enough lie there. The engine counts them as mystery tokens (ancient-one spec) and the status panel prints the count, but the card in the tableau shows none, so the table reads as if the mystery had not begun. The mystery token art is in the set.

## What Changes

- The mystery card in the tableau carries one mystery token per token counted in the state, fanned on the card's face.
- **Deviations**: none; the engine already models the count.
- Non-goals: distinguishing eldritch from mystery tokens on the card (the engine counts one kind), tokens on the Ancient One sheet.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: mystery tokens lie on the mystery card.

## Impact

- `src/table/Table.tsx` (`Tableau`); `src/table/App.tsx` passes the count. 3D table only.
