## Why

The README's playing guide predates the last nine changes: the panel now follows the board's language, the Status table lists skills and opens the sheet, pawns lie down when delayed or defeated, rumor encounters and ongoing-card discards exist, spawns can be named or set aside, health and sanity can be spent, and a game can be saved to a file. Its "What stays with the players" list still names rumor encounters. The Developing section does not mention the panel strings or the build fix.

## What Changes

- The playing guide gains the language toggle, the skills and sheet in Status, the lying pawns, the rumor encounter, save files, and the new card-text controls in the group list.
- "What the engine models" and "What stays with the players" are rederived from the current specs' purposes and deviations (`panel-language` added, rumor encounters removed from the by-hand list).
- The Developing section names `content/panel/i18n` with its parity test and the output-folder removal with retries.
- **Deviations**: none; documentation only, `skip_specs`.
- Non-goals: screenshots, a changelog.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- none (documentation-only change, `skip_specs: true`)

## Impact

- `README.md` only.
