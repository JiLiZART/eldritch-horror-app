## Why

A roll is the moment the table leans in, and on the panel-hidden screen nothing shows it: the dice live in the panel's Dice component while the roll waits for rerolls and the players' call. The state holds every open roll's faces. No rulebook source.

## What Changes

- The table's corner shows the open roll's dice, successes marked, and the roller, under the status and journal lines; nothing when no roll is open.
- **Deviations**: none.
- Non-goals: rerolling from the table, dice animation.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the open roll's dice are shown on the table.

## Impact

- `src/table/App.tsx`: the dice line from `phase.acquiring` or `phase.combat.roll`; `src/table/Table.tsx`: a third line in the overlay; `content/panel/i18n/{en,ru}.json`: `table.roll`. View and content.
