## Context

See proposal.md. `SlotInfo.savedAt` is milliseconds since the epoch, rewritten on every save; `NewGame` maps `slots` in index order.

## Goals / Non-Goals

**Goals:**
- Sort and format in the panel; the index is untouched.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Sort and date in the panel
`NewGame` lists `[...slots].sort((a, b) => b.savedAt - a.savedAt)` and shows `new Date(savedAt).toLocaleString(lang)` in a `<time>` element after the name. Layer: panel.

## Risks / Trade-offs

- None.

## Open Questions

- None.
