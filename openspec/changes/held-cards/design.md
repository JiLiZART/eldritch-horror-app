## Context

See proposal.md. `sheetPosition` and `SHEET` lay the sheets; `Face` draws a clickable card; asset cards are portrait with `CARD_ASPECT` 745 by 478; `tableExtent(board, { tableau, sheets })` bounds the view.

## Goals / Non-Goals

**Goals:**
- Cards under sheets with the existing face, focus and extent machinery.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Card grid under the sheet
`HELD = [0.7, 0.7 * CARD_ASPECT]`, three per row with a 0.15 gap, starting 0.2 below the sheet from its left edge; `heldPosition(board, seat, index)` gives the centre of card `index` under sheet `seat`. `tableExtent` takes `heldRows` (the most rows any investigator needs) and drops `minY` to the last row's bottom. Layer: 2D geometry, tested.
- Rejected: scaling the cards to fit one row. Six cards at a fifth of the width would be unreadable thumbnails; the focus reads them, the grid keeps them recognisable.

### D2. Prop shape
`TableProps.sheets` becomes `{ image: string; held: string[] }[]`; `App.tsx` maps possessions then conditions to card fronts. `Sheets` draws each sheet and its grid. Layer: view.

## Risks / Trade-offs

- A hoarder with twelve cards drops the extent four rows → still bounded by the row count, and the fit shrinks a little for everyone.

## Open Questions

- None.
