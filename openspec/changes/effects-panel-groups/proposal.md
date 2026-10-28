## Why

The "Apply card text" fieldset now holds thirty controls in one column: health, clues, delay, movement, skills, doom, mysteries, monsters, spawns, tokens, decks and discards. Finding "Spawn gate" below "Discard improvement" takes a scroll past everything else, and the panel is the part of the table the players use most. No rulebook source: this is the digital table's own usability.

## What Changes

- The effects are grouped by what they touch: the investigator (health, sanity, clues, delay, move, skills), their cards (gain, discard), the board (close gate, spawns, rumor and eldritch tokens, the omen track), the monsters (move, toward, discard, ambush), the Ancient One (doom, mysteries). Each group folds and unfolds; the investigator group is open at first, the others folded.
- Nothing else changes: every control keeps its label and its rule.
- **Deviations**: none, no rule is involved.
- Non-goals: remembering folded groups across reloads, keyboard shortcuts, moving controls into other panels.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `card-effects`: the effects beside the board are grouped and foldable.

## Impact

- `src/table/Effects.tsx`: one `<details>` per group with a `<summary>`, the rows moved under them; `src/table/table.css` for the summary line. 2D panel only; no engine change.
- `content/rules/glossary.md`: no terms involved.
