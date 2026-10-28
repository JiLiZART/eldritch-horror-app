## 1. Table

- [ ] 1.1 Add `dim` to `Face`, `defeated` to the sheets prop and pass it through (design D1). Verify in the browser with a save patched so Leo Anderson is defeated: his sheet and card are darker than Lily Chen's; `pnpm test` passes.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
