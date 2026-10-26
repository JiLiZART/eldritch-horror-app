## Why

Rounds now roll straight from one Action phase into the next, so doom never moves, gates never open and the mythos deck is never drawn: the game cannot be lost and nothing pushes back. The Mythos phase is the game's clock (`inspired/manual_eng.pdf` p.3 "3. Mythos Phase") and its icon effects are fully mechanical, so it is the next slice that makes the board change between turns. Encounters stay skipped; mythos card text stays with the players.

## What Changes

- Mythos cards carry a hand-typed trait (event or ongoing; rumor cards are ongoing) and the printed icon sequence (advance omen, reckoning, spawn gates, monster surge, spawn clues, place rumor, place eldritch tokens, resolve text), read from the 51 core card images. Gate tokens carry their omen colour.
- Ending the last seat's turn draws the top mythos card into a Mythos phase; an empty deck loses the game (`manual_eng.pdf` p.4).
- Resolving the card applies its icons in printed order as engine rules: advance omen then doom per matching gate; spawn gates with a monster each, doom instead when no gate token is left; monster surge at matching gates or 1 gate when none; spawn clues (`manual_eng.pdf` p.3–4; `EH_reference.pdf` p.3, p.4, p.6, p.13). Ongoing cards stay in play; events are discarded. The lead may then pass the lead token and the next round begins.
- The panel shows the drawn card, a resolution log, the ongoing cards and the mythos deck size.
- **Deviations**: reckoning resolves nothing because no component in play carries a modelled reckoning effect; rumor tokens, eldritch tokens, card text and monster "when spawned" effects are shown on the card for the players to apply by hand; the Encounter phase is still skipped; doom reaching 0 is shown but the Ancient One does not awaken.
- Non-goals: encounter phase, awakening, mystery progress, reckoning effects on monsters or conditions, monster movement, card text effects, expansion mythos cards.

## Capabilities

### New Capabilities
- `mythos-phase`: drawing and resolving a mythos card, the loss on an empty deck, passing the lead token, and what the players see.

### Modified Capabilities
- `content-schema`: mythos cards carry trait and icon effects, validated against the rules enums.
- `board-graph`: named cities carry the omen colour printed on their gate token.
- `action-phase`: the last seat's end of turn opens the Mythos phase instead of the next round.

## Impact

- `content/board/board.json` gains `gate` on 9 cities; `content/sets/eh01/mythos.json` gains `trait` and `effects` from a hand-typed table in `scripts/`; validator checks both.
- `src/engine/types.ts`: phase union gains `mythos` and `lost`; state gains `ongoingMythos`, `mythosDiscard`. New `src/engine/mythos.ts`; shared spawn helpers extracted from `setup.ts` into `src/engine/spawn.ts`.
- `src/table/`: Mythos section in the panel; omen track constant moves to the engine.
- `content/rules/glossary.md`: no new terms (Mythos card, Omen, Gate, Monster surge, Clue exist).
