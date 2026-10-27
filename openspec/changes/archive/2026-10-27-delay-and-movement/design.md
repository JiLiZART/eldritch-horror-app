## Context

See proposal.md. Effects live in `src/engine/effects.ts` with a shared `subject` check (phase, standing). `mayAct` in `src/engine/actions.ts` gates every action; `endTurn` passes the seat. `defeat` in `src/engine/encounter.ts` marks the investigator and passes the lead. `distance(board, from, to)` in `src/content/board.ts` counts paths on the shortest route. `pieces.ts` labels pawns for the table; `Status` lists investigators.

## Goals / Non-Goals

**Goals:**
- Delayed and movement reuse the effect gate and log; no new phase or state machine.
- Defeat relocation is one more step of the existing `defeat`.

**Non-Goals:**
- Detained, local paths, replacement investigators (see proposal).

## Decisions

### D1. `delayed?: true` on the investigator
`InvestigatorState.delayed?: true`. `delay(state, content, id)` sets it through `subject`, refusing when already set. `mayAct` throws "a delayed investigator cannot perform actions" when the active investigator is delayed; `endTurn` clears the flag on the active investigator before passing. Layer: game state and engine.
- Rejected: a `taken: ["delayed"]` marker in the Action phase. The flag outlives the phase and the table must show it.

### D2. Movement names the space
`moveInvestigator(state, content, id, space)` checks the space exists on the board, sets `space`, logs "moves to X". No path, ticket or monster check: card text moves regardless. Layer: engine.
- Rejected: computing "nearest city" or "random space" in the engine. The card says which; the players read it.

### D3. Defeat relocates with `distance`
`defeat` sets `space` to the city with the smallest `distance` from the fallen pawn (first in `board.spaces` order on a tie), shuffles `conditions` into `decks.condition` with the seeded reshuffle from effects (moved to a shared helper), and empties `conditions`. Layer: engine.
- Rejected: letting the players move the pawn with the new Move effect. Defeated investigators cannot be affected, so the engine does it.

### D4. Panel and table marks
`Effects.tsx`: a space select (board spaces, English names) with Move, and a Delay button. `Turn.tsx`: when the active investigator is delayed, show "delayed: ending the turn stands the token up" and only End turn. `Status`: "(delayed)". `pieces.ts`: pawn label gains "(delayed)" or "(defeated)"; 3D: label text only, no new table element. Layer: view.
- Rejected: a lying-down pawn mesh. A label is enough until pawns get real models.

## Risks / Trade-offs

- A nearest-city tie is resolved silently → the log names the city; a later change can offer the choice.
- Delayed investigators still Trade as a partner (Trade is the other investigator's action) → correct per the rules; noted so nobody "fixes" it.

## Open Questions

- None.
