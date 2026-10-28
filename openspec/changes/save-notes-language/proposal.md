## Why

Loading an unreadable file, resuming a save from an older state version and restoring a file that is not a backup each show a note from `saved.ts`, in English whatever the board language, in the same place as the engine's refusals. The engine's English is by design (panel-language); the table's own notes are not. No rulebook source.

## What Changes

- The three saved-game notes follow the board language; engine refusals shown in the same place stay as logged.
- **Deviations**: none.
- Non-goals: translating engine messages or the journal.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `panel-language`: the saved-game notes.

## Impact

- `src/table/saved.ts`, `src/table/saved.test.ts`, `src/table/App.tsx`; `content/panel/i18n/{en,ru}.json`: `save.unreadable`, `save.older`, `save.notBackup`. Table only.
