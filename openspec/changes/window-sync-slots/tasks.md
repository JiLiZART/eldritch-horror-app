## 1. App

- [ ] 1.1 Export the index key and handle it in the listener (design D1). Verify in the browser with two pages of one context: a game started in the first appears in the second's list; removing it in the first puts the second aside; `pnpm test` passes.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
