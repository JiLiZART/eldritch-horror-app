## 1. Status

- [x] 1.1 Replace the Improvements column by the skills column and add the sheet toggle in `Panel.tsx`, with `status.skills` and `status.sheet` keys in both files (design D1, D2). Verify in the browser: Leo's row lists Lore 3 after Improve Lore; Show sheet displays his sheet image and Hide removes it; `pnpm test` passes (usage and parity).

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/Panel.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
