## Why

Monsters now spawn and block Rest, but nothing can fight them, and the round still jumps from the last Action turn straight to the Mythos phase. The Encounter phase is the second phase of every round (`inspired/manual_eng.pdf` p.3 "2. Encounter Phase"), and its combat encounter is fully mechanical: two tests against numbers printed on the monster token (`manual_eng.pdf` p.8 "Combat Encounters"). With the skill test in place, combat is the next slice that makes the board push back and lets the investigators push back in turn.

## What Changes

- Monster tokens carry their printed back: Will test modifier and horror, Strength test modifier and damage, toughness, hand-typed from the 37 core token images into a script table (as asset values were) and validated.
- Ending the last Action turn opens the Encounter phase: lead investigator first, then clockwise; each investigator resolves their encounter, then the Mythos phase draws its card as before.
- Combat is an engine rule: with monsters on the space the investigator must fight each one, in the order of their choice, non-epic before epic. Will test, lose sanity by which horror exceeds the successes; Strength test, lose health by which damage exceeds the successes, the monster loses health equal to the successes; a missing test is skipped; at toughness the monster is defeated and returns to the cup (`manual_eng.pdf` p.3, p.8; `EH_reference.pdf` p.2).
- With no monster left on the space the investigator draws one encounter card of their choice among the decks the space allows: the regional location deck or the general deck, the research deck at a clue, the other world deck at a gate, the expedition deck on the active expedition space. The card is shown and discarded when the player is done (`manual_eng.pdf` p.3–4).
- An investigator at 0 health or 0 sanity is defeated: doom advances by 1, the investigator leaves the turn order and the lead passes if needed; when every investigator is defeated the game is lost (`manual_eng.pdf` p.4).
- The panel shows whose encounter it is, the monsters on the space with their backs, the two rolls and their losses, the deck choice and the drawn card.
- **Deviations**: encounter card text, monster back text and "when defeated" effects are left to the players; defeated investigators are not replaced and the defeated-investigator encounter does not exist; epic monster toughness printed as a formula is not evaluated (no epic monster can spawn yet); rumor encounters, Detained and ambushes are not modelled.
- Non-goals: applying encounter outcomes to the state by hand (next change), monster movement, closing gates, gaining clues, mysteries, awakening.

## Capabilities

### New Capabilities
- `encounter-phase`: the phase order, the choice of one encounter per investigator, the drawn card, and investigator defeat.
- `combat-encounter`: the fight against one monster with its two tests and losses.

### Modified Capabilities
- `content-schema`: monsters carry their printed combat values, validated.
- `action-phase`: the last seat's end of turn opens the Encounter phase instead of the Mythos phase.
- `mythos-phase`: the Mythos phase follows the last encounter instead of the last Action turn.

## Impact

- `scripts/monster-stats.ts` (hand-typed), merged by `scripts/copy-core-assets.ts` into `content/sets/eh01/monsters.json`; `Monster.combat` typed in `src/content/types.ts`; validator checks every monster.
- `src/engine/types.ts`: phase union gains `encounter`; `MonsterOnBoard` gains `health`; `InvestigatorState` gains `defeated`; new `src/engine/encounter.ts` with tests; `endTurn` opens the Encounter phase.
- `src/table/`: Encounter section in the panel, 2D; monster health shown on the table pieces.
- `content/rules/glossary.md`: Encounter, Combat encounter, Defeated exist; no new terms.
