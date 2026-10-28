## Why

Many cards charge a cost, "spend 1 health", "spend 2 sanity", and the rules forbid paying it with your last point: an investigator cannot spend health or sanity if doing so would defeat them (`inspired/manual_eng.pdf` p.4 "Health and sanity"; `inspired/EH_reference.pdf` p.12 "Тратить"). The panel only offers losing, which defeats at 0, so a player paying a cost at 1 health is wrongly defeated.

## What Changes

- Spend 1 health and Spend 1 sanity in the Investigator group: refused when it would reach 0, otherwise taken and logged as spent.
- **Deviations**: none; what a card lets you buy with it stays with the players.
- Non-goals: spending clues (modelled), spending tokens other than health and sanity.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `card-effects`: spending health or sanity never defeats.

## Impact

- `src/engine/effects.ts`: `spendHealth`, `spendSanity`; `src/table/Effects.tsx`: two buttons. 2D panel only.
- `content/rules/glossary.md`: Health and sanity exists; no new terms.
