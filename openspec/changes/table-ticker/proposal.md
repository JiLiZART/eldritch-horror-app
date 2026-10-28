## Why

The table-only screen now says the round, the phase and whose turn, but not what just happened; the journal does, in the panel. Showing its last line under the status line lets the people watching the big screen follow the play without the panel. No rulebook source.

## What Changes

- The latest journal entry is shown under the status line in the table's corner, phrased as the Journal phrases it.
- **Deviations**: none.
- Non-goals: more than one line, translating the engine's text.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the last journal line is shown on the table.

## Impact

- `src/table/App.tsx`: the line's text, reusing the Journal's phrasing; `src/table/Table.tsx`: a second line in the overlay. View only.
