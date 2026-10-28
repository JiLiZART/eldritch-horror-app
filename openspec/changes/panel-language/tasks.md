## 1. Strings and lookup

- [ ] 1.1 Add `lang.test.ts`: the two panel files hold the same keys; every `t("...")` key in `src/table` exists in both; `useT` replaces `{name}`. Add the parity check to the content validator with a test on a mismatched pair. Verify: fail.
- [ ] 1.2 Add `content/panel/i18n/en.json` with today's English strings and `ru.json` from the glossary's Russian names, the loader, `lang.tsx` and the validator check (design D1–D4). Verify: 1.1 passes, `pnpm content:validate` passes.

## 2. Components

- [ ] 2.1 Replace the literals in `NewGame.tsx`, `Turn.tsx`, `Acquire.tsx`, `Dice.tsx`, `Trade.tsx`, `Encounter.tsx`, `Mythos.tsx` and the headings in `Panel.tsx` with `t` lookups, wrapping the layout in `LangProvider` (design D2). Verify in the browser: English labels unchanged; Russian shows "Раунд 1, Фаза действий" and the five Russian action names; `pnpm test` passes.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over `src/table/lang.tsx` and the touched components; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
