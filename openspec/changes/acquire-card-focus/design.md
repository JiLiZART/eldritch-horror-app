## Context

See proposal.md. `Acquire` renders a label per reserve card with a checkbox; `focus.place: "reserve"` with the index resolves the card on the table; `Turn` renders `Acquire`.

## Goals / Non-Goals

**Goals:**
- One button per name, the handler threaded through `Turn`.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Name as a button
Beside each checkbox the card's name becomes a `card-button` calling `onFocusCard("reserve", index)`; the checkbox keeps an accessible label of its own. `Turn` takes `onFocusCard` and passes it to `Acquire`. Layer: panel.

## Risks / Trade-offs

- None.

## Open Questions

- None.
