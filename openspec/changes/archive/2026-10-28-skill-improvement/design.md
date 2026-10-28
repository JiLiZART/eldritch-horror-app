## Context

See proposal.md. `test` in `src/engine/test.ts` counts dice from `sheet.skills[skill] + modifier`. Card-text effects sit behind `subject` in `effects.ts` and log through `note`. `defeat` in `encounter.ts` builds the fallen investigator with `conditions: []`. `Status` in `Panel.tsx` is a table with one column per holding; `Effects.tsx` has the effect buttons and selects.

## Goals / Non-Goals

**Goals:**
- Improvements as plain investigator state read by `test`; two small effects; no new phase or view beyond a select, two buttons and a column.

**Non-Goals:**
- Possession bonuses, impairment (see proposal).

## Decisions

### D1. `improvements: Partial<Record<Skill, 1 | 2>>` on the investigator
Absent key means no token; setup starts it empty. `test` adds `improvements[skill] ?? 0`. Layer: game state and engine.
- Rejected: a full record with zeros. Five zeros on every investigator for a token most never hold.
- Rejected: mutating `sheet.skills`. The sheet is content; the token is state and must go on defeat.

### D2. `improveSkill(state, content, id, skill)` and `discardImprovement`
Both behind `subject`. Improve: refuse at 2 ("Lore is improved at most twice"), else step up and log "Leo Anderson improves Lore to +1". Discard: refuse at none ("Lore is not improved"), else step down, deleting the key at 0, and log "discards a Lore improvement". Layer: engine.
- Rejected: one `changeImprovement(delta)`. Two names read better in the panel and the log.

### D3. Defeat clears `improvements`
`defeat` sets `improvements: {}` beside `conditions: []` (manual p.4 step 3). Layer: engine.

### D4. Panel: skill select, two buttons, a column
`Effects.tsx`: a `Skill` select (the five, capitalised) with Improve and Discard improvement. `Status`: an Improvements column listing "Lore +1, Will +2". 2D only. Layer: view.
- Rejected: showing the modified skill value on the pawn. The sheet is not on the table.

## Risks / Trade-offs

- Improvements are read by `test` only → Acquire Assets and combat both go through it; nothing else rolls.

## Open Questions

- None.
