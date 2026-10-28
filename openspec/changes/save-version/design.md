## Context

See proposal.md. `loadGame` in `src/table/saved.ts` parses the slot and checks for `phase`; `App.tsx` resumes from it in the initial state and shows start refusals through `NewGame`'s `error`.

## Goals / Non-Goals

**Goals:**
- One integer compared on load; the refusal surfaces where start refusals already do.

**Non-Goals:**
- Migrations (see proposal).

## Decisions

### D1. `STATE_VERSION` next to `GameState`
`export const STATE_VERSION = 2` in `types.ts` with `version: number` on the state, set by `setupGame`; the doc comment says to bump it whenever a field is added, removed or renamed. Starting at 2 marks every save written so far as older. Layer: game state.
- Rejected: hashing the field list. Clever, and a renamed optional field would slip through.

### D2. `loadGame` returns the reason
`loadGame(storage): { state?: GameState; note?: string }`: an empty slot gives neither; garbage or a missing phase gives "the saved game could not be read"; another version gives "the saved game was written by an older version and was set aside". The slot is left as it is until the next save or abandon. Layer: view (storage adapter).

### D3. The note where start refusals show
`App.tsx` seeds `game` with `{ state, error: note }`; `NewGame` already renders `error` under the form. Layer: view.

## Risks / Trade-offs

- Forgetting the bump on a later change → the old failure mode returns for that one change; the doc comment on the state and the tasks' deslop step are the reminders.

## Open Questions

- None.
