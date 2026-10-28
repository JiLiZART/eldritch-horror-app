## Why

The board prints a Reserve strip with four card slots, and on a physical table the four assets for sale lie there for everyone to see; on this table they appear only as small images in the Status panel. The slots are a strip like the doom track, the card images exist, and the tracks change gave the table a way to draw state on the board. No rulebook source: the printed board is reproduced.

## What Changes

- Board data declares the reserve slots as the first and last slot centre with their count and a slot width.
- The table draws each reserve card's face in its slot, in reserve order, from the set's card images, refreshing as the reserve changes; nothing before a game starts.
- Content validation checks the slot data lies within the board.
- **Deviations**: none.
- Non-goals: taking cards by clicking the slots, the Bank Loan card printed beside them.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the reserve cards lie in the printed slots.

## Impact

- `content/board/board.json` (`tracks.reserve`), `src/content/types.ts` and `validate.ts`, `src/table/geometry.ts` (`reservePosition`, tested), `src/table/Table.tsx` (cards drawn in the slots), `src/table/App.tsx` (the reserve's image paths). 3D table; the panel is untouched.
