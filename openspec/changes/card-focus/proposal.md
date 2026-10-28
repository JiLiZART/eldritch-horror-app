## Why

The reserve, the sheet, the mystery and the mythos cards lie on the table at a size that shows their art, not their text; reading one means a careful scroll-zoom and drag. At a physical table a player picks the card up. The panel's thumbnails are smaller still. No rulebook source: the digital table's own convenience.

## What Changes

- Clicking a card face glides the camera to it and zooms until the card fills most of the view's height; selection is untouched; later panning and zooming hold.
- **Deviations**: none.
- Non-goals: flipping cards, a modal card viewer, keyboard access to the faces (the panel keeps its thumbnails), clicking tokens or pawns.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: a card face can be brought up to read.

## Impact

- `src/table/Table.tsx`: `Face` takes a click, `Scene` keeps the focus, `CameraRig` glides to a target with a zoom. 3D table only.
