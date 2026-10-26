## Context

See proposal.md. `endTurn` (`src/engine/actions.ts`) rolls the round over directly. `setupGame` spawns gates, monsters and clues inline. Mythos cards (`content/sets/eh01/mythos.json`) are generated from the Tabletop Playground mod and carry only name, colour, difficulty and images; their icon rows exist only in the card art. Gate tokens are images without a colour field. The panel keeps the omen track order in a local constant.

## Goals / Non-Goals

**Goals:**
- Every icon that is purely mechanical resolves in the engine with a test per rule; everything else is logged for the players, never silently dropped.
- Spawning gates, monsters and clues has one implementation shared by setup and the Mythos phase.

**Non-Goals:**
- Card text, rumor tokens, eldritch tokens, reckoning effects, awakening, encounters (see proposal).

## Decisions

### D1. Hand-typed card data lives in a script table
`scripts/mythos-effects.ts` exports `{ [cardId]: { trait, effects } }` typed from `content/rules/enums.json` (`mythosTraits`, `mythosEffects`); `copy-core-assets.ts` merges it into `mythos.json`, failing on a card without an entry. The validator checks ids. Layer: content.
- Rejected: OCR or reading the mod's scripts. The mod has no icon data; OCR on icons is unreliable. 51 cards by eye is one sitting.
- Rejected: a separate `mythos-effects.json` under `content/`. Two files for one card invite drift; the generated file stays the single source the app reads.

### D2. Gate colour is a board space field
`Space.gate?: OmenColor` (`OmenColor = "green" | "blue" | "red"`) on the 9 named core cities; `setupGame` builds the gate stack from spaces with `gate` set instead of `number === undefined`. The omen track `["green", "blue", "red", "blue"]` moves to `src/engine/omen.ts` as `OMEN_TRACK`; the panel imports it. Layer: content and game state.
- Rejected: a `gates.json` per set. Gate tokens are one per city and never vary by set; the space already names the city.

### D3. Phase union grows: `mythos` and `lost`
`phase` becomes `ActionPhase | { name: "mythos"; card: string; log?: string[] } | { name: "lost"; reason: string }`. `GameState` gains `ongoingMythos: string[]` and `mythosDiscard: string[]`. `endTurn` after the last seat shifts the top mythos card into the phase, or sets `lost` when the deck is empty. Layer: game state.
- Rejected: resolving the card inside `endTurn`. The players must see the card before the board changes, and the log must sit next to it.

### D4. Three steps: draw, resolve, next round
`resolveMythos(state, content)` applies the icons and fills `log`, refusing a second call; `nextRound(state, lead?)` requires a resolved mythos phase, optionally moves the lead token to another investigator, then sets `round + 1`, Action phase, lead active. Layer: engine, `src/engine/mythos.ts`.
- Rejected: a separate `passLead` action. The rule allows passing only at the end of the Mythos phase; a parameter on `nextRound` cannot be called at the wrong time.

### D5. Shared spawn helpers
`src/engine/spawn.ts`: `spawnGate(state, set, random)` (reshuffles the gate discard into the stack when empty, advances doom when both are empty, then spawns 1 monster), `spawnMonster(state, set, space)` (top of the cup, honours `spawnMoveTo`, logs when the cup is empty), `spawnClue(state, random)` (reshuffles the clue discard when the pool is empty). `setupGame` is refactored onto them; its tests pin the behaviour. Randomness for reshuffles uses `rng(state.seed * 31 + state.round)` so a replay from the seed is deterministic. Layer: engine.
- Rejected: keeping the mythos-phase copies separate from setup. Two gate-spawn implementations would drift on the "no token left" rule.

### D6. Mythos section is a 2D panel block
`Mythos.tsx`: card image, Resolve button, log list, lead `<select>` and Next round button, replacing `Turn` while the phase is `mythos`; a `lost` phase shows the reason and only Abandon. Ongoing cards render as images in `Status`; doom 0 adds the awakening note. 3D: no new table elements; spawned pieces appear through the existing `piecesOnSpace`. Layer: view.
- Rejected: animating spawns on the table. Nice later; the log carries the information today.

## Risks / Trade-offs

- Hand-typed icon rows can carry a misread; the validator cannot catch a wrong but legal sequence. Mitigation: the table cites each card by name and the review task spot-checks 10 cards against the images.
- Gate colours were read from token images; a wrong colour changes doom pacing. Mitigation: colours listed in the board-graph scenario and checked once against the printed track.
- `GameState` keeps growing; still plain JSON.

## Open Questions

- None.
