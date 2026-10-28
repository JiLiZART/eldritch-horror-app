## Context

See proposal.md. `check(s, ref, where, prev)` runs after every accepted step with the previous state at hand.

## Goals / Non-Goals

**Goals:**
- A handful of assertions beside the journal length check.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Journal bounds
For each entry at index i: `1 <= round <= s.round`, `round >= journal[i-1].round`, `text.length > 0`, and `who`, when present, is an id in `s.investigators`. The first `prev.journal.length` entries equal `prev.journal`. Layer: tests.

## Risks / Trade-offs

- A bound the engine does not keep fails the suite until its change lands → proposed in the same tick, as with the combat floor.

## Open Questions

- None.
