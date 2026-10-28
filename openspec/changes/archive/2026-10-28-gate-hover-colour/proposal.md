## Why

Gates matter by colour: the omen advancing adds doom per matching gate and a monster surge spawns at matching gates (manual p.3 "Mythos Phase"; EH_reference.pdf p.6). The gate token's colour band is a few pixels on the table, and the board data already carries each city's gate colour. The hover badge names the gate; it should name the colour and whether it matches the omen now.

## What Changes

- A gate's hover badge adds a second line with its omen colour and, when it equals the current omen, that it matches.
- **Deviations**: none.
- Non-goals: colouring the markers, the panel's piece list.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: a gate's label names its colour and omen match.

## Impact

- `src/table/pieces.ts`: a `hint` on gate pieces from `Space.gate` and `state.omen`; `content/panel/i18n/{en,ru}.json`: `piece.gateColour`, `piece.matchesOmen`. View model and content; the badge already shows hints.
