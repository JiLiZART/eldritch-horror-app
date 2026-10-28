## Context

See proposal.md. `Journal` groups entries by round and phrases each with `journalLine`; the space filter sets the pattern.

## Goals / Non-Goals

**Goals:**
- One input, one filter over the phrased lines.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Filter the phrased lines
`useState("")` in `Journal`; entries whose `journalLine` contains the lowercase filter are kept; rounds with no kept line are dropped; the summary count stays the total. Layer: panel.

## Risks / Trade-offs

- None.

## Open Questions

- None.
