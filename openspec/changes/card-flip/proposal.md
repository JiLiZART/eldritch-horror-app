## Why

Conditions and some assets carry text on their back, the reckoning side read when the card turns over (manual p.4 "Conditions"); on the table a card brought up shows its front only, and the back is read in the panel's card viewer, which a panel-hidden screen does not have. A second click on a card already up should turn it over, as a hand does. No rulebook source beyond the double-sided cards themselves.

## What Changes

- A card brought up that has a back turns over on a further click and back again on the next; cards without a back, and the Ancient One sheet, ignore the extra click.
- **Deviations**: none.
- Non-goals: turning cards not brought up, remembering a turned card after it is put down.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: a card brought up can be turned over.

## Impact

- `src/table/Table.tsx`: `CardFace` gains an optional back image and `Face` a turned state tied to the focus; `src/table/App.tsx`: backs from the content for held and reserve cards. 3D table and view model.
