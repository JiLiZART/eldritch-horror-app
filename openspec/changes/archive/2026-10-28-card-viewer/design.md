## Context

See proposal.md. `Effects.tsx` lists `[...me.possessions, ...me.conditions]` with a Discard button each; `set.cards` has `images.front` and, for double-sided decks, `images.back`; `.cards img` styles exist for the card images shown elsewhere.

## Goals / Non-Goals

**Goals:**
- Two buttons per card, one image, no new state beyond which card and side is open.

**Non-Goals:**
- Zoom, the sheet (see proposal).

## Decisions

### D1. One open card at a time
`Effects.tsx` keeps `shown: { card: string; side: "front" | "back" } | undefined`; Show sets the front, Back sets the back, Hide clears; opening another card replaces it, so the panel never grows by more than one image. Layer: view.
- Rejected: a modal. The panel is the players' side table; an image inline keeps the list in view.

### D2. Labels
"Show", "Hide", and for a card with a back "Back (hidden until flipped)". Layer: view.

## Risks / Trade-offs

- Card images are a few hundred kilobytes each → loaded on request only.

## Open Questions

- None.
