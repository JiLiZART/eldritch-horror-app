## Why

The Journal prints "Action", "Encounter" and "Mythos" before each line and "component action:" before a component's name as English literals, while its heading, its round labels and the rest of the panel follow the board language. The engine's own log text stays English by design (panel-language); these four words are the panel's, not the engine's. Russian phase names from the glossary (Фаза действий, Фаза контактов, Фаза Мифа).

## What Changes

- The three phase words and the component-action prefix come from the panel strings in both languages; the engine's text after the colon is unchanged.
- **Deviations**: none.
- Non-goals: translating engine log lines.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `panel-language`: the Journal's phase words and prefix follow the chosen language.

## Impact

- `src/table/Panel.tsx` (`Journal`); `content/panel/i18n/{en,ru}.json` gain `journal.*` keys. Panel only.
