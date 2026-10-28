## Context

See proposal.md. `CameraRig` derives `minZoom` from `boardSize`; the glide moves `controls.target` and the camera together; MapControls fires `change` on every pan or zoom and has no pan bounds of its own.

## Goals / Non-Goals

**Goals:**
- One rectangle, the table, drives both the zoom-out limit and the pan bounds.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `tableExtent(board, withTableau)` in `geometry.ts`
Returns `{ minX, maxX, minY, maxY }`: the board's rectangle, extended right to the tableau column's far edge when `withTableau`. Pure, tested. Layer: 2D geometry.

### D2. Clamp in the rig
`minZoom` fits the extent. A `clamp()` moves `controls.target` (and the camera by the same delta) so the half view, `size / (2 * camera.zoom)`, stays inside the extent on each axis; when the view is wider than the extent on an axis, the target sits at the extent's centre. It runs in MapControls' `onChange` and after each glide step. Layer: view.
- Rejected: clamping the camera position only. MapControls derives panning from the target, so both must move together.

## Risks / Trade-offs

- `onChange` fires each frame during damping → the clamp is a few comparisons, negligible.

## Open Questions

- None.
