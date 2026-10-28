## Context

See proposal.md. The document keydown listener in `App` handles Escape and ignores fields; the rig owns the controls, the clamp and `minZoom`; a counter prop already carries fit requests.

## Goals / Non-Goals

**Goals:**
- A request prop, applied by the rig with the same clamp as a drag.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `nudge` prop
`TableProps.nudge?: { dx: number; dy: number; zoom: number; key: number }` with dx, dy as fractions of the view and zoom as a factor (1.25 or 0.8); `App` sets it from the keys. Layer: view.

### D2. Applied by the rig
An effect keyed on `nudge.key` moves the controls' target and camera by the fraction of the current view size, multiplies `camera.zoom` within `[minZoom, minZoom * 10]`, updates the projection, then clamps. Reduced motion is moot: the step is instant either way. Layer: view.

## Risks / Trade-offs

- Arrow keys inside selects and inputs are left to them → the listener already skips fields.

## Open Questions

- None.
