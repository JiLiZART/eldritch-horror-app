## Context

See proposal.md. The `storage` listener in `App` reloads the slot on its game key; `loadSlots` reads the index; the index key is `eldritch-horror.games`.

## Goals / Non-Goals

**Goals:**
- One more key in the same listener.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Follow the index
On the index key: `setSlots(loadSlots(localStorage))`; if the window's slot is no longer listed, leave the game as the Abandon path does. The index key is exported from `saved.ts` beside the game key. Layer: view.

## Risks / Trade-offs

- None.

## Open Questions

- None.
