## Why

Every badge on the table appears on hover, and a tablet has no hover: a finger on a monster selects its space and learns nothing of its numbers. Showing the badge for a moment after a touch gives touch players the same reading. No rulebook source.

## What Changes

- A touch on a piece, a card face or a track token shows its badge for about two seconds; the tap's click still selects or focuses as before.
- **Deviations**: none.
- Non-goals: long-press menus, pinch gestures (the controls already handle them).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: a touch shows a badge for a moment.

## Impact

- `src/table/Table.tsx`: the three hover states gain a timed touch path. 3D table only.
