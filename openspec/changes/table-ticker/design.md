## Context

See proposal.md. The Journal in `Panel.tsx` phrases an entry as phase word, investigator name and text; the table overlay shows one status string.

## Goals / Non-Goals

**Goals:**
- Reuse the Journal's phrasing; one more string in the overlay.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Shared phrasing
The entry phrasing moves from `Panel.tsx` into a small exported function `journalLine(entry, set, t)` used by the Journal and by `App.tsx` for the last entry; `TableProps.status` becomes `{ line: string; last?: string }` and the overlay renders the second line smaller. Layer: view.

## Risks / Trade-offs

- None.

## Open Questions

- None.
