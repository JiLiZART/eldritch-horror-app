## Why

The Saved games list is in creation order with no dates, so a household with several games cannot tell which was played last night. The slot index already records when each slot was last saved. No rulebook source.

## What Changes

- The list shows the slots last played first, each with its last-played time in the browser's locale.
- **Deviations**: none.
- Non-goals: sorting by name, deleting old slots automatically.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-persistence`: the Saved games list is ordered and dated.

## Impact

- `src/table/NewGame.tsx`: the sort and the date. Panel only.
