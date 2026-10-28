## 1. App and table

- [x] 1.1 Add the focus-first Escape branch and let `Scene` report a card focus to `App` so a table-click focus counts too (design D1). Verify in the browser: after bringing the mystery up by click, Escape refits and the selection stays; a second Escape clears it; `pnpm test` passes.

## 2. Finish

- [x] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
