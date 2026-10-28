## Why

In Russian the panel still prints the expansion set names, the path legend (train, ship, uncharted, local) and the selected space's kind and region in English, while the field names around them are Russian. The glossary already holds the Russian for the path types and the regions (glossary "Path", "Region"; EH_reference.pdf p.5, p.10).

## What Changes

- The three expansion set names, the four path types, the three space kinds and the three regions shown in the panel follow the board language.
- **Deviations**: none. The space kinds' Russian words are the fan translation's, marked unofficial in the glossary.
- Non-goals: translating card or investigator names, the engine's log lines, the content files.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `panel-language`: the legend values.

## Impact

- `src/table/Panel.tsx`; `content/panel/i18n/{en,ru}.json`: `set.eh03`, `set.eh05`, `set.eh07`, `path.*`, `kind.*`, `region.*`; `content/rules/glossary.md`: the space kinds' Russian words; `src/table/lang.test.ts`. Panel only.
