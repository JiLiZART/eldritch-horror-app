## Context

Rule sources: `inspired/eh01_rulebook.pdf` p.4–6 "Setup" and `inspired/eh01_reference_guide1.pdf` p.2, p.5, p.10.

`NewGame.tsx` renders one form (Ancient One select, investigator checkboxes, difficulty radios, seed) and calls `onStart(options)`; `App.tsx` runs `setupGame({ board, set }, options)` and opens a slot, or keeps the thrown message as `game.error`. The table's pieces, tracks, tableau and sheets are all derived from `game.state`. `setupGame` is pure and seeded, so the same options always give the same state (`game-setup` "Setup is reproducible"). Content already carries everything the detail views need: `AncientOne.doom`, `mythos`, `setup.setAsideMonsters`, `setup.eldritchTokensOnOmen`, `mysteries`, `cultists`, `images.front`; `Investigator.health`, `sanity`, `skills`, `startingSpace`, `starting`.

## Goals / Non-Goals

**Goals:**
- Stepped choices in the panel, a read-only setup preview on the table, one source of truth for the started state.

**Non-Goals:**
- No engine change, no new content fields, no persistence of wizard progress across reloads beyond what the form keeps today (choices live in component state).

## Decisions

### D1 — The preview is `setupGame` run on the current choices (view state, App)
On the review step `App` computes `preview = setupGame(content, options)` in a `useMemo` keyed on the options, catching the error. The table reads `shown = game.state ?? preview`; pieces, tracks, tableau and sheets derive from `shown`. Start calls `openNew(preview)` — the same object that was shown, so the "Start matches the preview" scenario holds by construction.
- *Rejected*: a separate preview builder that places only gates and clues — duplicates setup rules and can drift from `game-setup`.
- *Rejected*: starting the game and letting players "undo" it — writes a slot for a game nobody chose, breaks "Preview is not saved".
- *Consequence*: the save effect keys on `game.state`, not `shown`, so a preview is never saved. The panel's status sections stay keyed on `game.state` and show nothing during the preview; only the table shows it. Rendering: 3D table, unchanged components.

### D2 — Wizard step is component state in `NewGame` (view state)
`step: "ancient-one" | "investigators" | "options" | "review"` lives beside the existing choice state in `NewGame`; Back/Next buttons move it; step headers act as links back. `NewGame` lifts the current options and whether the review is open to `App` through one `onPreview(options | undefined)` callback, so `App` owns the setup call.
- *Rejected*: URL routing per step — no router in the app, and a reload must not resume a half-made setup anyway.
- *Rejected*: putting the step in the game state — it is not game state.
- *Consequence*: abandoning a game returns to the review step with the previous choices, matching today's "previous choices kept". Rendering: 2D panel.

### D3 — Refusals are attributed to steps by rule, not by parsing messages
The investigator step checks the 1–8 count and duplicates itself (same limits as `setupGame`) and shows the reason there, disabling Next. Any error the preview `setupGame` throws is shown on the options step and on the review in place of the preview; in the core set that is only the mythos-colour shortage. Messages go through the existing `message(e)` path so language handling is unchanged.
- *Rejected*: typed error codes from the engine — an engine change for one UI need; revisit if expansions add more refusals.
- *Consequence*: the count limits exist in two places; a test pins the helper's limits to the engine's by running `setupGame` with 0 and 9 investigators.

### D4 — Detail views read content through pure helpers (view)
The app has no component-test library, so the facts each step shows come from pure functions in `src/table/setup-view.ts` (sheet summary, investigator summary, seat refusal, preview summary), tested with vitest like `pieces.ts`; the components only lay them out.
The Ancient One step renders the sheet face (`images.front`) and a definition list of doom, per-stage mythos counts, set-aside monsters (names from `set.monsters`), eldritch tokens on the omen, mystery count and the Cultist row (reusing the existing monster-combat label helper). The investigator step renders each investigator as a card with health, sanity, skills, starting space name (board labels in the board language), and starting possessions (card names from `set.cards`, clue/focus/resource counts). New strings go into every `content/panel/i18n` language.
- *Rejected*: a 3D sheet preview on the table during the Ancient One step — the tableau already shows it during the review; one image in the panel is enough to choose.

### D5 — Review summary lists spawned gates and clues by space
The review lists each gate's city with its monster, each clue's space, the active expedition and the monster surge value, read from `preview`. New seed sets a fresh random seed, which recomputes `preview`.

## Risks / Trade-offs

- [Preview recomputed on every option change while on review] → `setupGame` runs only on the review step and is memoised on the options; it is a few hundred array operations.
- [Table fit changes when the preview adds the tableau] → reuse the existing fit-to-table on entering and leaving the review, as starting a game does now.
- [Panel strings in several languages] → missing keys fail the existing `lang` tests, so gaps are caught.

## Open Questions

- Should the sheet face in the Ancient One step open full-size on demand, or is the panel width enough to read it? Answerable after seeing it; does not change the specs.
