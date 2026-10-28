## 1. Glossary

- [x] 1.1 Add `panel.filterGlossary` and `glossary.unofficial` to both i18n files and use them in `Glossary` (design D1). Verify in the browser: in Russian the unfolded glossary's filter box and an unofficial entry's marker read in Russian; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/Glossary.tsx`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
