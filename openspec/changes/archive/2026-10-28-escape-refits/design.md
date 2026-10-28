## Context

See proposal.md. `App` keeps the card focus request and the fit counter; a fit outranks the focus in `Scene`; the Escape handler clears the route or the selection.

## Goals / Non-Goals

**Goals:**
- One more branch, first in line.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Focus first
The Escape handler, before the route and selection branches: if a card focus is set and no fit has followed it, bump the fit counter and clear the stored focus; otherwise fall through. A focus made by clicking a face on the table is held in `Scene`, so `App` also passes the fit, which outranks it there. Layer: view.

## Risks / Trade-offs

- A card focused by a table click, then Escape → `App` has no focus record, so it clears the selection instead; the fit key path is extended so `Scene` reports a focus up through a callback. If that proves heavy, the task notes it.

## Open Questions

- None.
