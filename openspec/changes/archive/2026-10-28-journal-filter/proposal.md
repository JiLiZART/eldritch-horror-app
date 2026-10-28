## Why

A game's journal runs to hundreds of lines by the late rounds; finding when a gate opened on London or what Lily Chen did in round 4 means scrolling the whole record. The space list and the glossary already filter by typed text. No rulebook source.

## What Changes

- A text field above the journal narrows its lines across all rounds; empty shows all; translated placeholder.
- **Deviations**: none.
- Non-goals: filtering by phase or investigator as structured fields (the text covers them), exporting the journal.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-journal`: the journal has a text filter.

## Impact

- `src/table/Panel.tsx` (`Journal`); `content/panel/i18n/{en,ru}.json`: `panel.filterJournal`. Panel only.
