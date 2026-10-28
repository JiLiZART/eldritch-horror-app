## Context

See proposal.md. `Roll` has `investigator`, `dice` and `successes`; the Action phase holds `acquiring` and the Encounter phase `combat.roll` while a roll is open; the overlay shows a status line and a journal line.

## Goals / Non-Goals

**Goals:**
- One more optional line, from state the panel already reads.

**Non-Goals:**
- See proposal.

## Decisions

### D1. The dice line
`status.dice?: string` built as `table.roll` ("{name} rolls {dice}") with each die as its number, a 5 or 6 wrapped in brackets to mark the success; the overlay renders it as a third `<small>` line. Layer: view and content.
- Rejected: die glyphs. Numbers read at any size and need no font.

## Risks / Trade-offs

- None.

## Open Questions

- None.
