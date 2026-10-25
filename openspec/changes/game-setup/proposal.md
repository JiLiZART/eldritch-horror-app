## Why

The table shows the board, but nothing can start a game. Every later rule (actions, encounters, the Mythos phase) needs a legal starting state to act on. Setup is the one procedure the rulebook spells out step by step (`inspired/manual_eng.pdf` p.3 "Setup"; `inspired/EH_reference.pdf` p.2, p.10, p.11 for doom, reserve, clue pool), and it needs no UI to be built and tested, so it is the first engine capability.

## What Changes

- A pure TypeScript engine module produces a game state from the board, the core set and setup options: chosen Ancient One, chosen investigators in seat order, mythos difficulty, random seed.
- The state follows the rulebook setup order: gate stack and clue pool built from the board; investigators placed on their starting space with full health and sanity and their printed starting possessions; doom at the Ancient One's value; omen on the green space; monster cup of non-epic monsters minus the Ancient One's set-aside monsters; mythos deck built as three stages from the sheet counts with stage I on top; reserve of 4 assets; expedition deck with the active expedition on the top card's space; gates and clues spawned per the reference card, one monster per gate; one mystery drawn.
- Reference card values by investigator count (printed reference cards; the Tabletop Playground mod's `icon-reference-card-holder.js` agrees): 1–2 investigators spawn 1 gate and 1 clue with monster surge 1; 3–4: 1 gate, 2 clues, surge 2; 5–6: 2 gates, 3 clues, surge 2; 7–8: 2 gates, 4 clues, surge 3.
- Ancient One content entries gain printed setup data: monsters to set aside (Cthulhu, Shub-Niggurath) and eldritch tokens placed on the omen track (Azathoth). Source: Ancient One sheet backs, mirrored in the mod's `01 Core/*.js`.
- Glossary gains: gate stack, clue pool, monster cup, reference card, set aside.
- Non-goals: no table wiring or UI, no card text effects (mystery and sheet effects stay with the players because cards are image-only), no expansions or preludes, no save/load, no multiplayer, no game loop beyond the finished setup state.

## Capabilities

### New Capabilities
- `game-setup`: produce the start-of-game state from chosen Ancient One, investigators and difficulty, following the printed setup steps.

### Modified Capabilities
- `content-schema`: Ancient One entries also carry their printed setup (set-aside monsters, eldritch tokens on the omen track).

## Impact

- New `src/engine/` module (state types, seeded random, setup) with tests; no new dependencies.
- `src/content/types.ts` gains the Ancient One setup field; `content/sets/eh01/ancient-ones.json` and the hand table in `scripts/copy-core-assets.ts` fill it; `src/content/validate.ts` checks set-aside monster ids resolve.
- `content/rules/glossary.md` gains the new terms.
- Table code is untouched.
