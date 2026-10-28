## Why

The Status table names each investigator's possessions and conditions, and the same cards lie under the sheets on the table, but the names are plain text: reading what a condition does means finding its thumbnail under the sheet with the pointer. The reserve and the mystery already open from the panel; the held cards are the last cards the panel names without a way to them. No rulebook source.

## What Changes

- Each possession and condition name in the Status table is a button that brings that card up on the table.
- **Deviations**: none.
- Non-goals: the encounter card, the Ancient One sheet.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: held cards open from the Status table.

## Impact

- `src/table/Table.tsx`: the `focus` prop gains a `held` place with a seat; `src/table/Panel.tsx`: the names become buttons. Panel and 3D table.
