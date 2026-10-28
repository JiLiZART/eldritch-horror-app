## Context

See proposal.md. `App.tsx` owns `selected` and `route`; `select(undefined)` clears the selection outside route mode; the Turn panel's Cancel calls `onRoute(undefined)`.

## Goals / Non-Goals

**Goals:**
- One listener, the existing handlers.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Document keydown
An effect in `App` adds a `keydown` listener: on `Escape`, if a route is being picked `setRoute(undefined)` and restore the active investigator's space as selected, else `setSelected(undefined)`; keys typed in inputs and selects are ignored so form editing keeps its own Escape. Layer: view.
- Rejected: a listener on the canvas only. The canvas rarely holds keyboard focus; the panel does.

## Risks / Trade-offs

- None.

## Open Questions

- None.
