## Context

See proposal.md. `CameraRig` glides `controls.target` to a `[x, y]` target once per change (camera-release) and clamps the view (pan-clamp); `Face` draws every card on the table; the pointer-missed handler clears the space selection.

## Goals / Non-Goals

**Goals:**
- One glide, now with a zoom goal, reused for spaces and cards.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Focus state in `Scene`
`useState<{ position: [number, number]; height: number; key: number }>()` set by `Face`'s `onClick` (with `stopPropagation`, so the pointer-missed handler does not clear the space); `key` increments per click so clicking the same card again glides back. The rig gets `target` from the focus when set, else from the selection; a new selection clears the focus. Layer: view.

### D2. Zoom in the glide
The rig's target gains an optional `zoom`: `size.height / (height * 1.2)` for a card, clamped to `[minZoom, maxZoom]`; the glide eases `camera.zoom` toward it with the same step as the position and calls `updateProjectionMatrix`; reduced motion lands in one step. A space target carries no zoom, so the zoom is left alone as today. Layer: view.
- Rejected: an `Html` overlay enlarging the card. A second rendering path for the same image; the camera already does it.

## Risks / Trade-offs

- A clicked card near the table's edge is clamped off-centre → the clamp keeps the card in view; fine.

## Open Questions

- None.
