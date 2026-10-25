## Context

See proposal.md for motivation. Current state: `src/content/` loads and validates the board and the core set as plain JSON (`loadSet`, `validateSet`, `activeGraph`); `src/table/` renders the board and starting pawns from content directly, with no game state. Cards are image-only, so nothing in the engine can read card text. The Tabletop Playground mod under `inspired/` automates the same setup steps and is the cross-check for numbers (`setup-reference-card.js`, `build-mythos.js`, `01 Core/*.js`, `Templates/01 Core/eh01 - token - monsters.json`).

## Goals / Non-Goals

**Goals:**
- A game-state layer that is plain data, separate from content (immutable printed facts) and from view state (camera, selection, enabled sets).
- Every random step reproducible from a seed.
- Content gaps that setup needs (set-aside monsters, token counts, spawn relocation) filled as data, not as code special cases.

**Non-Goals:**
- No reducer/store, no undo, no game loop. One function: options in, state out.
- No table rendering changes. No new 3D or 2D element is added; the table will consume the state in a later change.
- No modelling of card text, mystery effects or Ancient One sheet effects beyond the setup data listed.

## Decisions

### D1. Engine is a module of pure functions over plain JSON data
`src/engine/` exports `setupGame(content, options): GameState`. `GameState` is a JSON-serialisable object: decks as arrays of ids with index 0 on top, tokens by space id, investigators by id. Layer: game state.
- Rejected: a store (zustand/redux) with actions. No consumer yet; a store wraps a pure function later at no cost.
- Rejected: classes with methods. Serialisation and structural equality in tests get harder for no gain.
- Consequence: later phases are reducers `(state, action) => state` over the same type.

### D2. Seeded random: splitmix32 plus Fisher–Yates
A tiny PRNG (`rng(seed)` returning `() => number` in [0, 1)) and `shuffle(items, random)`. No dependency. Layer: game state.
- Rejected: `Math.random` (not reproducible); `crypto.getRandomValues` (not seedable).
- Consequence: the seed is part of the state so a game can be re-created.

### D3. Gate and clue tokens are derived from the board, not new content
Gate stack = named core cities, that is kind city without a printed number (9); clue pool = all core spaces (36). Numbered spaces 1, 5, 6, 7, 14, 15, 16, 17 and 20 are cities too but have no gate token. This is exactly the printed token set and avoids a tokens JSON that duplicates the board. Layer: game state built from content.
- Rejected: `tokens.json` per set. Needed later for expansions that add tokens for new spaces (Egypt, Antarctica, Dreamlands); when that comes, derive from spaces of enabled sets, still no token list.
- Consequence: a clue token is referenced by its space id; held clues are counts, not tokens, matching the rules (a held clue has no space).

### D4. Ancient One setup data lives in content
`AncientOne.setup?: { setAsideMonsters?: Record<monsterId, number>; eldritchTokensOnOmen?: number }`. Core values: Cthulhu Deep One 1, Star Spawn 1; Shub-Niggurath Ghoul 2, Goat Spawn 2, Dark Young 1; Azathoth eldritchTokensOnOmen 1; Yog-Sothoth none. Layer: content.
- Rejected: hard-coding in the engine by Ancient One id. Expansions add 20+ Ancient Ones; data scales, switch statements do not.
- Consequence: validation checks set-aside ids against the set's monsters.

### D5. Monster tokens get `count` and `spawnMoveTo` in content
`Monster.count?: number` (default 1) and `Monster.spawnMoveTo?: spaceId`. Core: Cultist 5, Ghoul 2, Goat Spawn 2; relocations Color Out of Space → tunguska, Cthonian → the-heart-of-africa, Elder Thing → antarctica, Gnoph-Keh → the-himalayas, Mummy → the-pyramids, Serpent People → the-amazon. Monster instances in state are `{ id, instance }` so two Cultists are distinct. Layer: content and game state.
- Rejected: one token per monster (wrong cup odds, breaks set-aside of 2 Ghouls).
- Rejected: modelling the Wraith's text spawn effect. It is text, stays with the players.
- Consequence: `content-schema` spec gains a requirement; the copy script's hand table grows.

### D6. Difficulty is a card filter at build time
`normal` uses all cards; `easy` drops hard cards; `hard` drops easy cards (rulebook variant, same as the mod's `setupDifficulty`). Each colour pool is shuffled, then stages take cards from the top. Insufficient cards throw. Layer: game state.
- Rejected: weighting instead of filtering. Not a printed rule.

### D7. Validation at the boundary throws `Error`
Bad options (0 or more than 8 investigators, duplicates, unknown ids, short colour pools) throw an `Error` whose message names the rule. Layer: game state.
- Rejected: result objects. One caller, tests read messages fine.

### D8. Expedition card to space by name prefix
Expedition card names are `<Space> - NN`; the prefix is matched to `space.name.en` of the core wilderness spaces. Layer: game state built from content.
- Rejected: adding `space` to each expedition card entry. The same fact twice; revisit if an expansion names spaces differently.

### D9. Seat order and lead investigator are caller decisions
`options.investigators` is seat order; index 0 holds the lead token. The engine does not pick seats or the lead.

## Risks / Trade-offs

- Content counts and relocations are typed by hand from the mod template, not from the printed tokens; a mismatch shows up as wrong cup odds. Mitigation: test totals (34 non-epic tokens) and spot-check against the physical count list when available.
- Deriving tokens from the board couples setup to board data correctness; a wrong `kind` on a space adds or drops a gate token. Mitigation: test the gate stack has exactly the 9 printed cities.
- The mystery's enter-play effect is not applied. Players apply it from the card image. Marked as a deviation in the glossary entry for Mystery.

## Open Questions

- Monster health, toughness and damage values are not in content yet (image-only). Not needed for setup; needed by combat later.
