## Why

The game and phase controls now follow the board's language, but the part of the panel the players use most, the forty card-text controls in their five groups, and the Status table they read between steps, still speak English. The spec of the last change named this as the follow-up.

## What Changes

- The five card-text groups and their shell: every button, label, option and note in the chosen language, Russian from the glossary's names (здоровье, рассудок, улика, задержан, врата, слух, жетон Древних, Знамение, безысходность, тайна).
- The Status table: the headings, the doom, omen, reference card, mystery, reserve, ongoing mythos and deck lines, the investigator table's headers and marks (defeated, devoured, removed, replaced, delayed, awakened), in the chosen language; deck ids stay as they are.
- The same string files, lookup and guards as before; the usage test now also walks `src/table/effects`.
- **Deviations**: none beyond the spec's: card, investigator and space names and log lines stay as the content gives them.
- Non-goals: the log lines, the glossary panel (bilingual already).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `panel-language`: the card-text groups and the Status table follow the chosen language too.

## Impact

- `content/panel/i18n/{en,ru}.json` gain the keys; `src/table/Effects.tsx`, `src/table/effects/*.tsx` and the Status part of `src/table/Panel.tsx` read through `t`. 2D panel only.
- `content/rules/glossary.md`: unchanged; its Russian names are reused.
