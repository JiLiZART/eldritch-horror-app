## 1. Table

- [x] 1.1 Change `CameraRig` in `Table.tsx` to glide once per new target and stop on a drag (design D1). Verify in the browser: after set-up with Leo Anderson selected, a drag of the table moves the view and it stays moved a second later; selecting another space glides there; `pnpm test` passes.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/Table.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
