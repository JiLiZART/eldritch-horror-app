## Context

See proposal.md. `Pieces` in `Table.tsx` draws each piece as a mesh inside a `Billboard`; drei's `Html` places DOM beside a scene point; `Piece.label` is the text the panel lists.

## Goals / Non-Goals

**Goals:**
- One hover state, one floating label, no change to picking or selection.

**Non-Goals:**
- Touch, track tokens (see proposal).

## Decisions

### D1. Hover state on `Pieces`
`onPointerOver` on a piece mesh sets `{ id, label, position }`, `onPointerOut` clears it when it matches; the pointer events stop propagation so the marker below does not react. Layer: view.

### D2. `Html` label
One `Html` at the hovered position, offset up by the piece's height, with the label in a small dark badge styled in `table.css`; `pointerEvents: none` so it never steals the hover. Layer: view.
- Rejected: the browser `title` attribute. A canvas has no per-mesh titles.

## Risks / Trade-offs

- Pointer events on every piece mesh add raycasting per move → a few dozen meshes, negligible.

## Open Questions

- None.
