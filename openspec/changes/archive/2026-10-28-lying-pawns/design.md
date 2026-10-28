## Context

See proposal.md. `piecesOnSpace` in `pieces.ts` builds a `Piece` per pawn with a label saying "(delayed)" or "(defeated)"; `Pieces` in `Table.tsx` draws each piece as a plane inside a `Billboard`, pawns raised by half their height so they stand on the board.

## Goals / Non-Goals

**Goals:**
- One flag on the piece, one rotation in the renderer.

**Non-Goals:**
- Models or animation (see proposal).

## Decisions

### D1. `Piece.lying?: true`
Set for a pawn whose investigator is delayed or has `defeated` set; the label keeps saying which. Layer: view model.

### D2. Rotate the plane inside the billboard
A lying pawn's plane is rotated a quarter turn around the billboard's depth axis, so the standee lies sideways facing the camera, and is raised by half its width instead of half its height so it rests on the board. Layer: view (3D).
- Rejected: laying the plane flat on the board. Flat on a top-down-ish camera it reads as a card, not a fallen pawn.

## Risks / Trade-offs

- The lying pawn is wider than the fan's spacing → the fan radius already grows with the count.

## Open Questions

- None.
