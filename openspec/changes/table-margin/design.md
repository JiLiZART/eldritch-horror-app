## Context

See proposal.md. `tableExtent` returns the tight rectangle; the rig fits the zoom-out limit to it and clamps the view inside it.

## Goals / Non-Goals

**Goals:**
- One constant, applied once.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Pad in `tableExtent`
`TABLE_MARGIN = 0.3`, subtracted from `minX`/`minY` and added to `maxX`/`maxY` before returning; the existing tests compare against the padded values. Layer: 2D geometry.
- Rejected: padding in the rig's clamp. The extent is the one definition of the table; the fit should see the same rectangle as the clamp.

## Risks / Trade-offs

- The fitted board shrinks by the margin → under three percent.

## Open Questions

- None.
