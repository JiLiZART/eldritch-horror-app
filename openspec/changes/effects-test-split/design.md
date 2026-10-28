## Context

See proposal.md. Each describe imports effects from the `effects.ts` barrel; the modules behind it are `shared`, `investigator`, `cards`, `board`, `monsters`.

## Goals / Non-Goals

**Goals:**
- Same tests, four or five files, one fixture module.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Placement by import
A describe goes to the module that exports the effect it calls (`changeHealth` to `investigator`, `discardOngoing` to `cards`, `spawnNamed` to `board`, `moveMonster` to `monsters`); a describe spanning two modules goes with the first effect it calls. The fixture module exports the content, the `game()` builder and the helpers the describes share. Layer: tests.
- Rejected: one test file per effect. Dozens of tiny files for a 500-line suite.

## Risks / Trade-offs

- A moved test that silently depended on another describe's mutation of a shared fixture would fail → each describe builds its own state from `game()` today; the move keeps that.

## Open Questions

- None.
