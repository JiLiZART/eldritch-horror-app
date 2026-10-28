## Context

See proposal.md. `Face` draws a clickable card; `tableExtent(board, withTableau)` bounds the view; `TableProps.tableau` carries the Ancient One's faces. Sheets are landscape, 1600 by 1268.

## Goals / Non-Goals

**Goals:**
- Sheets as faces, with the extent and the focus already in place.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Row geometry
`SHEET = [2.4, 2.4 * 1268 / 1600]`; `sheetPosition(board, index)` is the centre of sheet `index` in a row 0.3 below the board's bottom edge, from the board's left edge, 0.2 apart. `tableExtent(board, { tableau, sheets })` takes the count: `minY` drops to the row's bottom when `sheets > 0`, `maxX` is the larger of the tableau's and the row's right edge. Layer: 2D geometry, tested.
- Rejected: wrapping into two rows. Eight sheets reach 20.6 wide against a board 10 wide; the extent simply grows, and the fit shrinks for a large group that reads sheets by focus anyway.

### D2. `Sheets` component and prop
`TableProps.sheets?: string[]` (front images in seat order, removed investigators left out) drawn as `Face`s with `onFocus`. `App.tsx` maps `state.investigators` filtering `removed`. Layer: view.

## Risks / Trade-offs

- A large group widens the table, shrinking the fitted board → cards and sheets are read by focus; the board is still the biggest thing on the table.

## Open Questions

- None.
