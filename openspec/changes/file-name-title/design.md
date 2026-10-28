## Context

See proposal.md. `fileName(state)` builds the download name; the slot index holds `title`; `App.tsx` knows the current slot.

## Goals / Non-Goals

**Goals:**
- One optional argument.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `fileName(state, title?)`
With a non-empty title: the title with runs of characters outside letters, digits, spaces, dots and dashes replaced by a dash, trimmed, plus `.json`; else the seed-and-round name. Tested. Layer: persistence.

## Risks / Trade-offs

- None.

## Open Questions

- None.
