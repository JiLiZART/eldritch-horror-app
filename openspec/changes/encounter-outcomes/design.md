## Context

See proposal.md. `defeat` (`src/engine/encounter.ts`) handles doom, lead and the lost game for any cause. `note` (`src/engine/spawn.ts`) appends to the Mythos log only; the Encounter phase keeps its own `log`. `InvestigatorState.possessions` is a flat id list that `trade` moves freely; `setupGame` puts every starting card there, conditions included. Decks are id lists with index 0 on top; only the asset deck has a discard. Spells and conditions are double-sided in `cards.json` with 2–3 copies of a name.

## Goals / Non-Goals

**Goals:**
- One engine module for everything card text does that the state can hold, each effect one small function with a refusal in rule words.
- Nothing the engine already rules (defeat, deck order, discards) is duplicated.

**Non-Goals:**
- Pawn movement, Delayed, Detained, improvement tokens, reckoning of held cards (see proposal).

## Decisions

### D1. Effects are plain engine functions in `src/engine/effects.ts`
`changeHealth(state, content, investigator, delta)`, `changeSanity(...)`, `gainClue(state, content, investigator)`, `spendClue(...)`, `closeGate(state, content, investigator)`, `gainCard(state, content, investigator, deck, name?)`, `discardCard(state, content, investigator, cardId)`. Each checks the phase (`encounter`, or `mythos` with `log` present), the investigator standing, applies the change, and logs one line. Losses reaching 0 call `defeat`. Layer: engine.
- Rejected: one `applyEffect(state, effect)` with a union type. Seven functions read like the rules and the panel maps a button to each.

### D2. `note` logs in both phases
`note` appends to `phase.log` when the phase is `encounter` or `mythos`. Layer: game state.
- Rejected: a second log helper for encounters; one line of change covers both.

### D3. Conditions get their own list
`InvestigatorState.conditions: string[]`; `setupGame` sorts starting cards by deck; `gainCard` puts conditions there; `trade` refuses an id found in `conditions` ("conditions are not possessions"). Layer: game state and engine.
- Rejected: keeping conditions in `possessions` with a trade filter. The panel and the rules treat them as a separate thing; one list makes the rule visible.

### D4. Deck draws by rule, discards by deck
`gainCard`: `name` given → first id in the deck whose card has that name, else top for asset/artifact, bottom for spell/condition. Duplicate check on name for spells and conditions. `discardCard`: asset → `assetDiscard` front; artifact → new `GameState.artifactDiscard` front; spell/condition → `shuffle([...deck, id], rng(seed * 31 + rolls))` and `rolls + 1` so the reshuffle is replayable. Layer: engine.
- Rejected: discarding spells to a pile. The manual shuffles double-sided cards back at once.

### D5. Clues from the space, then the pool
`gainClue`: `state.clues` holds the space → remove it; else pool top, the discard reshuffled in first (as `spawnClue` does); none → refuse. `spendClue` decrements only. Layer: engine.
- Rejected: tracking which token each investigator holds. The pool's ids are spawn positions; held tokens never return to a space.

### D6. Panel: `Effects.tsx`, 2D, under both phases
A section with an investigator select (default: the encountering investigator, else the lead), buttons −1/+1 health and sanity, Gain clue, Spend clue, Close gate (shown when a gate is on the space), a deck select plus an optional name select listing the deck's distinct names, Gain card, and a Discard button per held card. `Status` lists conditions. Rendered inside `Encounter` always and inside `Mythos` once resolved. 3D: no new table elements. Layer: view.
- Rejected: parsing card text into effects. Text stays with the players by design.

## Risks / Trade-offs

- Any investigator can be changed at any time in these phases → it is the players' table; the log shows every change.
- A reshuffled spell deck changes `rolls`, so dice after a discard differ from a game without it → acceptable, seeded replay still works.
- Spent clues vanish → a long game could empty the pool early; return to the discard when held tokens are modelled.

## Open Questions

- None.
