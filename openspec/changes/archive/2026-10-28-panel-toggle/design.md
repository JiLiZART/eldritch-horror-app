## Context

See proposal.md. `App` renders `.layout` with `main.table` and the `aside` panel; the canvas resizes with its container and the rig refits `minZoom` from the canvas size.

## Goals / Non-Goals

**Goals:**
- One boolean, one class, two strings.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Hidden state in `App`
`useState` read from `localStorage["eh.panel-hidden"]`, written on change (try/catch as the language key). When hidden, `.layout` gets `panel-hidden`, the aside is not rendered, and a small fixed `Show panel` button sits in the top-right corner. The Hide panel button sits in the panel header beside the title, so it is there before a game starts too. Layer: view.
- Rejected: CSS-only collapse keeping the aside mounted. Not rendering it keeps the DOM small and the canvas is the only resize observer.

## Risks / Trade-offs

- Phase controls are in the panel → hiding it hides the game's controls on that screen, which is the point for a display; Show panel brings them back.

## Open Questions

- None.
