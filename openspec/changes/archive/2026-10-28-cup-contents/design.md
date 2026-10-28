## Context

See proposal.md. `Status` has the Discards fold; the Board effects group counts kinds with `effects.kindCount`; `deck.monsterCup` and `deck.setAside` name the piles.

## Goals / Non-Goals

**Goals:**
- One fold, reuse the kind-count string.

**Non-Goals:**
- See proposal.

## Decisions

### D1. The fold
A `<details>` with `status.cup` as its summary listing `deck.monsterCup` then `deck.setAside`, each with kinds sorted by name as "Name ×n" through `effects.kindCount`; empty piles are left out. Layer: panel and content.

## Risks / Trade-offs

- None.

## Open Questions

- None.
