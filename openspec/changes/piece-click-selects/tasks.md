## 1. Table

- [ ] 1.1 Add the click handler to the piece meshes in `Pieces` and thread `onSelect` from `Scene` (design D1). Verify in the browser: clicking Lily Chen's pawn selects Shanghai; a drag starting on a pawn pans without selecting; `pnpm test` passes.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over `src/table/Table.tsx`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
