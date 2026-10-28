## Context

See proposal.md. `eldritchOnOmen` is a four-number tuple on the state since setup. Card-text effects sit behind `textPhase` in `effects.ts`; `spaceName` names spaces; `pieces.ts` turns state into `Piece`s per space with an image under `public/`, and `Table.tsx` sizes them by `kind`. `public/icons` has `rumor-token.png` and `eldritch.png`. `Effects.tsx` already holds a board-space select.

## Goals / Non-Goals

**Goals:**
- Two small state fields, three effects, two piece kinds; no new phase or screen.

**Non-Goals:**
- Rumor or eldritch encounters, card text (see proposal).

## Decisions

### D1. `rumors: string[]` and `eldritch: Record<string, number>`
Rumors as a list of space ids, one entry per token, since two rumors can share a space. Eldritch tokens as counts by space id, absent meaning none. Setup starts both empty. Layer: game state.
- Rejected: one `tokens: { kind, space }[]` list. Counts read better for eldritch and the two kinds never mix in a rule.

### D2. `placeToken(state, content, kind, space)`, `removeToken`, `changeEldritchOnOmen(state, slot, delta)`
Behind `textPhase`; unknown space refused as `moveInvestigator` does; `removeToken` refuses "London holds no rumor token"; `changeEldritchOnOmen` refuses below 0 naming the colour from `OMEN_TRACK`. Logs: "a rumor token is placed on London", "an eldritch token is removed from Tunguska", "an eldritch token is added to the green omen space". Layer: engine.
- Rejected: separate rumor and eldritch functions. One `kind` parameter keeps the panel row to two button pairs.

### D3. Pieces and sizes
`pieces.ts`: kind `rumor` with `icons/rumor-token.png`, label "Rumor"; kind `eldritch` with `icons/eldritch.png`, label "Eldritch token", one piece per token so stacks fan out like monsters. `Table.tsx` adds both kinds to `SIZE` at the clue size. Layer: view.
- Rejected: a count badge on one eldritch piece. The billboard has no text yet; one piece per token matches the cardboard.

### D4. Panel row
`Effects.tsx`: beside the existing space select, Place rumor, Remove rumor, Place eldritch, Remove eldritch; a second select of the four omen colours with Add eldritch and Remove eldritch. Layer: view.

## Risks / Trade-offs

- Many tokens on one space crowd the billboard fan → existing overlap thread, unchanged.
- Rumor clean-up when solved is by hand → the players remove the tokens with the same controls.

## Open Questions

- None.
