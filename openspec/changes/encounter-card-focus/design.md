## Context

See proposal.md. `focus.place` names a card by place; `encounterPosition(board, seat)` with `HELD` gives the encounter card's place; `Encounter.tsx` renders the drawn card as an image.

## Goals / Non-Goals

**Goals:**
- One more place, one button.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `encounter` place
`focus.place` gains `"encounter"`, resolved to `encounterPosition(board, seat)` and `HELD`; the seat is the active investigator's index among the unremoved. Layer: view.

### D2. The button
`Encounter` takes `onFocusCard` and wraps the card image in a `card-button` calling `onFocusCard("encounter", 0, seat)`. Layer: panel.

## Risks / Trade-offs

- None.

## Open Questions

- None.
