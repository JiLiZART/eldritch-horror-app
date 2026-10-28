## Context

See proposal.md. Doom changes in three places: `advanceOmen` in `src/engine/mythos.ts`, `spawnGate` in `spawn.ts` (no gate token left) and `defeat` in `encounter.ts`. Card text effects sit behind `textPhase` in `effects.ts`. `Phase` has `LostPhase`; `App.tsx` renders it. `AncientOne.images.back` is the sheet back; `decks.mystery` and `currentMystery` exist since setup.

## Goals / Non-Goals

**Goals:**
- One awakening check shared by every doom site; mysteries and victory as plain card-text effects.

**Non-Goals:**
- Reading any sheet or mystery text; replacement investigators (see proposal).

## Decisions

### D1. `awakenAt0(state, content)` after every doom change
New `src/engine/ancientOne.ts`. `awakenAt0` returns the state unchanged unless `doom <= 0` and not `awakened`; then sets `awakened: true` and logs via `note` "the Ancient One awakens: the Awakens effects, the reckoning and the losing condition on the sheet back are left to the players". The three doom sites call it. Layer: engine.
- Rejected: checking at phase transitions. The rules say "immediately"; a defeat in the Encounter phase would show doom 0 with a sleeping Ancient One for a whole phase.

### D2. `changeDoom(state, content, delta)` as card text
Behind `textPhase`; refuses below 0 ("doom cannot advance past 0") and above `ancientOne.doom` ("doom cannot retreat past the start of the track"); logs "doom N"; calls `awakenAt0`. Layer: engine.
- Rejected: free doom edits in the Status panel. Card text has a phase; the Status table is read-only by design.

### D3. Mysteries as a solved pile and a flag
`GameState.solvedMysteries: string[]` (newest first), `finalMysterySolved?: true`. `solveMystery(state, content)`: behind `textPhase`, moves `currentMystery` to the pile, draws the next from `decks.mystery` (refusing "the mystery deck is empty"), logs "X is solved", then `checkWin`. `solveFinalMystery` refuses unless `awakened`, sets the flag, logs, then `checkWin`. `checkWin` sets `phase: { name: "won", reason }` when `solvedMysteries.length >= 3 && (!awakened || finalMysterySolved)`. `WonPhase` joins `Phase`. Layer: game state and engine.
- Rejected: a counter instead of ids. The pile names what was solved and keeps the deck reproducible.
- Rejected: the final mystery as a fourth card in the deck. It lives on the sheet back and can be solved before the third mystery.

### D4. Panel: controls in Effects, marks in Status, won in App
`Effects.tsx` gains a row: Advance doom, Retreat doom, Solve mystery, Solve final mystery (only when awakened). `Status`: header "Azathoth (awakened)", sheet back image under the mystery when awakened, "N solved" beside the mystery; the "not modelled" note goes. `App.tsx`: a `won` section mirroring the `lost` one. 2D panel only; nothing on the table. Layer: view.
- Rejected: a sheet model on the 3D table. The sheet lives beside the board in the physical game too.

## Risks / Trade-offs

- Every `awakenAt0` call logs through `note`, which needs the Encounter or Mythos phase → the three doom sites are in those phases; `changeDoom` is gated to them.
- A won or lost phase blocks every action → already true for `lost`; the same type guard covers `won`.

## Open Questions

- None.
