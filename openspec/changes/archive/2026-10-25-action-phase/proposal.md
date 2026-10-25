## Why

A game can be set up and seen, but nothing can happen on the table: pawns never move, tickets do not exist, and no rule of play is enforced. The Action phase is the first phase of every round (`inspired/manual_eng.pdf` p.3 "1. Action Phase") and the one players spend most decisions in, so it is the natural first slice of play to model and the first chance to check the engine's rule shape (pure, testable actions on `GameState`) before encounters and mythos cards add randomness.

## What Changes

- The game state tracks the round, the active investigator and the actions already taken this phase. Setup starts round 1 with the lead investigator active.
- Four of the printed actions become engine rules, each refusing illegal use with the rule's words: Travel (adjacent move, then 1 extra space per spent travel ticket along a matching path), Rest (1 health and 1 sanity, not with a monster on the space), Prepare for Travel (1 train or ship ticket on a city whose paths allow it, 2 tickets maximum), Trade (possessions, clues and tickets with an investigator on the same space). Sources: `manual_eng.pdf` p.3; `EH_reference.pdf` p.6–10.
- Each investigator performs up to 2 different actions, then passes; after the last seat the next round begins.
- The panel shows whose turn it is, actions left, tickets held, and the action controls; a travel route is previewed on the table before it is confirmed.
- **Deviation**: the Encounter and Mythos phases are not modelled yet. Ending the last turn starts the next round's Action phase directly, and the panel says so.
- Non-goals: Acquire Assets (needs skill tests and asset values, which are image-only today), Component actions, Focus, delayed or defeated investigators, monster movement, encounters, mythos cards, undo, save.

## Capabilities

### New Capabilities
- `action-phase`: turn order and the Travel, Rest, Prepare for Travel and Trade actions with their refusals; what the players see of the turn.

### Modified Capabilities
- `game-setup`: setup also starts the first turn (round 1, Action phase, lead investigator active, no tickets).

## Impact

- `src/engine/types.ts` gains `round`, `phase` and per-investigator `tickets`; `src/engine/setup.ts` fills them.
- New `src/engine/actions.ts` with pure action functions and tests.
- `src/table/` gains a turn section in the panel, a travel route draft and a trade form; markers can highlight a route.
- `content/rules/glossary.md` gains a Round entry.
- No new dependencies. Content untouched.
