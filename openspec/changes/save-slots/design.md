## Context

See proposal.md. `saved.ts` reads and writes one key through `parseGame`; `App.tsx` loads it on start, saves on every state and clears on abandon; the Game section shows Abandon, Undo, Save to file and Load from file while a game runs and the form otherwise.

## Goals / Non-Goals

**Goals:**
- Slots as a small index plus per-slot keys; the old behaviour kept for a single slot.

**Non-Goals:**
- Renaming, sync (see proposal).

## Decisions

### D1. Keys
`eldritch-horror.games` holds `{ current: id, slots: [{ id, name, savedAt }] }`; each game lives under `eldritch-horror.game.<id>`; a value under the old `eldritch-horror.game` key is moved into a new slot on first load. `saved.ts` exposes `loadSlots`, `loadGame(id)`, `saveGame(id, state)`, `removeGame(id)`, `newSlotId()`, `slotName(state)`. Layer: view (storage adapter), tested on a fake storage.

### D2. The current slot is view state
`App.tsx` keeps `slot: string | undefined` with the game; start and file load create a slot; a step saves to it and refreshes its name and time; abandon removes it; switching loads another slot and clears the undo history. Layer: view.

### D3. Games list
`NewGame.tsx` gets `slots`, `current`, `onSwitch(id)`, `onRemove(id)`: a select of the other slots with Switch and Remove, shown whenever any slot exists; New game (the form) always creates a fresh slot. Layer: view.
- Rejected: a confirmation on Remove. Abandon has none; the slot can be saved to a file first.

## Risks / Trade-offs

- Several slots of 60 KB each in `localStorage` → well under the usual 5 MB.

## Open Questions

- None.
