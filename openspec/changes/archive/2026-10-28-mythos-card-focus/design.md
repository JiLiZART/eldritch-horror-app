## Context

See proposal.md. During the Mythos phase the drawn card is index 0 of the tableau's mythos row; `focus.place: "mythos"` already resolves that row; `Mythos.tsx` renders the card as an image.

## Goals / Non-Goals

**Goals:**
- One button.

**Non-Goals:**
- See proposal.

## Decisions

### D1. The button
`Mythos` takes `onFocusCard` and wraps the image in a `card-button` calling `onFocusCard("mythos", 0)`. Layer: panel.

## Risks / Trade-offs

- None.

## Open Questions

- None.
