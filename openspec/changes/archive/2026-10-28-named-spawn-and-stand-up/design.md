## Context

See proposal.md. `spawnMonster` draws the top of the cup and honours `spawnMoveTo`; `spawnSetAside` already takes a named token from the set-aside pile. `delay` sets the flag behind `subject`; `endTurn` clears it.

## Goals / Non-Goals

**Goals:**
- Two effects mirroring neighbours that exist; two controls.

**Non-Goals:**
- Spawning by trait (see proposal).

## Decisions

### D1. `spawnNamed(state, content, id, monsterId, space)` in `effects.ts`
Behind `subject`; takes the first cup token of `monsterId`, refusing "no Cultist is in the cup"; places it on `spawnMoveTo ?? space` with `health: 0`; logs "Cultist spawns on X". The cup is not reshuffled: taking a named token from the middle changes nothing about the rest's order. Layer: engine.

### D2. `standUp(state, content, id)` in `effects.ts`
Behind `subject`; refuses "X is not delayed"; clears the flag; logs "X stands up". Layer: engine.

### D3. Panel
`Effects.tsx` Board group: a select of kinds in the cup ("Cultist (6)") and Spawn named on the chosen space; Investigator group: Stand up beside Delay. Layer: view.

## Risks / Trade-offs

- None beyond the ordinary.

## Open Questions

- None.
