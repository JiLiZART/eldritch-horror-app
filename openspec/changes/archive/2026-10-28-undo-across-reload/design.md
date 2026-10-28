## Context

See proposal.md. `App.tsx` keeps `history: GameState[]` and saves `game.state` to the slot in an effect; `saved.ts` owns the storage keys.

## Goals / Non-Goals

**Goals:**
- Undo after reload for the last ten steps, with the slot API as the single owner of storage.

**Non-Goals:**
- Redo, file export (see proposal).

## Decisions

### D1. Separate key, bounded
`saveGame(storage, id, state, name, history)` writes `history.slice(-10)` to `eldritch-horror.history.<id>`; `loadGame` returns `{ state, history }` (an unreadable history is an empty one, never a note); `removeGame` removes the key. Layer: persistence.
- Rejected: history inside the game key. The downloaded file reuses that JSON and must stay a single state.

### D2. App seeds from the slot
`history` state initialises and resets from `loadGame`'s history on load and switch; `openNew` and a loaded file start empty. The save effect passes the current history. Layer: view.

## Risks / Trade-offs

- Ten states per slot multiply storage use → each state is tens of kilobytes; ten of them stay far under the browser's quota per origin.

## Open Questions

- None.
