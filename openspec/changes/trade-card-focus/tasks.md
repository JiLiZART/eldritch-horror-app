## 1. Panel

- [ ] 1.1 Add the buttons in `Trade.tsx` and pass `onFocusCard` from `Turn.tsx` (design D1). Verify in the browser with two investigators on one space: opening Trade and activating "Hired Muscle" zooms onto the card under Leo Anderson's sheet; `pnpm test` passes.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
