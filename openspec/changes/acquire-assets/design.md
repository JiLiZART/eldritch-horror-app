## Context

See proposal.md. Actions in `src/engine/actions.ts` are pure functions that refuse with the rule's words; `ActionPhase.taken` records spent actions. `GameState.reserve` holds 4 card ids from setup but nothing reads it; there is no asset discard. Asset cards in `content/sets/eh01/cards.json` carry name, deck and images only; the value and trait line exist in the card art. `rng(seed)` (`src/engine/rng.ts`) is the only randomness; the Mythos phase seeds it from `seed * 31 + round`.

## Goals / Non-Goals

**Goals:**
- One dice function every later test (combat, encounters) calls unchanged.
- A roll the players see before they choose, with the choice checked by the engine.

**Non-Goals:**
- Bonuses, rerolls, Bank Loan, card text (see proposal). Animated dice.

## Decisions

### D1. Hand-typed asset values live in a script table
`scripts/asset-values.ts` exports `{ [cardId]: { value, traits } }` for the 40 core assets; `copy-core-assets.ts` merges it into `cards.json`, failing on an asset without an entry. `Card.value?: number` is added to `src/content/types.ts`; `Card.traits` already exists. The validator requires both on every `deck: "asset"` card. Layer: content.
- Rejected: OCR of the corner digit. 40 cards by eye is one sitting and the mythos table set the pattern.

### D2. Dice come from a roll counter on the state
`src/engine/test.ts`: `test(state, set, investigatorId, skill, modifier)` (the set supplies the printed skill) returns `{ state, dice, successes }`, rolling `max(1, skill + modifier)` dice with `rng(state.seed * 31 + state.rolls)` and returning the state with `rolls + 1`. `GameState.rolls: number` starts at 0. Layer: game state and engine.
- Rejected: seeding from the round as the Mythos phase does. Two tests in one round would roll the same dice.
- Rejected: `Math.random`. Replays and tests need determinism; the state already carries the seed.

### D3. Acquire Assets is two engine steps
`acquireAssets(state, board, set)` checks city and monster, runs the Influence test and stores `{ dice, successes }` in `ActionPhase.acquiring`; `takeAssets(state, set, cardIds, discard?)` checks the total value, moves the cards to the possessions (or the one discarded card to `assetDiscard`), refills the reserve, clears `acquiring` and records the action in `taken`. While `acquiring` is set, `mayAct` and `endTurn` refuse with "finish Acquire Assets first". Layer: game state and engine.
- Rejected: one function taking the chosen cards and rolling inside. The rule lets the player choose after seeing the result.
- Rejected: a separate "pending" phase. The investigator is still mid-turn; a field on the Action phase is smaller and keeps `taken` intact.

### D4. Reserve refill reshuffles the discard
`refillReserve(state, random)` draws from `decks.asset` until the reserve holds 4; when the deck is empty it shuffles `assetDiscard` into it first, and stops when both are empty. `GameState.assetDiscard: string[]` is added; setup starts it empty. Layer: engine.
- Rejected: refilling inside `takeAssets` inline. Encounters that discard reserve cards will need the same refill.

### D5. Panel: reserve in Status, choice in Turn
`Status` shows the reserve as card images with the value badge, like the ongoing mythos cards. `Turn` gains an "Acquire Assets" button; once `acquiring` is set it shows the dice faces and the result, a checkbox per reserve card with its value, a "Discard instead" select shown only when nothing is checked, and a "Take" button; errors use the existing aria-live line. 2D, no new table elements. Layer: view.
- Rejected: a 3D dice throw on the table. Later, once dice exist in more than one action.

## Risks / Trade-offs

- A misread value lets a card be bought too cheaply → the table cites each card; the review task spot-checks 10 cards against the images.
- `rolls` on the state changes `GameState` for saved games → none exist yet.
- The reserve may hold fewer than 4 cards late in a long game → the rule allows it; the panel shows what is there.

## Open Questions

- None.
