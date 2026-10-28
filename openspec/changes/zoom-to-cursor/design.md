## Context

See proposal.md. drei's MapControls wraps three's OrbitControls, which has `zoomToCursor`; the rig's `onChange` clamps the view after any change.

## Goals / Non-Goals

**Goals:**
- One prop.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `zoomToCursor`
Set `zoomToCursor` on the MapControls element. OrbitControls moves the target along with the zoom so the cursor's world point stays put; the clamp then bounds it. Layer: view.
- Rejected: a custom wheel handler. The controls own the zoom; duplicating it invites drift.

## Risks / Trade-offs

- A zoom near the table's edge is pulled back by the clamp → the cursor point drifts only as far as the margin demands.

## Open Questions

- None.
