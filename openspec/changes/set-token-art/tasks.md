## 1. Pieces

- [x] 1.1 Update `pieces.test.ts`: rumor and eldritch pieces carry the set's token paths; a `lead` piece stands on the lead's space and moves with `leadInvestigator`. Verify: fail.
- [x] 1.2 Swap the images, add the lead piece and its size (design D1, D2). Verify: 1.1 passes, `pnpm test` passes; a screenshot shows the lead token beside Leo's pawn and, after passing the lead in the Mythos phase, beside Lily's.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/pieces.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
