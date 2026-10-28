## Context

See proposal.md. `piecesOnSpace` has the state, whose `phase.active` names the investigator in the Action and Encounter phases; `Pieces` draws each pawn in a `Billboard` with its foot on the space.

## Goals / Non-Goals

**Goals:**
- One flag, one flat ring.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `active` on the pawn piece
`Piece.active?: true` for the pawn whose id equals `phase.active` when the phase is Action or Encounter; `pieces.test.ts` covers the turn passing. Layer: view model.

### D2. A flat ring
A `ringGeometry` (inner 0.14, outer 0.2) mesh lying flat at the pawn's foot, 0.01 above the board, pale gold, drawn outside the `Billboard` so it stays on the table while the standee faces the camera. Layer: view.
- Rejected: tinting the pawn. The art stays as printed.

## Risks / Trade-offs

- None.

## Open Questions

- None.
