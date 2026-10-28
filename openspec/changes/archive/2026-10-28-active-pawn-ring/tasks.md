## 1. View model

- [x] 1.1 In `src/table/pieces.test.ts`, write a failing test that the active investigator's pawn is `active` and the others are not, and that the Mythos phase rings none; then set it in `piecesOnSpace` (design D1). Verify: `pnpm test` passes.

## 2. Table

- [x] 2.1 Draw the ring under the active pawn in `Pieces` (design D2). Verify in the browser: a ring shows under Leo Anderson's pawn at set-up and under Lily Chen's after End turn; `pnpm test` passes.

## 3. Finish

- [x] 3.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
