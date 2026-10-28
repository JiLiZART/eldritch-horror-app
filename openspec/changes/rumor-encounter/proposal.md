## Why

Rumor cards stay in play forever: the panel places their tokens, but the rumor encounter on the token's space is the one encounter kind still not offered, and no effect can discard the card once the rumor is solved or fails, so "stays in play until a game effect discards it" has no effect to call (`inspired/manual_eng.pdf` p.3 "Rumors", p.4; `inspired/EH_reference.pdf` p.11 "Слухи").

## What Changes

- Rumor encounter: on a space holding a rumor token the investigator may resolve the rumor encounter as their one encounter; the text is on the rumor card shown in play, so the log says it is left to the players; finishing discards nothing.
- Discard an ongoing mythos card by card text, when the rumor is solved or fails: the card goes to the mythos discard; its tokens are removed with the existing token controls.
- The Encounter panel offers Resolve rumor when a token lies on the space; the Board group offers a choice of ongoing cards with Discard.
- **Deviations**: which rumor card a token belongs to is the players' reading; the tokens are removed by hand.
- Non-goals: the rumor's own text, epic monsters a rumor placed.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `encounter-phase`: the rumor encounter is offered.
- `mythos-phase`: an ongoing card is discarded by card text.

## Impact

- `src/engine/encounter.ts`: `encounterRumor`, the `rumor` deck in finish; `src/engine/effects.ts`: `discardOngoing`; `src/table/Encounter.tsx` and `Effects.tsx`. 2D panel only.
- `content/rules/glossary.md`: Rumor exists; no new terms.
