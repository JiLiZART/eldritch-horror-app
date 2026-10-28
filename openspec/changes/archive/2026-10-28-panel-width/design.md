## Context

See proposal.md. `.layout` is a grid of `1fr 24rem`; the canvas resizes with its container; the panel-hidden choice is remembered the same way.

## Goals / Non-Goals

**Goals:**
- One number in state and storage; CSS does the layout.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Width in state and a CSS variable
`useState` from `localStorage["eh.panel-width"]` (pixels), written on change; `.layout` gets `style={{ "--panel-width": ... }}` and the grid column reads `var(--panel-width, 24rem)`. Layer: view.

### D2. The handle
A `div.panel-handle` at the panel's left edge with `onPointerDown` capturing the pointer; `onPointerMove` sets the width to `window.innerWidth - clientX`, clamped to `[256, innerWidth / 2]`; `onPointerUp` releases. `role="separator"` with an accessible name. Layer: view.

## Risks / Trade-offs

- A remembered width wider than a smaller window → the clamp applies on load too.

## Open Questions

- None.
