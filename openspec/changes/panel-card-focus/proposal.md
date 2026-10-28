## Why

Bringing a card up to read takes a pointer on the table; a keyboard player has no way to it, and the panel's thumbnails of the same cards are inert images beside the numbers. The two should meet: the panel names the card, the table shows it large. No rulebook source.

## What Changes

- The Status section's mystery, ongoing mythos and reserve thumbnails become buttons that bring the card up on the table; Show sheet brings the investigator's sheet up on the table as well as opening the image.
- **Deviations**: none.
- Non-goals: held cards from the panel (the Status table lists them by name only), a thumbnail for the Ancient One sheet.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the panel brings cards up on the table.

## Impact

- `src/table/Table.tsx`: a `focus` prop naming a card by place; `src/table/App.tsx`: the counter; `src/table/Panel.tsx`: the buttons. Panel and 3D table.
