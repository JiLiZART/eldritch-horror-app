## Why

Groups write up their games: a forum post, a chat message to the player who missed the night. The journal has every line but lives in a folded panel that cannot be selected comfortably. A Copy journal button hands the text over. No rulebook source.

## What Changes

- A Copy journal control copies the journal as plain text, round headings and lines as shown, and confirms in the control's label for a moment.
- **Deviations**: none.
- Non-goals: a download, formats other than text.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-journal`: the journal can be copied.

## Impact

- `src/table/Panel.tsx` (`Journal`); `content/panel/i18n/{en,ru}.json`: `panel.copyJournal`, `panel.copied`. Panel only.
