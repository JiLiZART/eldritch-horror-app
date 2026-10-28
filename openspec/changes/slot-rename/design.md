## Context

See proposal.md. `SlotInfo` is `{ id, name, savedAt }` in the index; `saveGame` rewrites the entry with the derived name on every step; `NewGame` lists slots with Switch and Remove.

## Goals / Non-Goals

**Goals:**
- One optional field that survives the derived name's rewrites.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `title` beside `name`
`SlotInfo.title?: string`; `saveGame` copies the existing entry's `title` into the rewritten entry; `renameGame(storage, id, title)` sets or clears it; the list shows `title ?? name`. Tests in `saved.test.ts` cover the rename surviving a save and clearing. Layer: persistence.
- Rejected: replacing `name`. The derived name still tells round and seed when no title is given.

### D2. The field
An `<input>` per slot with the current title, applying on change (debounced by React's event batching is enough; each keystroke writes the index), labelled `game.rename`. Layer: panel.

## Risks / Trade-offs

- Writing the index per keystroke → a few hundred bytes each; fine.

## Open Questions

- None.
