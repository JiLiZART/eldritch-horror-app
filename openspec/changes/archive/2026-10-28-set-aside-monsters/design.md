## Context

See proposal.md. `setAsideMonsters` holds the tokens setup removed from the cup; `spawnMonster` draws from the cup and honours `spawnMoveTo`; `toCup` in `encounter.ts` takes every returning token to the cup, from `settle`, `returnAmbushers` and `discardMonster`.

## Goals / Non-Goals

**Goals:**
- One flag on the token, one spawn effect, one branch in the shared return.

**Non-Goals:**
- Named cup spawns (see proposal).

## Decisions

### D1. `setAside?: true` on `MonsterOnBoard`
Set by the spawn, read by the return. Layer: game state.
- Rejected: looking the kind up on the Ancient One sheet at return time. Shub-Niggurath sets aside two of the five Ghouls; the other three belong to the cup.

### D2. `spawnSetAside(state, content, id, monsterId, space)` in `effects.ts`
Behind `subject`; takes the first `setAsideMonsters` token of `monsterId`, refusing "no Deep One is set aside"; places it on `spawnMoveTo ?? space` with `health: 0, setAside: true`; logs "Deep One spawns from the set-aside pile on X". Layer: engine.

### D3. `toCup` splits by the flag
Tokens with `setAside` go to `setAsideMonsters`, the rest are reshuffled into the cup as today; the log lines read "is set aside again" where they read "returns to the cup". Layer: engine.

### D4. Panel
`Effects.tsx` Board group: a select of set-aside kinds ("Deep One (1)") and Spawn set-aside on the chosen space; `Status` sizes gain "set aside N". Layer: view.

## Risks / Trade-offs

- A set-aside token moved off the board by Discard then spawned again keeps working, since the pile is the source both times.

## Open Questions

- None.
