## 1. Persistence

- [ ] 1.1 In `src/table/saved.test.ts`, write failing tests: a renamed slot keeps its title after another `saveGame`, and an empty title clears it. Then add `title` and `renameGame` in `saved.ts` (design D1). Verify: `pnpm test` passes.

## 2. Panel

- [ ] 2.1 Add the `game.rename` string to both i18n files, the field in `NewGame.tsx` and the handler in `App.tsx` showing `title ?? name` (design D2). Verify in the browser: typing a name shows it in the list, it survives Rest and a reload, clearing restores the derived name; `pnpm test` and `pnpm content:validate` pass.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
