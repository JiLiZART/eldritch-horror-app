## Why

The board switches between English and Russian with one toggle, the glossary names every rule in both languages, and the players at this table read Russian; yet the panel that runs the game speaks English only, from "Round 1, Action phase" to "End turn". The strings are a few dozen per panel and the machinery for two languages already exists for the board.

## What Changes

- Panel strings in `content/panel/i18n/en.json` and `ru.json`, loaded with the board strings; a `t(key)` lookup from the chosen language reaches the components through a context.
- The game form, the Action, Encounter and Mythos panels, the Acquire form, the dice, the Trade form, the Game section and the section headings read from the strings; Russian uses the glossary's names for rules terms.
- Key parity checked by `pnpm content:validate`, and a test that every key used in the components exists in both files.
- **Deviations**: the card-text groups and the Status table stay English until a follow-up; log lines and card names stay as they are.
- Non-goals: translating the engine's log lines, the glossary panel (already bilingual), the card images.

## Capabilities

### New Capabilities
- `panel-language`: the panel's own words in the chosen language, with key parity.

### Modified Capabilities
- none

## Impact

- New `content/panel/i18n/{en,ru}.json`; `src/content/client.ts` loads them; `scripts/validate-content.ts` or `src/content/validate.ts` checks parity; new `src/table/lang.tsx` (context and `t`); the seven components and `Panel.tsx` read strings. 2D panel only.
- `content/rules/glossary.md`: unchanged; its Russian names are reused.
