## Context

See proposal.md. `piecesOnSpace` builds `Piece`s with a label already carrying the health lost; `Pieces` draws each as a mesh in a `Billboard`; the numbered tokens are `cards/eh01/tokens/health/health-0N.webp`.

## Goals / Non-Goals

**Goals:**
- One optional field, one extra mesh.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `damage` on the piece
`Piece.damage?: number`, set for a monster with health lost above 0; `pieces.test.ts` covers it. Layer: view model.

### D2. Token mesh in `Pieces`
When `damage` is set, a second mesh in the same `Billboard`, 0.14 wide at the monster token's lower-right (offset 0.08, -0.08, z 0.002), with the `health-0N` texture for `min(9, damage)`; the textures join the piece texture list. Layer: view.
- Rejected: a drei `Html` badge. The hover label already is one; a token keeps the table's look.

## Risks / Trade-offs

- None beyond one more texture per distinct damage value.

## Open Questions

- None.
