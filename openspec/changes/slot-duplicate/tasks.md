## 1. Persistence

- [x] 1.1 In `src/table/saved.test.ts`, write failing tests: a duplicate holds the same state and history under a new id with the title suffixed, and the original is unchanged; then implement `duplicateGame` (design D1). Verify: `pnpm test` passes.

## 2. Panel

- [x] 2.1 Add `game.duplicate` to both i18n files, the button and the switch (design D2). Verify in the browser: Duplicate lists a second slot marked current, and Rest in it leaves the original's round and actions unchanged when switched back; `pnpm test` and `pnpm content:validate` pass.

## 3. Finish

- [x] 3.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
