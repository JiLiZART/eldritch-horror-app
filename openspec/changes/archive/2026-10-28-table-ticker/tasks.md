## 1. View

- [x] 1.1 Extract `journalLine`, use it in the Journal and for the table's second line, and render it in the overlay (design D1). Verify in the browser: after Rest with the panel hidden, the corner's second line reads the Action word, Leo Anderson and the rest; `pnpm test` passes.

## 2. Finish

- [x] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
