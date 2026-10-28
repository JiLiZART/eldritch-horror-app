## 1. Panel

- [x] 1.1 Test first in `src/table/lang.test.ts`: every set id, path type, space kind and region has a key in both languages. Add the keys, switch `Panel` to the keys (design D1). Verify in the browser: in Russian the set controls, the path legend and London's kind, region and set read as the scenario says; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/Panel.tsx` and `src/table/sets.ts`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
