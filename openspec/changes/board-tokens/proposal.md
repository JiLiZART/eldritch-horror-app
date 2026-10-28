## Why

Mythos cards place rumor tokens and eldritch tokens on the board, and Ancient One text moves eldritch tokens on the omen track, yet the resolution log only says those tokens are left to the players: nothing can be put on the table, so a rumor's space and an eldritch count live on paper (`inspired/manual_eng.pdf` p.3 "Place rumor token", "Place eldritch tokens", p.4 "Eldritch tokens", "Rumors"; `inspired/EH_reference.pdf` p.4 "Жетон Древних", p.11 "Слухи").

## What Changes

- Rumor tokens: card text places a rumor token on any space the players name and removes one; the token shows on the table and is listed for the space.
- Eldritch tokens on spaces: card text places and removes eldritch tokens on a space, any number stacking; the count shows on the table.
- Eldritch tokens on the omen track: card text adds and removes a token on any of the four track spaces; the count was already kept and shown for the current omen.
- The panel offers Place rumor, Remove rumor, Place eldritch and Remove eldritch with the existing space choice, and an omen-space choice with Add and Remove for the track. Removing what is not there is refused naming the space.
- **Deviations**: the space a mythos card names is read from the card image and chosen by the players; the rumor encounter, the eldritch token's encounter and "when the rumor is solved" clean-up are resolved by hand, the encounter finished without a draw.
- Non-goals: reading card text, rumor encounters, mystery tokens, resource tokens.

## Capabilities

### New Capabilities
- `board-tokens`: rumor and eldritch tokens placed, removed and shown.

### Modified Capabilities
- none

## Impact

- `src/engine/types.ts`: `GameState.rumors`, `GameState.eldritch`; `src/engine/setup.ts` starts them empty; `src/engine/effects.ts`: `placeToken`, `removeToken`, `changeEldritchOnOmen`.
- `src/table/pieces.ts` and `Table.tsx`: rumor and eldritch pieces from `public/icons`; `src/table/Effects.tsx`: the token row. 2D panel plus the existing 3D piece billboards.
- `content/rules/glossary.md`: Rumor and Eldritch token exist; no new terms.
