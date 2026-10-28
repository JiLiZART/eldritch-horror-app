## Why

The path legend always lists four types, but local paths exist only on expansion spaces (glossary "Path"; EH_reference.pdf p.10): with the core set alone the legend names a path type the board does not draw. The legend should list what is on screen.

## What Changes

- The path legend lists only the path types present among the paths shown, in the legend's fixed order.
- **Deviations**: none.
- Non-goals: changing the colours, the set toggles or the drawing of paths.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the legend follows the shown paths.

## Impact

- `src/table/sets.ts` (or `src/content/board.ts`): a pure `pathTypes(paths)` helper with a test; `src/table/Panel.tsx`: the legend reads it from `shownBoard`. Panel only.
