## Why

Saved games live in one browser's storage; a cleared profile or a new machine loses them all, and Save to file moves one game at a time without its name or history. One backup file of every slot, loadable beside what is there, is the safety net. No rulebook source.

## What Changes

- Save backup downloads every slot with names, histories and times; Load backup adds the file's slots under fresh ids, skipping none and replacing none.
- **Deviations**: none.
- Non-goals: merging a slot with the same id, cloud storage.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `game-persistence`: every slot can be backed up and restored.

## Impact

- `src/table/saved.ts`: `exportAll` and `importAll`; `src/table/NewGame.tsx`: the two controls; `src/table/App.tsx`: the handlers; `content/panel/i18n/{en,ru}.json`: `game.backup`, `game.restore`. Persistence and panel.
