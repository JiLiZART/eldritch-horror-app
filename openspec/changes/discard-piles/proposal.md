## Why

Leo Anderson's action gains an Ally "from the reserve or the discard pile", and several cards search a discard; the state keeps every discard pile, but the panel shows none of them, so the players must remember what went where. One fold listing the piles by card name answers it. No rulebook source beyond the cards that search discards.

## What Changes

- A Discards fold in the Status section lists each discard pile's cards by name, the pile named as the decks are; empty piles are left out.
- **Deviations**: none.
- Non-goals: taking cards from the discard (the Cards effects group does), the clue and gate discards (tokens, not cards).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the discard piles are listed.

## Impact

- `src/table/Panel.tsx` (`Status`); `content/panel/i18n/{en,ru}.json`: `status.discards`. Panel only.
