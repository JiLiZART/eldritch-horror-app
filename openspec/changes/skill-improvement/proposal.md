## Why

"Improve Lore" and its kin are the most common reward on encounter cards, yet improvement tokens live only in the players' heads: tests roll the printed skill and the deviation says so (`inspired/manual_eng.pdf` p.3 "Tests", p.9 "Improvement tokens"; `inspired/EH_reference.pdf` p.10 "Проверки", p.13 "Улучшение навыков"). With rerolls modelled, the dice count is the last piece of a test the engine leaves out.

## What Changes

- Improvement by card text: in the Encounter and Mythos phases an investigator improves a named skill: the token goes down at +1, a second improvement flips it to +2, and a third is refused, since a skill is improved at most twice per game (`EH_reference.pdf` p.13). Card text that discards an improvement takes one step back.
- Tests count improvements: dice equal the printed value plus the improvement plus the modifier, at least 1 (`EH_reference.pdf` p.10).
- Defeat discards improvement tokens with the conditions (`manual_eng.pdf` p.4 "Defeated" step 3).
- The panel offers a skill choice with Improve and Discard improvement beside the other effects, and Status lists each investigator's improvements.
- **Deviations**: possession bonuses stay with the players; impairment tokens belong to expansions and are not modelled; improvements are not traded, as printed.
- Non-goals: possession bonuses, impairment, focus tokens, the "flip" wording on the token.

## Capabilities

### New Capabilities
- `skill-improvement`: improving and discarding improvements by card text, shown beside the board.

### Modified Capabilities
- `skill-test`: dice count includes the improvement.
- `encounter-phase`: defeat discards improvement tokens.

## Impact

- `src/engine/types.ts`: `InvestigatorState.improvements`; `src/engine/effects.ts`: `improveSkill`, `discardImprovement`; `src/engine/test.ts` adds the improvement to the dice count; `defeat` in `src/engine/encounter.ts` clears the tokens.
- `src/table/Effects.tsx` (skill select, Improve, Discard improvement), `Panel.tsx` (Improvements column). 2D panel only.
- `content/rules/glossary.md`: Improvement exists; no new terms.
