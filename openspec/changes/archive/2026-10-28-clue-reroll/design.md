## Context

See proposal.md. `test` in `src/engine/test.ts` rolls from `seed` and `rolls` and returns `{ state, dice, successes }`. `acquireAssets` stores the roll as `ActionPhase.acquiring` and `takeAssets` reads `successes`. `fight` in `encounter.ts` rolls Will and Strength in one call and applies both. Clues are `InvestigatorState.clues`. The panel shows the Acquire dice in `Acquire.tsx`; the Encounter panel lists monsters with a Fight button.

## Goals / Non-Goals

**Goals:**
- One waiting-roll shape shared by Acquire and combat; one reroll function.

**Non-Goals:**
- Rerolls from focus tokens or possessions; tests inside card text (see proposal).

## Decisions

### D1. `Roll` is the waiting shape
`export interface Roll { investigator: string; dice: number[]; successes: number }` in `test.ts`; `test` returns it inside `TestResult`. `ActionPhase.acquiring` becomes a `Roll`. `EncounterPhase.combat?: { monster: MonsterInstance; step: "will" | "strength"; roll: Roll }`. Layer: game state.
- Rejected: a top-level `pendingRoll` on `GameState`. Each phase already owns its waiting state and the panel renders by phase.

### D2. `rerollDie(state, set, die)` finds the waiting roll by phase
Reads `phase.acquiring` or `phase.combat.roll`, refusing "no roll is waiting"; refuses "a reroll costs 1 clue" when the roller holds none; spends the clue, rolls one face from `rng(seed * 31 + rolls)`, bumps `rolls`, replaces `dice[die]`, recounts `successes`, writes the roll back. In the Encounter phase it logs "X rerolls die N: a b c". Layer: engine.
- Rejected: a reroll inside `test` with a count. The player chooses the die after seeing the faces.

### D3. Combat in steps
`fight` keeps its checks and the "fights the Y" line, marks the monster fought, then: Will printed → roll and set `combat = { monster, step: "will", roll }`; else Strength printed → roll with `step: "strength"`; else finish. `continueFight(state, content)`: Will step → log the dice and loss, apply sanity, defeat check, then roll Strength or finish; Strength step → log, apply health and monster loss, defeat check, finish (defeat or cup as today). `drawEncounter`, `finishEncounter` and a second `fight` refuse "the fight is not over" while `combat` is set. The existing tests drive `fight` then `continueFight` until `combat` clears through a small helper. Layer: engine.
- Rejected: keeping a one-call `fight` and reopening the dice afterwards. The rules reroll before losses are taken; a loss already applied cannot be undone cleanly, especially a defeat.

### D4. Shared `Dice` view with Reroll
`src/table/Dice.tsx`: faces as today in `Acquire.tsx`, successes marked, a "Reroll (1 clue)" button per die enabled while the roller holds a clue. `Acquire.tsx` uses it above the Take form; `Encounter.tsx` renders it with a Continue button when `phase.combat` is set and hides Fight and Draw meanwhile. 2D panel only. Layer: view.
- Rejected: 3D dice on the table. Faces beside the board are enough until the table gets physics.

## Risks / Trade-offs

- Every reroll bumps `rolls` → later dice differ from games played before this change; intended, the seed still replays.
- `combat` on the phase is cleared by `advance` and by defeat → a defeat mid-fight never leaves a stale roll.

## Open Questions

- None.
