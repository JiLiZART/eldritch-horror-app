## Context

See proposal.md. `Panel` renders `spaces` as buttons named by `useSpaceName()`; the panel's strings are parity-checked.

## Goals / Non-Goals

**Goals:**
- One input, one filter.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Local filter state
`useState("")` in `Panel`; the list maps `spaces.filter((s) => spaceName(board, s.id).toLocaleLowerCase().includes(filter.toLocaleLowerCase()))`; an `<input type="search">` labelled by `panel.filterSpaces`. Escape inside the field keeps its native clear (the document listener ignores inputs). Layer: panel.

## Risks / Trade-offs

- None.

## Open Questions

- None.
