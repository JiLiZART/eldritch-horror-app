## Why

Choosing whether to fight or flee needs a monster's horror, damage and toughness (manual p.3 "Combat Encounter"; glossary "Monster"), printed on the token's front at a size the table cannot show. The content holds every monster's combat values, the cultist's on the Ancient One sheet, and the hover label already names the monster; it should name its numbers too.

## What Changes

- A monster's hover label adds its Will modifier and horror, Strength modifier and damage, and toughness, in the panel's language; a monster with no test on one side shows none for it.
- **Deviations**: none.
- Non-goals: the back-side effects text, epic monster markings, the panel's piece list (it keeps the names).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: a monster's label carries its combat numbers.

## Impact

- `src/table/pieces.ts`: a `hint` on monster pieces built from `Monster.combat` or `AncientOne.cultists`; `src/table/Table.tsx`: the badge shows the hint under the label; `content/panel/i18n/{en,ru}.json`: `piece.will`, `piece.strength`, `piece.toughness`. View model, table and content.
