## 1. Engine

- [ ] 1.1 Add `effects.test.ts` cases: a Cultist spawned on London from the cup, the cup one shorter, the log line; none in the cup refused naming the kind; a delayed Leo Anderson stood up with the log line; standing up when not delayed refused. Verify: fail.
- [ ] 1.2 Add `spawnNamed` and `standUp` (design D1, D2). Verify: 1.1 passes, `pnpm test` passes.

## 2. Panel

- [ ] 2.1 Add the kind select, Spawn named and Stand up (design D3). Verify in the browser: Spawn named Cultist on London puts a Cultist on London and lowers the cup count; Delay then Stand up clears the mark in Status.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over `src/engine/effects.ts`, `src/table/Effects.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
