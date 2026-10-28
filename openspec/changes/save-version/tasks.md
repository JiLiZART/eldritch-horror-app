## 1. Adapter

- [x] 1.1 Add `saved.test.ts` cases: a current save loads with no note; a save with an older version gives no state and the older-version note; garbage gives the could-not-be-read note; `setup.test.ts` the state carries the current version. Verify: fail.
- [x] 1.2 Add `STATE_VERSION` and `version`, write it in setup, check it in `loadGame` returning the note, and show the note in `App.tsx` (design D1–D3). Verify: 1.1 passes, `pnpm test` passes.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/saved.ts`, `src/table/App.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass; in the browser a slot holding `{"phase":{"name":"action"}}` shows the form with the older-version note.
