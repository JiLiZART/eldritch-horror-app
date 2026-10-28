## Why

A defeated investigator's pawn lies on its side and the sheet's zero token shows the fallen side, but the sheet row below the board reads as if every seat were still in play; at a physical table the defeated sheet is turned or pushed aside (manual p.4 "Defeated Investigators"). Dimming the sheet and its cards marks the seat at a glance.

## What Changes

- A defeated investigator's sheet and held cards are drawn dimmed until the investigator is removed; a devoured one's sheet is gone as today.
- **Deviations**: none.
- Non-goals: dimming the pawn, hiding the sheet.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: a defeated investigator's sheet is dimmed.

## Impact

- `src/table/Table.tsx`: `Face` takes a `dim` flag; `Sheets` passes it; `src/table/App.tsx`: the flag from `defeated`. 3D table and view model.
