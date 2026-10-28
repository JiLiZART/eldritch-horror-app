## Why

The glossary section is the last part of the panel with English of its own in Russian mode: its filter box is labelled "Filter" and an expansion term's marker reads "(unofficial)". The entries themselves print both languages already (table-view "The rules glossary is shown beside the board"). No rulebook source.

## What Changes

- The glossary's filter label and the unofficial marker follow the board language; the filter box gets the same accessible label and placeholder as the space and journal filters.
- **Deviations**: none.
- Non-goals: translating the glossary's sections or text.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `panel-language`: the glossary's own words.

## Impact

- `src/table/Glossary.tsx`; `content/panel/i18n/{en,ru}.json`: `panel.filterGlossary`, `glossary.unofficial`. Panel only.
