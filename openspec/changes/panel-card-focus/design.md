## Context

See proposal.md. `Scene` keeps a focus from `Face` clicks as a position and size; the geometry helpers give every card's position (`reservePosition`, `tableauPosition`, `sheetPosition`); the fit request already reaches the rig through a counter prop.

## Goals / Non-Goals

**Goals:**
- Name a card by place; the scene resolves it to the same focus the click makes.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `focus` prop
`TableProps.focus?: { place: "reserve" | "mystery" | "mythos" | "sheet"; index: number; key: number }`. `Scene` turns a changed key into the same focus state a `Face` click sets, from `reservePosition(board, index)` with the reserve size, `tableauPosition(board, 1)` with its row size, the mythos row position, or `sheetPosition(board, index)` with `SHEET`. Layer: view.
- Rejected: resolving to a position in `App`. The geometry belongs to the table.

### D2. Panel buttons
`Status` takes `onFocusCard(place, index)`; each thumbnail is wrapped in a `<button type="button">` with the card's name as accessible label; Show sheet also calls it with the seat. Layer: panel.

## Risks / Trade-offs

- A thumbnail button of a card not on the table (a reserve of three, a mystery solved) → the panel only lists what the state holds, which is what the table lays.

## Open Questions

- None.
