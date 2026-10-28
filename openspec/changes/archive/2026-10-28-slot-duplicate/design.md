## Context

See proposal.md. `loadGame` returns state and history; `saveGame` writes a slot with a name and history; `renameGame` sets a title; `App` switches slots through `onSwitch`.

## Goals / Non-Goals

**Goals:**
- Compose the existing slot functions; no new storage shape.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `duplicateGame(storage, id)`
Loads the slot, saves it under `newSlotId()` with the same derived name and history, copies the title with " (copy)" appended when one exists, and returns the new id; tested. Layer: persistence.

### D2. The control
A Duplicate button per slot; `App` calls `duplicateGame` then its switch handler with the new id. Layer: panel.

## Risks / Trade-offs

- Twice the storage for the copied slot → tens of kilobytes.

## Open Questions

- None.
