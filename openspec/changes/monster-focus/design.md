## Context

See proposal.md. `Pieces` draws each piece with hover and a selecting click; `Face` owns the bring-up and turn-over behaviour; the focus is a position and size the rig glides to; monsters have `images.back`.

## Goals / Non-Goals

**Goals:**
- Reuse the focus and the turned rule for monster meshes.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `Piece.back` for monsters
`piecesOnSpace` sets `back` from `monster.images.back`; the texture list includes it. Layer: view model.

### D2. Double-click focuses, click turns when focused
A piece mesh gets `onDoubleClick` calling the same `onFocus(position, size)` the faces use; the `FocusedAt` context tells the piece it is up, and then a single click toggles `turned` instead of selecting (the space is selected by the first click of the double-click anyway). Layer: view.

## Risks / Trade-offs

- A double-click also fires two selecting clicks → both select the same space; harmless.

## Open Questions

- None.
