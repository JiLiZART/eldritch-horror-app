## Why

The cup is an opaque container at the real table, but its contents are known from the set and the sheet: players count what is left to judge a gate's danger or a Byakhee's odds. The panel shows "monster cup 33" and nothing else, while the Board effects group already lists the kinds for spawning by name. No rulebook source beyond the known contents.

## What Changes

- A Monster cup fold in the Status section lists each kind in the cup with its count, and the set-aside monsters likewise.
- **Deviations**: none.
- Non-goals: the order of tokens in the cup (random by design).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the cup's kinds and counts are listed.

## Impact

- `src/table/Panel.tsx` (`Status`); `content/panel/i18n/{en,ru}.json`: `status.cup`. Panel only.
