## Why

A test rolls dice equal to the skill plus improvements, yet nowhere beside the board does a skill value appear: the players must remember each sheet's five numbers or hold the physical sheet. The sheet images and the printed skills are in the content, and improvements already show. No rulebook source: the digital table's own convenience.

## What Changes

- The Status table lists each investigator's five skills as the printed value plus any improvement, in both languages.
- A control per row shows the investigator's sheet image beside the row and hides it again, like the held-card viewer; one sheet open at a time.
- The Improvements column folds into the skills, which now carry the improvement.
- **Deviations**: none; possession bonuses still stay with the players.
- Non-goals: the sheet back (used by the fallen encounter already), editing values.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the status lists skills and shows the sheet on request.

## Impact

- `src/table/Panel.tsx` (the Status table), `content/panel/i18n/{en,ru}.json` (two keys). 2D panel only; engine untouched.
- `content/rules/glossary.md`: Skill exists; no new terms.
