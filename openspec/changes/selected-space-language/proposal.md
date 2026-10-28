## Why

The Selected space section still prints English literals: Id, Name, Kind, Region, Set, Pieces, Neighbours, "none" and "Click a marker or pick a space below." Every other panel string follows the board language; this section is the last English island, next to piece labels that now read Russian. Russian terms from the glossary where one exists (space, clue, gate).

## What Changes

- The section's field names, prompt and empty markers come from the panel strings in both languages. Kind, region and set values stay as the content names them.
- **Deviations**: none.
- Non-goals: translating space kinds and regions (content ids), the path-type legend words.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `panel-language`: the Selected space section follows the chosen language.

## Impact

- `src/table/Panel.tsx`; `content/panel/i18n/{en,ru}.json` gain `space.*` keys. Panel only.
