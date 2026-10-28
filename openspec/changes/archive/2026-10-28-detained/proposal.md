## Why

Detained is the one condition with a rule of its own: the investigator cannot move, and in the Encounter phase they resolve the card's back instead of any encounter, even with a monster on the space (`inspired/manual_eng.pdf` p.4 "Conditions"; `inspired/EH_reference.pdf` p.5 "Контакты", p.10 "Вы не можете двигаться"). Today the panel only says "Detained is applied by the players" while the engine still offers Travel, fights and draws to a jailed investigator.

## What Changes

- No movement: Travel and a card-text move are refused for an investigator holding a Detained condition; a card's prohibition is absolute (`EH_reference.pdf` p.10).
- The back instead of an encounter: in the Encounter phase a Detained investigator cannot fight or draw; the condition's back is shown and finishing the encounter is allowed with monsters on the space unfought, since the card replaces the combat too.
- The panel shows the Detained card back with the explanation in place of the fight and draw controls; the players apply the back's text with the existing effects, Discard included.
- **Deviations**: the back's text (the roll, the discard) and any further front text are the players' call; other actions stay allowed, as the rulebook forbids only movement.
- Non-goals: other conditions' text, Lost in Time and Space, Poisoned.

## Capabilities

### New Capabilities
- `detained-investigator`: no movement, the back replaces the encounter.

### Modified Capabilities
- `encounter-phase`: the deviation "a Detained investigator is not modelled" is dropped.

## Impact

- `src/engine/actions.ts` (`travel` refusal), `src/engine/effects.ts` (`moveInvestigator` refusal), `src/engine/encounter.ts` (`fight`, `drawEncounter` refusals; `finishEncounter` skips the monster check), a shared `isDetained(investigator)`.
- `src/table/Encounter.tsx`: the back image and note; the footer line about Detained goes.
- `content/rules/glossary.md`: Condition names Detained already; no new terms.
