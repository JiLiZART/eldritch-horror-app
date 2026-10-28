## Context

See proposal.md. Slots are an index plus a game key and a history key each; `parseGame` validates a state's shape and version; files are plain JSON.

## Goals / Non-Goals

**Goals:**
- One JSON document of the slots; restore through the existing slot functions.

**Non-Goals:**
- See proposal.

## Decisions

### D1. The backup shape
`{ backup: 1, slots: [{ name, title?, savedAt, state, history }] }`; `exportAll(storage)` builds it; `importAll(storage, text)` parses, validates each state with `parseGame`, saves each under `newSlotId()` with its name, history and title, keeps `savedAt`, and returns how many were added and how many were set aside; a file that is not a backup is refused with a note. Tested. Layer: persistence.

### D2. Controls
Save backup and Load backup beside Save to file and Load from file; the note after a load reports the counts. Layer: panel.

## Risks / Trade-offs

- Loading the same backup twice doubles the slots → by design; Remove handles it.

## Open Questions

- None.
