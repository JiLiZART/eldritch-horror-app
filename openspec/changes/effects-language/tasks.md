## 1. Strings and groups

- [ ] 1.1 Add the `effects.*`, `status.*`, `skill.*`, `nearest.*`, `deck.*` and `omen.*` keys to both string files and read them in `Effects.tsx` and the five group files (design D1, D3). Verify: `pnpm test` (usage and parity) passes; in the browser the English groups read as before and the Russian ones as the spec says.

## 2. Status

- [ ] 2.1 Read the Status headings, lines and marks through `t` (design D2). Verify: English byte-identical in the browser; Russian status lines as the spec says.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over the touched files; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
