## Why

The New game form is a bare Ancient One drop-down and a list of investigator names. Players cannot see what an Ancient One brings before choosing it (doom, mythos deck, monsters set aside, eldritch tokens, mysteries, Cultist row), what an investigator starts with, or where setup put the first gates, clues and monsters until the game has already started. The rulebook setup (`inspired/eh01_rulebook.pdf` p.4–6 "Setup": step 3 investigators, step 5 Ancient One and its setup effects, step 8 mythos deck, step 9 spawns; `inspired/eh01_reference_guide1.pdf` p.2, p.5, p.10) is a sequence of choices followed by placement, and the form hides both.

## What Changes

- The New game form becomes a step-by-step setup wizard: Ancient One → investigators → difficulty and seed → review → Start. Each step can go back; choices persist across steps and after abandoning a game, as today.
- The Ancient One step shows the chosen sheet: face image, starting doom, mythos deck green/yellow/blue counts per stage, monsters set aside, eldritch tokens on the omen, mystery count and the Cultist row.
- The investigator step shows each investigator's health, sanity, skills, starting space and starting possessions; the seat order is shown and the first seat is marked as the lead investigator.
- The review step shows the setup preview on the table: the board as setup would leave it from the current choices and seed (pawns, gates with their monsters, clues, active expedition, doom, omen, reserve), plus a summary of gates, clues and monster surge by investigator count. A control draws a new seed and refreshes the preview. Start begins exactly the previewed state.
- Refused choices (no investigator, more than eight, deck too small for the difficulty) are explained on the step that caused them, and Start stays unavailable.
- **Deviations**: the Ancient One is chosen before the investigators (rulebook step 5 after step 3); the order of choosing has no rule effect. The lead investigator is the first seat chosen rather than agreed before choosing (rulebook step 3), as `new-game` already does. Sheet setup text that the engine does not model stays readable on the sheet image only.
- Non-goals: placing gates, clues or monsters by hand; modelling unmodelled sheet setup text; expansion sets; investigator portraits on the table during the preview beyond the existing pawns; changing setup rules in `game-setup`.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `new-game`: the choices become a stepped wizard with Ancient One and investigator details and a setup preview on the table before Start.

## Impact

- `src/table/NewGame.tsx`: split into wizard steps (Ancient One, investigators, difficulty and seed, review) with detail views.
- `src/table/App.tsx`: derives a preview state from the wizard's choices with the existing `setupGame` and feeds it to the table while no game runs; Start commits that state.
- `content/panel` strings: step titles, detail labels, preview summary, in every panel language.
- `src/engine/setup.ts`: unchanged. 2D panel for the steps; the preview reuses the 3D table.
