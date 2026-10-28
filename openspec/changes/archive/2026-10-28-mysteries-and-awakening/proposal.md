## Why

Doom can reach 0 and the panel only says "awakening is not modelled"; the current mystery is shown but can never be solved, so no game can be won. The two end conditions of the rules (`inspired/manual_eng.pdf` p.4 "The Ancient One Awakens", "Winning the Game"; `inspired/EH_reference.pdf` p.3, p.8, p.12 "Тайны") are the last missing pieces of a full round loop.

## What Changes

- Doom by card text: in the Encounter and Mythos phases the players advance or retreat doom by 1 (many cards say "advance doom by 1"); doom never leaves the track.
- Awakening: the moment doom reaches 0, from any cause, the Ancient One awakens: the sheet flips, the state remembers it, the log says the Awakens effects, the back's reckoning and its losing condition are left to the players (`manual_eng.pdf` p.4). Defeated investigators are already out of play, which is what elimination means for the engine.
- Mysteries: card text solves the current mystery; the next one is drawn from the mystery deck on top of the solved pile. After awakening the final mystery on the sheet back can be solved too (`EH_reference.pdf` p.12).
- Winning: the game is won at once with 3 solved mysteries, plus the final mystery once awakened (`manual_eng.pdf` p.4). The panel shows the win as it shows a loss.
- The panel offers Advance doom, Retreat doom, Solve mystery and, once awakened, Solve final mystery; the Ancient One is marked awakened with the sheet back shown, and the solved count is listed.
- **Deviations**: Awakens effects, the back's cultist row, reckoning and losing condition are the players' call; tokens on the mystery card are not tracked; a mystery deck that runs out before 3 are solved is refused (every Ancient One has 4).
- Non-goals: mystery card text, reckoning automation, replacement investigators, clue reroll, Detained.

## Capabilities

### New Capabilities
- `ancient-one`: doom by card text, awakening at doom 0, solving mysteries, winning.

### Modified Capabilities
- `mythos-phase`: the panel no longer says awakening is not modelled.

## Impact

- New `src/engine/ancientOne.ts`: `changeDoom`, `awakenAt0`, `solveMystery`, `solveFinalMystery`, `WonPhase`; `GameState.awakened`, `solvedMysteries`, `finalMysterySolved`; doom sites in `src/engine/mythos.ts`, `spawn.ts`, `encounter.ts` call `awakenAt0`.
- `src/table/Effects.tsx` (doom and mystery controls), `Panel.tsx` (awakened mark, sheet back, solved count), `App.tsx` (won panel). 2D panel only.
- `content/rules/glossary.md`: Doom, Awakened, Mystery, Winning and losing exist; the Mystery entry's app note is updated.
