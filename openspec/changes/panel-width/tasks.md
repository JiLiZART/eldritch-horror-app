## 1. Layout

- [ ] 1.1 Add the width state, the handle and the CSS variable (design D1, D2). Verify in the browser: dragging the handle 200 pixels left widens the panel and narrows the canvas by that much, and a reload keeps the width; `pnpm test` passes.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
