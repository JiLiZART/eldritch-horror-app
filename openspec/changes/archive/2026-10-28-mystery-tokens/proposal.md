## Why

Most mysteries are solved by collecting tokens on the card: "place 1 Clue on this card", "when there are N eldritch tokens here, solve this mystery". The engine solves mysteries but keeps no count, so the heart of the win condition lives on paper (`inspired/manual_eng.pdf` p.4 "Mysteries"; `inspired/EH_reference.pdf` p.12 "Тайны").

## What Changes

- A token count on the current mystery: card text places a token or removes one; removing from an empty card is refused; solving the mystery discards every token on it, as the rules say.
- The count is shown with the mystery card; the Ancient One group offers Place token on mystery and Remove token.
- **Deviations**: one count for every token kind, the kind being the players' reading of the card; the card's own threshold is read from the image.
- Non-goals: mystery card text, automatic solving at a threshold, the final mystery's tokens.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `ancient-one`: tokens are placed on the mystery; solving discards them.

## Impact

- `src/engine/types.ts`: `GameState.mysteryTokens`; `src/engine/ancientOne.ts`: `changeMysteryTokens`, `solveMystery` resets the count; `src/table/Effects.tsx` (two buttons), `Panel.tsx` (count). 2D panel only.
- `content/rules/glossary.md`: Mystery mentions the tokens; no new terms.
