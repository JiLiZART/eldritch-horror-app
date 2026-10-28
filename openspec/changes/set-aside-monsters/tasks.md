## 1. Engine

- [ ] 1.1 Add `effects.test.ts` cases with Cthulhu: a Deep One spawned on Shanghai from the pile, flagged, the pile one shorter, the log line; a second refused naming the kind; a discarded set-aside Deep One back in the pile and not in the cup; `encounter.test.ts` case: a set-aside Deep One defeated is set aside again. Verify: fail.
- [ ] 1.2 Add the flag, `spawnSetAside`, the split in `toCup` and the log wording (design D1–D3). Verify: 1.1 passes, `pnpm test` passes.

## 2. Panel

- [ ] 2.1 Add the select and button to the Board group and the count to Status (design D4). Verify in the browser with Cthulhu: Spawn set-aside Deep One on Buenos Aires puts it on the table and the set-aside count drops by 1.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over `src/engine/effects.ts`, `src/engine/encounter.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
