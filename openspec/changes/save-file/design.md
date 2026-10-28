## Context

See proposal.md. `loadGame(storage)` parses the slot and returns `{ state?, note? }`; `App.tsx` keeps the game, the undo history and the slot in step; `NewGame.tsx` shows Abandon and Undo while a game runs and the form otherwise.

## Goals / Non-Goals

**Goals:**
- One parser for the slot and the file; two small controls.

**Non-Goals:**
- Sync or named slots (see proposal).

## Decisions

### D1. `parseGame(text)` and `fileName(state)` in `saved.ts`
`loadGame` becomes `parseGame(storage.getItem(KEY))` with the empty-slot case kept; `parseGame` returns the same `{ state?, note? }`. `fileName` gives `eldritch-horror-<seed>-round-<round>.json`. Layer: view (storage adapter).

### D2. Download through a Blob URL
`NewGame` gets `onSave` which builds a Blob from `JSON.stringify(state)`, clicks a temporary anchor with `download` set to `fileName`, then revokes the URL. Layer: view.
- Rejected: the File System Access API. Not available everywhere; a download is.

### D3. Load through a file input
`NewGame` gets `onLoad(text)`; a `<input type="file" accept=".json">` reads the chosen file with `File.text()` and hands the text over. `App.tsx` runs `parseGame`, and on a state sets the game, clears the history and lets the existing effect save the slot; on a note shows it as the form's error. Layer: view.

## Risks / Trade-offs

- Loading while a game runs replaces it without asking → the slot held the old game until the load; Undo cannot bring it back. The control sits beside Abandon, which is as irreversible, and the proposal says so.

## Open Questions

- None.
