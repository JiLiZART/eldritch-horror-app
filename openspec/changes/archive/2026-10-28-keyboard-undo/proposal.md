## Why

Undo and Redo are buttons in the panel; every editor answers the platform's undo key, and a keyboard player at the table expects the same. The keys line can name them. No rulebook source.

## What Changes

- Ctrl or Cmd with Z undoes, with Shift and Z or with Y redoes, when no field has focus; the keys line in the Game section mentions them.
- **Deviations**: none.
- Non-goals: other shortcuts.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-persistence`: undo and redo by key.

## Impact

- `src/table/App.tsx`: the keys in the document listener, calling the same handlers; `content/panel/i18n/{en,ru}.json`: the keys line. View only.
