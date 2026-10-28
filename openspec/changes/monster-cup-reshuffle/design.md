## Context

See proposal.md. `reshuffle(state, items)` in `src/engine/rng.ts` shuffles from the seed and bumps `rolls`; the clue and gate helpers and the discards use it. The three cup returns append to `monsterCup`: `settle` and `returnAmbushers` in `encounter.ts`, `discardMonster` in `effects.ts`.

## Goals / Non-Goals

**Goals:**
- One `toCup(state, tokens)` helper used by the three sites; no new state.

**Non-Goals:**
- Set-aside monsters (see proposal).

## Decisions

### D1. `toCup(state, tokens)` in `encounter.ts`
Returns the state with `monsterCup` reshuffled from `[...monsterCup, ...tokens]` and `rolls` bumped; exported for `effects.ts`. The three sites call it in place of the append. Layer: engine.
- Rejected: shuffling only at the next spawn. The physical cup is shuffled at the return, and spawns in the same step must see it.

## Risks / Trade-offs

- Each return bumps `rolls`, so dice after a monster's return differ from games played before this change; the seed still replays.
- The combat tests search seeds for given successes before the return happens, so they are unaffected.

## Open Questions

- None.
