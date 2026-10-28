## Why

Every effect the panel offers is "card text applied by hand", yet a held asset, spell, artifact or condition is a name in a list: to read what Hired Muscle does or what the Cursed condition says, the players must find the physical card. The images are in the content already and the drawn encounter card, the mystery and the mythos card show theirs. Spell and condition backs are hidden information until an effect flips the card (`inspired/manual_eng.pdf` p.4 "Spells, possessions & conditions"; `inspired/EH_reference.pdf` p.4), so the back must be a separate, deliberate request.

## What Changes

- Each held card in the Cards group gets a control that shows its face beside the name, and hides it again; a double-sided card gets a second control that shows its back instead, labelled as the hidden side.
- **Deviations**: none; who may look at a back is the players' call, as the rules put it on the card's text.
- Non-goals: the reserve (its images show already), the investigator sheet, zoom.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `card-effects`: held cards show their face, and their back, on request.

## Impact

- `src/table/Effects.tsx`: the held list gains the controls and the image; `src/table/table.css` for the size. 2D panel only; the engine is untouched.
- `content/rules/glossary.md`: no terms involved.
