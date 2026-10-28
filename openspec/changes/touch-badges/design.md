## Context

See proposal.md. `Pieces`, `Face` and `TrackToken` set a hovered state on pointer over and clear it on pointer out; a touch fires pointer over and out around the tap, so the badge flashes and goes.

## Goals / Non-Goals

**Goals:**
- One helper the three use.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `useBadge` hook
A hook returning `{ shown, handlers }`: `onPointerOver` shows; `onPointerOut` hides unless the pointer was a touch, in which case a two-second timer hides it; `onPointerDown` with `pointerType === "touch"` shows and arms the timer. `Pieces` keeps its single hovered id but applies the same rule. Layer: view.

## Risks / Trade-offs

- A browser check cannot touch; the hook is unit-tested with a fake timer.

## Open Questions

- None.
