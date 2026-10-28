## Why

The piece labels, "Gate", "Clue", "Eldritch token", "Lead investigator", "(delayed)", "(2 health lost)", are English literals in the view model, so a Russian table reads Russian everywhere but on hover and in the selected space's piece list. The panel-language work gave every other label a string in both files; these nine are the gap. Russian terms from the glossary (`content/rules/glossary.md`).

## What Changes

- The piece labels come from the panel strings in both languages; the hover badge and the panel's piece list follow the board language.
- **Deviations**: none.
- Non-goals: translating monster, investigator and card names (content), engine log lines.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `panel-language`: the piece labels follow the chosen language.

## Impact

- `src/table/pieces.ts` takes a translate function; `src/table/App.tsx` passes the panel's; `content/panel/i18n/{en,ru}.json` gain `piece.*` keys; `src/table/pieces.test.ts` translates with the English file. Panel and view model.
