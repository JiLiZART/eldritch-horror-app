## 1. Parser

- [ ] 1.1 Add `glossary.test.ts` on the committed file: 69 entries across the sections, "Delayed / Задержанный сыщик" with its text and source under its section, the unofficial mark on an expansion term. Verify: fail.
- [ ] 1.2 Add `parseGlossary` (design D1). Verify: 1.1 passes.

## 2. Panel

- [ ] 2.1 Add `Glossary.tsx` with the raw import and the filter, mounted from `Panel.tsx` (design D2, D3). Verify in the browser: the Rules glossary summary shows, unfolding lists the sections, typing "ближайш" leaves "Nearest / Ближайший" among a few entries.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over `src/content/glossary.ts`, `src/table/Glossary.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
