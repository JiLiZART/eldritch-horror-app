## 1. App

- [x] 1.1 Add the `storage` listener in `App.tsx` (design D1). Verify in the browser: with the same slot open in two pages of one context, Rest in the first shows "1 actions left" in the second without a reload; `pnpm test` passes.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/App.tsx`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
