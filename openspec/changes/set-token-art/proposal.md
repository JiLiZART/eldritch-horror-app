## Why

The tracks now carry the set's printed token art, while a rumor or eldritch token on a space is still a flat icon, so the same token looks different on the omen track and on the board. And the lead investigator token, the one piece every physical table keeps moving, never appears on the board; only a star in the Status table marks the lead (`inspired/manual_eng.pdf` p.3 "Lead investigator"; `inspired/EH_reference.pdf` p.3). The set ships all three images.

## What Changes

- Rumor and eldritch pieces on spaces use `rumor-token.webp` and `eldritch-token.webp` from the set, like the tracks.
- The lead investigator token stands beside the lead's pawn and follows the lead when the token passes; it is gone when nobody leads (every investigator out).
- **Deviations**: none.
- Non-goals: the mystery token, health and sanity tokens on sheets.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the set's token art for rumor and eldritch pieces, and the lead token on the board.

## Impact

- `src/table/pieces.ts` (images and a `lead` piece), `src/table/Table.tsx` (a size for the lead piece), `pieces.test.ts`. 3D table; the panel is untouched.
- `content/rules/glossary.md`: Lead investigator exists; no new terms.
