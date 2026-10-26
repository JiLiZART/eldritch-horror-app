## Context

See proposal.md. `endTurn` (`src/engine/actions.ts`) calls `drawMythos` after the last seat. `test()` (`src/engine/test.ts`) rolls seeded dice from `state.rolls`. Monsters on the board are `{ id, instance, space }` with no health; `monsters.json` carries only name, epic flag, count and `spawnMoveTo`; the token backs exist as images. Encounter decks are shuffled id lists under `decks.encounters` and `decks.research`, with no discards. The active expedition space is derived in `setupGame` from the top expedition card's name. The Mythos panel's lead select lists every investigator.

## Goals / Non-Goals

**Goals:**
- Every number on a monster token resolves in the engine; every text line is left to the players and said so.
- Defeat is one function any later effect (encounter text applied by hand, reckoning) can call.

**Non-Goals:**
- Replacement investigators, pawn relocation on defeat, rumor and special encounters, ambushes, epic toughness formulas (see proposal).

## Decisions

### D1. Hand-typed monster backs live in a script table
`scripts/monster-stats.ts` exports `{ [monsterId]: Monster["combat"] }` with `combat: { will?: { modifier: number; horror: number }; strength?: { modifier: number; damage: number }; toughness?: number }`; a missing `will` or `strength` means the token prints no such test, a missing `toughness` means a formula (epic only). `copy-core-assets.ts` merges it into `monsters.json`, failing on a monster without an entry. The validator requires a toughness and at least one test on every non-epic monster. Layer: content.
- Rejected: reading the Tabletop Playground mod's monster scripts. The mod stores token art only, as it did for mythos cards.

### D2. Encounter phase is a phase record with a log
`phase` gains `{ name: "encounter"; active: string; log: string[]; card?: { deck: string; id: string } }`. `endTurn` after the last seat calls `startEncounters(state)` instead of `drawMythos`; `finishEncounter` moves to the next standing seat clockwise or, after the last, calls `drawMythos`. `MonsterOnBoard` gains `health: number` (lost health, 0 at spawn). Layer: game state.
- Rejected: resolving encounters inside the Mythos phase record. The players act in this phase; it needs its own active investigator and log.

### D3. Three engine steps: fight, draw, finish
`src/engine/encounter.ts`: `fight(state, content, monster)` checks space and non-epic-first, runs the Will and Strength tests through `test()`, applies losses, appends log lines in rule words, defeats the monster at toughness (removed from the board, non-epic pushed back into the cup) and calls `defeat` when the investigator hits 0. `drawEncounter(state, content, deck)` checks no monster remains, no card is showing, and the deck is allowed for the space (`region`, `general`, `research` with a clue, `other-world` with a gate, `expedition` on `activeExpedition`), then shifts the top card into `phase.card`. `finishEncounter(state, content)` refuses with a monster still there, discards the card to `discards.encounters[deck]` (new `GameState.discards: { encounters: Record<string, string[]> }`, research included under `"research"`), moves the expedition token when the deck was `expedition` (helper extracted from `setupGame`), then advances. Layer: engine.
- Rejected: one `encounter(state, choice)` call. The player decides the fight order and reads the card between steps.
- Rejected: letting the combat tests be injected. Tests search for a seed that yields the wanted successes, as the mythos tests do; the engine keeps one dice path.

### D4. Defeat is a shared function
`defeat(state, investigatorId, cause: "health" | "sanity")` in `src/engine/encounter.ts`: sets `InvestigatorState.defeated = cause`, advances doom by 1 (existing doom helper), passes the lead to the next standing seat when needed, and sets `lost` when no investigator stands. `endTurn`, `startEncounters`, `finishEncounter` and `nextRound` skip defeated investigators; the Mythos lead select lists standing ones only. Layer: game state and engine.
- Rejected: removing the defeated investigator from `investigators`. Their possessions and position still matter for the replacement rule later, and the panel should show them.

### D5. Panel: Encounter section, 2D, health on pieces
`src/table/Encounter.tsx` replaces `Turn` while the phase is `encounter`: heading, the active investigator, each monster on the space as its back image with a Fight button and lost health, the log, one button per allowed deck, the drawn card image, Finish. Defeated investigators show "defeated (health|sanity)" in `Status`. `pieces.ts` passes the monster's lost health so the table marker shows a count. 3D: no new table elements. Layer: view.
- Rejected: a separate combat modal. The log pattern from the Mythos panel already fits.

## Risks / Trade-offs

- A misread token value changes a fight's maths → the table cites each monster; a review task spot-checks 10 tokens against the images.
- Expedition token movement reads the next card's name as setup does → the same helper, one place to fix.
- Encounter decks can run out in a long game → the draw refuses with "the deck is empty" and the player picks another allowed deck; reshuffling discards is a later rule.

## Open Questions

- None.
