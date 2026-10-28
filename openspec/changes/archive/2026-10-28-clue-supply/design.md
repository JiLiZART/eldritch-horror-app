## Context

See proposal.md. `placeInvestigator` in `setup.ts` splices `clues` tokens from the pool into `heldClues` and returns `clues` as the sheet number; set-up never runs short, replacement in a late round can.

## Goals / Non-Goals

**Goals:**
- The investigator's clue count equals the tokens moved, always.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Count what was taken
`const taken = cluePool.splice(0, i.starting.clues ?? 0); heldClues.push(...taken);` and `clues: taken.length`. Layer: engine.
- Rejected: refusing the replacement when the pool is short. The rules replace the investigator regardless; the clue is simply unavailable.

## Risks / Trade-offs

- None beyond a one-token difference in a late-game edge case.

## Open Questions

- None.
