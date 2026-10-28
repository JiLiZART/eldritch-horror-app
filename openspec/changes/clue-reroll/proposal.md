## Why

Clues are gained and spent by card text, but their main use at the table, rerolling a die right after a test, is left to the players' memory: a roll is consumed the instant it lands, in combat and in Acquire Assets alike (`inspired/manual_eng.pdf` p.3 "Tests", p.8 "Clues"; `inspired/EH_reference.pdf` p.8 "Переброс", p.11 "Улики"). With mysteries and awakening in, this is the last rule a complete round needs from the dice.

## What Changes

- A roll waits: after the dice land, the result counts only when the player continues. Acquire Assets already waits for the card choice; combat now stops after the Will dice and after the Strength dice.
- Reroll for a clue: while a roll waits, the rolling investigator spends 1 clue to reroll 1 die, any number of times; the new face replaces the old one even when worse (`EH_reference.pdf` p.8). No clue, no reroll.
- Combat in steps: Fight rolls the Will test and stops; Continue applies the sanity loss and rolls the Strength test; Continue again applies the damage and the monster's loss and ends the fight. Defeat still interrupts at once. Nothing else happens in the Encounter phase while a fight waits.
- The panel shows the waiting dice with a Reroll button per die (showing the clue cost) and a Continue button in combat; Acquire keeps its Take form plus the Reroll buttons.
- **Deviations**: focus tokens and possessions that reroll are the players' call; a reroll from card text is not offered outside a waiting roll.
- Non-goals: skill bonuses from possessions, improvement tokens, the Bank Loan, tests inside encounter card text.

## Capabilities

### New Capabilities
- `reroll`: a waiting roll, a die rerolled for a clue.

### Modified Capabilities
- `combat-encounter`: the two tests are two waiting steps.
- `action-phase`: the Acquire Assets roll takes rerolls before the choice.
- `skill-test`: the deviation no longer lists rerolls and clues.

## Impact

- `src/engine/test.ts`: `rerollDie` on a `Roll`; `src/engine/encounter.ts`: `fight` splits into the opening roll and `continueFight`; `EncounterPhase.combat`; draw and finish refuse while a fight waits. `src/engine/actions.ts`: `acquiring` reused as the waiting roll.
- `src/table/Encounter.tsx` (dice, Reroll, Continue), `src/table/Acquire.tsx` (Reroll), a shared `Dice` view. 2D panel only.
- `content/rules/glossary.md`: Reroll, Clue, Test exist; no new terms.
