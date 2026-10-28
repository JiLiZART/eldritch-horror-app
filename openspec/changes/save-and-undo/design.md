## Context

See proposal.md. `App.tsx` holds `{ state?, error? }` in `useState`; `act` applies an engine function and keeps the old state on a refusal; `start` sets up, `onAbandon` clears. The board language is already remembered in `localStorage` under a key, wrapped in try/catch. `GameState` is JSON-safe by design.

## Goals / Non-Goals

**Goals:**
- Persistence and undo as view state in `App.tsx`; storage access in one small tested module.

**Non-Goals:**
- Several saves, export, undo across reloads (see proposal).

## Decisions

### D1. `saved.ts` wraps the storage
`loadGame(storage)`, `saveGame(storage, state)`, `clearGame(storage)` over a `Pick<Storage, "getItem" | "setItem" | "removeItem">`, key `eldritch-horror.game`; `loadGame` returns `undefined` on a missing or unparsable item or one without a `phase`. Tests pass a `Map`-backed fake. Layer: view (storage adapter).
- Rejected: saving inside the engine. The engine stays pure and storage-free.

### D2. History beside the game state
`App.tsx` keeps `history: GameState[]`; `act` pushes the previous state on success only; `undo` pops it into `game.state`; `start` and resume begin with an empty history; abandon empties it. Layer: view.
- Rejected: an action log replayed from the seed. More code, and card-text steps carry arguments the log would have to serialize.

### D3. Save on every accepted state
A `useEffect` on `game.state` saves it or clears the slot when undefined; the initial `useState` loads the slot. Layer: view.

### D4. Undo in the Game section
`NewGame.tsx` gains `canUndo` and `onUndo`: an Undo button beside Abandon game, disabled when the history is empty. Layer: view.

## Risks / Trade-offs

- A save from an older state shape → `loadGame` only checks for `phase`; a stale field set may throw later in the engine. The player abandons and starts again.
- Storage full or blocked → the try/catch keeps the game playable without a save.

## Open Questions

- None.
