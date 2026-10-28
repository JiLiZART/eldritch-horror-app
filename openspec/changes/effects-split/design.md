## Context

See proposal.md. `effects.ts` shares `subject`, `textPhase` (from `spawn.ts`), `replace`, `name`, `knownSpace` and `monsterOn` across effects; `Effects.tsx` shares `me`, `space`, `content` and `name` across its groups and keeps eight `useState`s.

## Goals / Non-Goals

**Goals:**
- Same exports, same labels, same tests; files under 150 lines; shared helpers in one place.

**Non-Goals:**
- Renames or new behaviour (see proposal).

## Decisions

### D1. `src/engine/effects/shared.ts` holds the helpers
`subject`, `replace`, `name`, `knownSpace`, `monsterOn`, `SKILL_NAMES` and `withStream` move there; the four effect files import them; `src/engine/effects.ts` becomes `export * from "./effects/investigator"` and so on. Circular imports stay as they are today (`encounter.ts` for `defeat`, `fall`, `fight`, `toCup`). Layer: engine.
- Rejected: one file per effect. Forty files for forty functions of six lines.

### D2. One component per group
`src/table/effects/Investigator.tsx`, `Cards.tsx`, `Board.tsx`, `Monsters.tsx`, `AncientOne.tsx`, each taking `{ board, set, state, me, space, onAct }` and owning its selects' state; `Effects.tsx` keeps the investigator and space selects and the fieldset. Layer: view.
- Rejected: a context for the shared props. Five props, five components; a context hides what each needs.

### D3. Proof of no change
The suite, the random-play test and the type check pass unchanged; the browser checks in the scratchpad still find every control by its label. Layer: test.

## Risks / Trade-offs

- A missed re-export breaks an import → the type check catches it before the tests run.

## Open Questions

- None.
