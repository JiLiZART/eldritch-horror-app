## Context

See proposal.md. `Tableau` draws the mystery card as a `Face` at `tableauPosition(board, 1)`; `spreadOnCircle(n, radius)` fans pieces; `cards/eh01/tokens/mystery-token.webp` is 512 by 512.

## Goals / Non-Goals

**Goals:**
- One count, one fan of token meshes.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `tableau.tokens`
`TableProps.tableau` gains `tokens: number`; `Tableau` draws that many 0.3-wide token meshes at `spreadOnCircle(tokens, 0.35)` offsets from the card's centre, 0.01 above it, no click (a click there focuses the card). Layer: view.

## Risks / Trade-offs

- A dozen tokens overlap on a 2.4 by 1.5 card → the mysteries ask for at most half the investigator count, so under five.

## Open Questions

- None.
