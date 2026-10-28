## Context

See proposal.md. `Pieces` draws each piece mesh with hover handlers; `Marker` selects on click; `Face` ignores clicks whose pointer moved, so drags starting on a card pan.

## Goals / Non-Goals

**Goals:**
- Same click rule as the faces, same selection path as the markers.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Click on the piece mesh
`Pieces` takes `onSelect`; each piece mesh gets `onClick` that stops propagation and, when `e.delta <= 4`, calls `onSelect(space)`. Route mode behaves as a marker click. Layer: view.

## Risks / Trade-offs

- None.

## Open Questions

- None.
