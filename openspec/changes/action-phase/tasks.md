## 1. Glossary and state shape

- [x] 1.1 Add "Round / Раунд" to `content/rules/glossary.md` under Round structure with its source. Verify: `pnpm test` (glossary test) passes.
- [x] 1.2 Add a `setup.test.ts` case: setup starts round 1, Action phase, lead active, no action taken, no tickets. Verify: fails to compile.
- [x] 1.3 Add `round`, `phase`, `tickets` to `src/engine/types.ts` and fill them in `setupGame` (design D1). Verify: 1.2 passes.

## 2. Turn order

- [x] 2.1 Write `src/engine/actions.test.ts` for `endTurn`: passes to the next seat, the last seat starts the next round with the lead active, a third action and a repeated action are refused with the rule text. Verify: fails to compile.
- [x] 2.2 Implement `endTurn` and the shared "may act" check in `src/engine/actions.ts` (design D2, D5). Verify: 2.1 passes.

## 3. Travel

- [x] 3.1 Add travel tests: adjacent move, ticket move spends the ticket, not adjacent refused, wrong ticket type refused, a monster's presence does not block travel. Verify: fail.
- [x] 3.2 Implement `travel(state, board, route)` (design D3). Verify: 3.1 passes.

## 4. Rest and Prepare for Travel

- [x] 4.1 Add rest tests: heals 1/1, capped at the sheet maximum, refused with a monster on the space. Add prepare tests: train ticket on Arkham, refused off a city, refused without a matching path, third ticket replaces the named one, missing `discard` with 2 tickets refused. Verify: fail.
- [x] 4.2 Implement `rest` and `prepareForTravel` (design D2, D7). Verify: 4.1 passes.

## 5. Trade

- [x] 5.1 Add trade tests: card for clue on a shared space, refused on different spaces, refused when the giver lacks the card, clue count above holdings refused, tickets move both ways. Verify: fail.
- [x] 5.2 Implement `trade` (design D4). Verify: 5.1 passes.

## 6. Turn in the panel

- [x] 6.1 Add `src/table/Turn.tsx` and the `act` dispatcher in `App` (design D6): round, phase, active investigator, actions left, tickets per investigator in the status table, buttons Rest, Prepare for Travel (train/ship with discard choice when holding 2), End turn, and the error line. Verify in the browser: Leo then Lily game shows round 1, Leo active, 2 actions left; Rest twice shows the refusal; End turn passes to Lily; ending the last turn shows round 2 and the skipped-phases note.
- [x] 6.2 Add travel route picking (design D3): Travel button enters route mode, selecting spaces extends the route when the engine accepts it, route markers are highlighted, Confirm moves the pawn, Cancel leaves the mode. Verify in the browser: Charlie Kane moves to space 5; with a train ticket the route space 5 then Arkham is accepted and the ticket disappears.
- [x] 6.3 Add the trade form (design D4): partner select limited to investigators on the same space, give and receive lists of possessions, clue counts and tickets, Confirm. Verify in the browser with two investigators set up on one space via trades after travelling.

## 7. Finish

- [x] 7.1 Run simplify/deslop over `src/engine/actions.ts` and `src/table/`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass; a final Playwright pass covers the `action-phase` scenarios.
