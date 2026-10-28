## 1. Engine

- [x] 1.1 Add `encounter.test.ts` cases: the rumor encounter on a space with a token sets the rumor card, logs the note, and finishing changes no deck or discard; refused without a token naming the space; `effects.test.ts` cases: an ongoing card discarded by text moves to the mythos discard with the log line; a card not in play refused. Verify: fail.
- [x] 1.2 Add `encounterRumor`, the `rumor` finish and `discardOngoing` (design D1, D2). Verify: 1.1 passes, `pnpm test` passes.

## 2. Panel

- [x] 2.1 Add Resolve rumor to `Encounter.tsx` and the ongoing select with Discard to the Board group (design D3). Verify in the browser: Place rumor on Leo's space, Resolve rumor logs the note and Finish passes the seat.

## 3. Finish

- [x] 3.1 Run simplify/deslop over `src/engine/encounter.ts`, `src/engine/effects.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
