# Eldritch Horror app

Browser version of the Eldritch Horror board game: a 3D table with the board
and its pieces, and a panel beside it that runs the rules. Non-commercial fan
project, see `content/ATTRIBUTION.md`.

## Playing at the table

```
pnpm install
pnpm dev          # then open the printed localhost URL
```

**Start a game.** Pick an Ancient One, tick the investigators in seat order,
choose a difficulty and a seed, press Start. The same seed with the same
choices replays the same setup and the same dice. The Board language toggle
switches the board and the whole panel between English and Russian; card and
investigator names and the engine's log lines stay English.

**Action phase.** The active investigator has two different actions: Travel
(pick a route on the table, tickets extend it), Rest, Prepare for Travel,
Trade with an investigator on the same space, Acquire Assets (the Influence
roll waits for rerolls and the Bank Loan before you choose cards) and a
Component action on your sheet or a held card. End turn passes the seat; a
delayed investigator only stands up.

**Encounter phase.** Each investigator in turn fights the monsters on their
space (the Will and Strength dice wait, so clues can reroll them) or draws one
card from a deck the space allows: the region, general, research, other
world, expedition or the Ancient One's special deck, or resolves the rumor
encounter on a space holding a rumor token. A Detained investigator resolves
the card's back instead; a comrade on a fallen investigator's city can
resolve that sheet's back and take the possessions.

**Mythos phase.** Resolve the card: its icons run by the rules (omen, gates,
monster surge, clues) and the log says which steps stay with you. Replace
defeated investigators, pass the lead if you like, start the next round.

**Card text by hand.** The engine never reads card text. The "Apply card
text" controls, grouped as Investigator, Cards, Board, Monsters and Ancient
One, do what the text says: health and sanity lost, gained or spent (never
the last point), clues, delay and standing up, movement (named, nearest,
random), skills, gaining and discarding cards (Show a held card's face, or
its hidden back), spawning gates, clues and monsters (from the cup, by name,
or from the set-aside pile), rumor and eldritch tokens, discarding an ongoing
mythos card, moving and discarding monsters, ambushes, doom, mysteries and
their tokens, devouring. Every refusal is explained in the rule's words.

**Reading the table.** The Status table lists each investigator's space,
health, sanity, clues, tickets, cards, conditions and five skills with their
improvements, and opens the sheet image on request; a delayed or defeated
pawn lies on its side on the board. The journal beside the board keeps every
phase log and action by round, and the Rules glossary (English and Russian,
with sources) sits below it.

**The table itself.** Beside the board lie the Ancient One sheet (its back
once awakened), the current mystery with the tokens it has collected and the
ongoing mythos cards; below the board lie the investigators' sheets in seat
order, each with its held cards under it and numbered health and sanity
tokens, improvement tokens and tickets on it. A wounded monster carries a
health token. Pointing at a piece shows its name; clicking any card brings it
up to read, and Fit table takes the view back to the whole table. The wheel
zooms under the pointer, dragging pans, and the view stays within the table.

**Keeping the game.** Every accepted step is saved in the browser and resumes
on reload; Undo takes back the last steps, ten of them even across a reload;
Save to file and Load
from file move a game between browsers as plain JSON. A save from an older
state shape is set aside with a note rather than resumed.

## What the engine models

Derived from the specs under `openspec/specs/`:

- `game-setup`, `new-game`: the printed setup from the chosen Ancient One,
  investigators and difficulty, reproducible by seed; refused choices
  explained.
- `action-phase`: seat order, two actions each, Travel along paths with
  tickets, Rest, Prepare for Travel, Trade, Acquire Assets with the Bank
  Loan, component actions once per component per round.
- `skill-test`, `reroll`, `skill-improvement`: dice from the printed skill
  plus improvement tokens and the modifier; rolls wait for clue rerolls.
- `encounter-phase`, `combat-encounter`: fights in two waiting steps against
  every monster on the space, one encounter from an allowed deck, decks
  rebuilt from their discards, defeat with relocation to the nearest city,
  the special deck and a fallen investigator's sheet back.
- `mythos-phase`, `ancient-one`: the mythos icons by the rules, ongoing
  cards, the lead token, doom on its track with the awakening at 0,
  mysteries, their tokens, the final mystery and victory.
- `card-effects`, `board-tokens`: every by-hand effect listed above.
- `delayed-investigator`, `detained-investigator`, `devoured-investigator`,
  `investigator-replacement`: the investigator states and the replacement at
  the end of the Mythos phase.
- `game-persistence`, `game-journal`, `table-view`, `board-language`,
  `panel-language`, `board-graph`, `content-schema`, `icon-set`,
  `rules-glossary`: the saved game, undo and files, the journal, the table
  with its pieces, tableau, sheets and tokens, the board and panel in two
  languages, the board data, the content on disk and the glossary.

## What stays with the players

The specs declare these deviations:

- All card, token and sheet text: encounter, mythos, monster back, condition
  and Ancient One text, reckoning, the rumor and eldritch encounters' text,
  which rumor card a token belongs to, when the special deck may be drawn,
  whether a sheet back grants possessions, whether a component prints an
  Action or a Local Action, the kind of token placed on a mystery.
- Possession skill bonuses, focus tokens and impairment tokens (expansion
  material) are not applied; effects that prevent a loss are applied by hand.
- A toughness printed as a formula is not evaluated; an epic monster is never
  in the cup and never ambushes.
- Ties among nearest spaces, cities or investigators go to board or seat
  order instead of a choice; the space a card names is your reading of it.
- One saved game per browser; files are plain JSON without a signature; the
  tokens a discarded rumor placed are removed with the token controls.

## Developing

Prerequisites: Node 22+ and pnpm 11 (`package.json` pins the package
manager). The content extraction scripts also need `pdfimages` from poppler
(`brew install poppler`) and `magick` from ImageMagick 7
(`brew install imagemagick`).

```
pnpm dev                 # the table with hot reload
pnpm typecheck           # tsc
pnpm test                # vitest, including a seeded random-play test of whole games
pnpm test:fuzz           # the random-play test over sixty seeds; FUZZ_SEEDS=<n> picks any count
pnpm build               # tsc, then vite build
pnpm content:validate    # validate every file under content/
pnpm content:extract-icons
pnpm content:copy-core
pnpm content:board-overlay
```

Source material lives in `inspired/` (gitignored, local only). Committed data
under `content/` and `public/` is the source of truth; the scripts are
one-shot helpers to regenerate it. The panel's own words live in
`content/panel/i18n/en.json` and `ru.json`; the content validator checks the
two hold the same keys and a test checks every key the components use
exists. The build empties `dist/` with a retrying remove, since Finder drops
`.DS_Store` files into it mid-removal.

Changes follow OpenSpec: a proposal, delta specs, a design and tasks under
`openspec/changes/<name>`, applied test-first, then archived with the main
specs under `openspec/specs/` updated. Touch this README at the archive step
when a change adds a modelled rule or a deviation. The game state is plain
JSON with a version; bump `STATE_VERSION` in `src/engine/types.ts` whenever a
field is added, removed or renamed, so older saves are set aside instead of
breaking.
