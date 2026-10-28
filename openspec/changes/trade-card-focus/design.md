## Context

See proposal.md. `focus.place: "held"` takes a seat and an index counting possessions first; the Trade form renders each holder's possessions as labelled checkboxes; `Turn` renders `Trade` and now holds `onFocusCard`.

## Goals / Non-Goals

**Goals:**
- One button per name, the seat and index from the holder.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Name as a button
The holder's seat is its index among the unremoved investigators; the possession's index is its position in the holder's possessions; the name becomes a `card-button` calling `onFocusCard("held", index, seat)`. Layer: panel.

## Risks / Trade-offs

- None.

## Open Questions

- None.
