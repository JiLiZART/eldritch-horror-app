## Context

See proposal.md. `App` keeps the fit counter and passes it to the table; the canvas has `onPointerMissed` for empty-table clicks.

## Goals / Non-Goals

**Goals:**
- Reuse the fit counter.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `onFit` prop
`TableProps.onFit: () => void`; the `Canvas` gets `onDoubleClick` on its wrapper that calls it when the pointer missed every object on the second click, tracked by `onPointerMissed` setting a flag the double-click reads. Layer: view.

## Risks / Trade-offs

- A double-click on a marker selects twice → harmless.

## Open Questions

- None.
