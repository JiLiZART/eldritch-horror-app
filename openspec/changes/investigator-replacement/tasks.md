## 1. Engine

- [ ] 1.1 Add `mythos.test.ts` cases: Charlie Kane replaces a defeated Leo Anderson after the resolved card (starting space, kit, seat after Leo, token still lying, log line); Lily Chen refused as already in the game; a second replacement refused; refused after the awakening; next round refused while unreplaced; next round allowed with no unused sheet. Verify: fail.
- [ ] 1.2 Export `placeInvestigator`, add `replacedBy`, `replaceInvestigator` and the `nextRound` wait (design D1–D3). Verify: 1.1 passes, `pnpm test` passes.

## 2. Panel

- [ ] 2.1 Add the replacement row to `Mythos.tsx`, the Status mark, and drop the footer clause (design D4). Verify in the browser: defeat Leo by card text, finish the round, the Mythos panel offers a replacement for him; Replace with Charlie Kane lists Charlie in Status and round 2 starts with him seated.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over `src/engine/mythos.ts`, `src/table/Mythos.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
