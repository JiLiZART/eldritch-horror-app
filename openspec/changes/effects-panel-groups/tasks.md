## 1. Grouping

- [ ] 1.1 Move the rows of `Effects.tsx` under five `<details>` groups with summaries, the investigator group open, and style the summary in `table.css` (design D1–D3). Verify in the browser: with an encounter card showing, the five summaries are listed, only the investigator group is open, unfolding Board shows Spawn gate and leaves the others as they were, and −1 health still works.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over `src/table/Effects.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
