## 1. Panel

- [x] 1.1 Add `useSpaceName()` to `src/table/lang.tsx` with a test in `lang.test.ts` for both languages, then replace the panel's `spaceName(content, …)` calls and `name.en` reads with it in `Panel.tsx`, the phase panels and the effects groups (design D1); the Selected space section keeps both names. Verify: `pnpm test` passes; in the browser with the board language Russian, the Status table and the space list read Буэнос-Айрес for Leo Anderson's space.

## 2. Finish

- [x] 2.1 Run simplify/deslop over the touched files; `grep -rn "spaceName(content" src/table` shows no panel caller left. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
