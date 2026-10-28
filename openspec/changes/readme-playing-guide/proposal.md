## Why

`README.md` still describes a content-extraction project: prerequisites, the one-shot scripts, where the source material lives. The repository is now a playable table with a round loop, saves, undo, a journal and a glossary, and nothing tells a new player how to start the app, what the engine enforces and what the players still do by hand with the card text. No rulebook source: documentation.

## What Changes

- A playing guide in the README: how to run the table (`pnpm dev`), start a game, what each phase offers, how card text is applied by hand through the grouped controls, saves, undo, files and the journal.
- A "What the engine models" section listing the modelled rules by capability, and a "What stays with the players" section listing the deviations the specs declare, both derived from `openspec/specs/`.
- The developer section kept: prerequisites, scripts, the content pipeline, plus the OpenSpec workflow and the random-play test in a few lines.
- **Deviations**: none; documentation only, `skip_specs`.
- Non-goals: screenshots, a rules summary of the board game itself, deployment instructions.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- none (documentation-only change, `skip_specs: true`)

## Impact

- `README.md` only.
