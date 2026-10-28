## Context

See proposal.md. `saveGame` writes `eldritch-horror.game.<id>` and the index; browsers fire `storage` on every other window of the origin; `loadGame(storage, id)` returns the state and history.

## Goals / Non-Goals

**Goals:**
- One listener keyed on the slot in play.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Follow the slot's key
An effect in `App` keyed on `slot` adds a `storage` listener: when `e.key` is the slot's game key, `loadGame` the slot and set the game state and history from it, without touching the route or the selection. A window with no slot ignores events. Layer: view.
- Rejected: BroadcastChannel. The storage event carries the same signal with no extra protocol.

## Risks / Trade-offs

- The saving window also receives its own write back? No: browsers fire `storage` only in other windows.

## Open Questions

- None.
