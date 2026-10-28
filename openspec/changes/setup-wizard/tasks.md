## 1. Setup facts as pure helpers

- [ ] 1.1 Add failing tests in `src/table/setup-view.test.ts` for the Ancient One sheet summary: Cthulhu gives doom 12, stages 0/2/2, 1/3/0, 3/4/0, Deep One and Star Spawn set aside, 4 mysteries; Azathoth gives doom 15 and 1 eldritch token on green; Yog-Sothoth gives nothing set aside and no tokens (`pnpm test setup-view` fails)
- [ ] 1.2 Implement `sheetSummary` in `src/table/setup-view.ts` from `AncientOne` and `set.monsters` (1.1 passes)
- [ ] 1.3 Add failing tests for the investigator summary (Akachi Onyele: 5 health, 7 sanity, five skills, starting space 15, Mists of Releh and 1 clue) and the seat refusal (0 and 9 seats refused, its limits equal to the ones `setupGame` throws for)
- [ ] 1.4 Implement `investigatorSummary` and `seatRefusal` (1.3 passes)
- [ ] 1.5 Add failing tests for the preview summary from a seeded `setupGame` state with four investigators: one gate with its monster by city, two clues by space, the active expedition and monster surge 2
- [ ] 1.6 Implement `previewSummary` (1.5 passes)

## 2. Strings

- [ ] 2.1 Add step titles, Back/Next/New seed, detail labels, lead marker and preview summary strings to `content/panel/i18n/en.json` and `ru.json` (`pnpm test lang` passes with no missing keys)

## 3. Wizard steps in the panel

- [ ] 3.1 Split `NewGame` into steps (Ancient One, investigators, difficulty and seed, review) with Back/Next and step headers that return to a step, keeping every choice across steps and after abandoning; Start only on review (verify in the browser with agent-browser: going back from review and changing Cthulhu to Azathoth keeps investigators, difficulty and seed)
- [ ] 3.2 Ancient One step shows the sheet face and `sheetSummary`; investigator step shows each `investigatorSummary`, the seat order with the lead marked, and `seatRefusal` on the step with Next disabled (verify in the browser: Cthulhu and Akachi Onyele show the spec values; zero seats shows the reason)

## 4. Setup preview on the table

- [ ] 4.1 Lift the review options to `App` via `onPreview`; compute the preview with `setupGame` in a memo, show `game.state ?? preview` on the table, keep saving keyed on `game.state`, and start from the previewed state (`pnpm test` passes; in the browser the started game's gates, clues, monsters, expedition and reserve match the preview, and a reload during review resumes no game)
- [ ] 4.2 Review lists `previewSummary`, New seed draws a fresh seed and refreshes the preview, and a `setupGame` refusal shows on the difficulty step and in place of the preview (verify in the browser: New seed changes the seed and the gates; a hard-difficulty shortage names the colour)
- [ ] 4.3 Refit the table on entering and leaving the review so the tableau beside the board is in view (verify in the browser)

## 5. Finish

- [ ] 5.1 Run simplify and deslop on the changed files, remove dead code from the old single form, and run `pnpm test` and `pnpm build` green
