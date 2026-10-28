## 1. Engine

- [x] 1.1 In `src/engine/encounter.test.ts`, write a failing test where a Strength test loses more health than the investigator has and assert health 0 with defeat by health; then floor both losses in `continueFight` (design D1). Verify: `pnpm test` and `pnpm test:fuzz` pass.

## 2. Finish

- [x] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
