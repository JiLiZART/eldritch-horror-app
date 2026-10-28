## 1. Engine

- [x] 1.1 Add `effects.test.ts` cases: spending 1 health at 3 leaves 2 with the log line; spending the last sanity refused saying so; spending at 2 to 1 allowed. Verify: fail.
- [x] 1.2 Add `spend`, `spendHealth`, `spendSanity` (design D1). Verify: 1.1 passes, `pnpm test` passes.

## 2. Panel

- [x] 2.1 Add the two buttons (design D2). Verify in the browser: Spend 1 sanity at 1 shows the refusal; at 2 drops to 1.

## 3. Finish

- [x] 3.1 Run simplify/deslop over `src/engine/effects.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
