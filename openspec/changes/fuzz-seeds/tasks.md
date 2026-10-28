## 1. Tooling

- [x] 1.1 Read the seed count from `FUZZ_SEEDS` in `src/engine/fuzz.test.ts`, add `test:fuzz` to `package.json`, and name it in README's Developing section (design D1). Verify: `pnpm test` still plays six seeds; `FUZZ_SEEDS=12 pnpm exec vitest run src/engine/fuzz.test.ts` plays twelve and passes.

## 2. Finish

- [x] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
