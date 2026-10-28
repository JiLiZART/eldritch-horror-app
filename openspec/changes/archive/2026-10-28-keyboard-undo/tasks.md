## 1. App

- [x] 1.1 Lift the handlers, add the keys and extend the keys line in both languages (design D1). Verify in the browser: Rest, Meta+Z undoes, Shift+Meta+Z redoes, and the keys inside the space filter are ignored; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [x] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
