## 1. Tests

- [x] 1.1 In `src/engine/actions.test.ts`, write a failing test that a travel from Istanbul to `eh05-cairo` on the core board is refused as unknown; in `src/engine/fuzz.test.ts` play on the core graph and bound spaces to it (design D2). Verify: the actions test fails before the App change only if it uses the full board; make the test use the core graph and pass.

## 2. App

- [x] 2.1 Build `playBoard` and pass it to every engine call and to the pieces (design D1). Verify in the browser: with Istanbul reachable, the route list never offers Cairo of Under the Pyramids; `pnpm test` and `pnpm test:fuzz` pass.

## 3. Finish

- [x] 3.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
