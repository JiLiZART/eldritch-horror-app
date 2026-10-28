## Context

See proposal.md and the `track-tokens` design: `board.tracks` holds the doom and omen tracks in normalized coordinates, `Tracks` in `Table.tsx` draws token billboards from a `tracks` prop built by `App`. Measured on the image: the four slot centres run from x 0.112 to x 0.319 at y 0.934, each slot about 0.056 of the width; asset cards are portrait, 478 by 745.

## Goals / Non-Goals

**Goals:**
- The same pattern as the tracks: data, a position function, billboards.

**Non-Goals:**
- Clicking slots (see proposal).

## Decisions

### D1. `tracks.reserve: { from, to, slots, width }`
Validated like the doom track, `width` within 0 to 1. Layer: content.

### D2. `reservePosition(board, index)`
Slot `i` lies at `from + i / (slots - 1) * (to - from)`, through `boardToWorld`. Layer: view geometry, tested.

### D3. Cards in the `Tracks` component
`tracks.reserve` carries the image paths in order; each is drawn as a billboard of width `width * BOARD_WIDTH` and height by the card aspect 745 to 478, textures loaded with the tokens. Layer: view.

## Risks / Trade-offs

- A reserve shorter than four (decks exhausted) leaves empty slots → correct.

## Open Questions

- None.
