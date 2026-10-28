## Context

See proposal.md. `spawnGate(state, content, random)`, `spawnClue(state, content, random)` and `spawnMonster(state, content, space)` in `src/engine/spawn.ts` serve setup and the Mythos phase; the Mythos phase seeds `random` from the round. Card-text effects sit behind `textPhase` in `effects.ts`; `rng(seed * 31 + rolls)` with a bump of `rolls` is the seeded stream the other effects use. `fight` opens a combat against a token on the investigator's space; `settle` ends it; `defeat` relocates the investigator.

## Goals / Non-Goals

**Goals:**
- Reuse the three spawn helpers and the whole fight; add one flag and one clean-up.

**Non-Goals:**
- Named or set-aside monsters, reckoning (see proposal).

## Decisions

### D1. Spawns by text reuse the helpers with the roll stream
`spawnGateByText(state, content)` and `spawnClueByText(state, content)` call the helper with `rng(state.seed * 31 + state.rolls)` and bump `rolls`, so a reshuffle in card text differs from the next one and replays. `spawnMonsterByText(state, content, space)` checks the space and calls `spawnMonster`. All behind `textPhase`. Layer: engine.
- Rejected: reusing the round-seeded stream of the Mythos phase. Two spawns in one round would reshuffle identically.

### D2. `ambush?: true` on the token and `ambush(state, content)`
`ambush` requires the Encounter phase and takes the active investigator; the top cup token is put on their space with `ambush: true`, `health: 0`, ignoring `spawnMoveTo`; then `fight` opens the combat. `settle` returns a surviving ambush token to the cup with "the X returns to the cup after the ambush"; `defeat` returns every ambush token on the board to the cup. Layer: game state and engine.
- Rejected: a fight against a token not in `state.monsters`. `fight`, `continueFight` and the panel all find the target on the board.

### D3. Panel
`Effects.tsx`: Spawn gate, Spawn clue, Spawn monster on the chosen space; Ambush shown in the Encounter phase only, for the encountering investigator. Layer: view.

## Risks / Trade-offs

- An ambush marks the token fought for this encounter; a second ambush draws a new token, so the once-per-encounter rule does not block it.
- `spawnMonster` logs "spawns on X" for an ambush path only if called; the ambush path logs "X ambushes Leo Anderson" itself.

## Open Questions

- None.
