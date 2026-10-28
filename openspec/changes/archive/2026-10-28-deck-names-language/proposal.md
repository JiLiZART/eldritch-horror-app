## Why

The Status section's Decks line prints the deck ids and pile names as English literals ("asset 35, ... monster cup 33, set aside 0, gate stack 8, clue pool 35"), and the set names ("Core") are literals too, while the rest of the panel follows the board language. The glossary holds Russian for the piles (monster cup, gate stack, clue pool, research encounters and the rest).

## What Changes

- The deck ids, the four piles and the set names come from the panel strings in both languages.
- **Deviations**: none.
- Non-goals: card names, the deck order.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `panel-language`: the Status section's deck, pile and set names follow the chosen language.

## Impact

- `src/table/Panel.tsx` (`Status`, `SET_NAMES`); `content/panel/i18n/{en,ru}.json` gain `deck.*` and `set.*` keys. Panel only.
