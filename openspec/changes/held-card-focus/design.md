## Context

See proposal.md. `TableProps.focus` names a card by place and index; `heldPosition(board, seat, index)` and `HELD` give every held card's place; the Status table joins the names with commas.

## Goals / Non-Goals

**Goals:**
- One more place in the focus prop, buttons in two cells.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `held` place
`focus.place` gains `"held"` with `seat` and `index`, resolved to `heldPosition(board, seat, index)` and `HELD`; the index counts possessions first then conditions, as the sheet lays them. Layer: view.

### D2. Buttons in the cells
The possessions and conditions cells render one `card-button`-styled text button per card, separated by commas, each calling `onFocusCard("held", index, seat)`. Layer: panel.

## Risks / Trade-offs

- None.

## Open Questions

- None.
