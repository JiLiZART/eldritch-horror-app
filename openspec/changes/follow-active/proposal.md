## Why

The camera flies to a space only when someone clicks it, so when the turn passes to an investigator across the map the players read "Lily Chen is active" in the panel and then hunt for Shanghai on the board. At a physical table every eye follows the turn by itself. No rulebook source: the digital table's own convenience.

## What Changes

- When the active investigator changes in the Action or Encounter phase, their space becomes the selected space and the camera moves there, as a click would; the Mythos phase leaves the selection alone.
- A route being picked is not disturbed: the follow waits until the route is confirmed or cancelled.
- **Deviations**: none.
- Non-goals: following card-text moves of other investigators, zoom levels.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the selection follows the active investigator.

## Impact

- `src/table/App.tsx`: one effect on the active investigator. 3D table; engine untouched.
