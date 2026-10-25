# Game Round

The engine's reference for one round. Terms link to `glossary.md`. Page
numbers are PDF pages of `inspired/manual_eng.pdf` (summary) and
`inspired/EH_reference.pdf` (authoritative).

## Setup (core)

1. Gate stack: 9 gate tokens shuffled facedown. Clue pool: clue tokens shuffled facedown. Other tokens in piles.
2. Lead investigator chosen; players pick investigators clockwise, place tokens on the starting space from the sheet back, take starting possessions, full health and sanity.
3. Group chooses an Ancient One, places the sheet, resolves its setup. Return research, special and mystery cards of other Ancient Ones to the box.
4. Non-epic monsters into the cup. Mythos deck: three stages built from the sheet's green, yellow, blue counts, stage I on top, not shuffled together.
5. Expedition cards into one deck. Spell and condition decks faceup. Other decks by card back. Reference card for player count.
6. Doom token on the sheet's starting value; omen token on the green (comet) space.
7. Reserve: top 4 asset cards faceup. Spawn gates per reference card (1 monster each). Active expedition token on the space of the top expedition card. Spawn clues per reference card. Draw 1 mystery and resolve its enters-play effect.

Source: manual_eng.pdf p.3

## 1. Action Phase

Order: lead investigator, then clockwise. Each investigator: up to 2 different actions, each at most once per round, each fully resolved before the next. An investigator may do nothing. A delayed investigator stands the token up instead of acting.

Actions: Travel, Rest, Trade, Prepare for Travel, Acquire Assets, Component Action (including a Local Action on another investigator's component). Expansions add Focus and Gather Resources. Local-path movement is free once per round and is not an action.

Source: manual_eng.pdf p.3, p.9, p.10; EH_reference.pdf p.3, p.20

## 2. Encounter Phase

Order: lead investigator, then clockwise. Each investigator resolves one encounter:

- Monsters on the space: one combat encounter per monster, order of choice, non-epic before epic. If no monster remains afterwards, one more encounter of choice.
- No monsters: a location encounter (regional deck or general deck, choose) or a token encounter: clue (research), gate (other world), active expedition (expedition), rumor token (rumor card's encounter), defeated investigator token (Crippled with a health token, Insane with a sanity token; afterwards remove that investigator from the game).
- A Detained condition replaces the encounter even with monsters present.

Complex encounters (expedition, other world, special): initial effect, then pass or fail effect, then discard.

Source: manual_eng.pdf p.3, p.4; EH_reference.pdf p.5, p.7, p.8, p.12, p.20

## 3. Mythos Phase

The lead investigator draws the top mythos card and resolves only the symbols printed, left to right, top to bottom:

1. Advance omen: move the omen token 1 space clockwise; advance doom by 1 per open gate matching the new omen.
2. Reckoning: monsters on the board, Ancient One sheet, ongoing mythos cards, then each investigator's possessions and conditions clockwise from the lead.
3. Spawn gates: reference-card count; each gate also spawns 1 monster; empty stack and discard means doom advances by 1 instead.
4. Monster surge: reference-card count at each gate matching the omen; no matching gate means spawn 1 gate.
5. Spawn clues: reference-card count, facedown on the printed space.
6. Place rumor token on the named space.
7. Place eldritch tokens on the mythos card.
8. Text effect: Event cards resolve and discard; Ongoing cards enter play by the Ancient One sheet.

A monster spawned with a spawn icon resolves its back-side spawn effect immediately. If no mythos card can be drawn, the phase ends and investigators lose unless they have already won. At the end of the phase the lead investigator may pass the lead token, and players with a defeated or devoured investigator choose an unused one (not after awakening).

Source: manual_eng.pdf p.3, p.4; EH_reference.pdf p.6, p.10, p.20

## Tests

Dice = skill value (printed plus improvement, minus impairment) plus or minus the test modifier and other modifiers; minimum 1 die. Only the highest single skill bonus from possessions applies; additional dice from different effects stack. Success on 5 or 6; at least one success passes; the count of successes is the result. After rolling, spend 1 clue per reroll of 1 die, repeatable; focus tokens reroll the same way where in play. Pass or fail is decided after all rerolls.

Source: manual_eng.pdf p.3, p.8, p.9; EH_reference.pdf p.9, p.10, p.8

## Combat

1. Check monster effects: flip the token, read the back.
2. Will test: if horror exceeds successes, lose sanity equal to the difference.
3. Strength test: if damage exceeds successes, lose health equal to the difference; the monster loses health equal to successes, simultaneously.

Monster health at or above toughness: defeated, back to the cup (epic monsters to the box). A missing test is skipped. Magical and Physical Resistance (expansion) restrict which bonuses apply.

Source: manual_eng.pdf p.3, p.8, p.9; EH_reference.pdf p.2

## Health and Sanity

Lose: discard tokens. Recover: take tokens, never above the maximum. Cannot spend the last health or sanity. 0 in either: defeated.

Source: manual_eng.pdf p.4; EH_reference.pdf p.4

## Delayed, Defeated, Devoured

- Delayed: no actions; token on its side; stand up instead of acting next Action phase. Becoming delayed on one's own turn ends the action and forfeits the rest.
- Defeated: advance doom 1; move to the nearest city, token on its side with a health or sanity token; discard conditions and health, sanity, improvement tokens; possessions stay on the set-aside sheet; pass the lead token; new investigator at the end of the Mythos phase. After awakening: eliminated.
- Devoured: advance doom 1; discard everything; sheet and token to the box; pass the lead token; new investigator at the end of the Mythos phase. After awakening: eliminated.

Source: manual_eng.pdf p.4, p.8; EH_reference.pdf p.4, p.8, p.12

## Awakening and the end of the game

Doom at 0: flip the Ancient One sheet, resolve Awakens effects, the back replaces the front. Win: 3 mysteries solved, plus the final mystery once awakened. Lose: the awakened sheet's condition, all investigators eliminated, a card effect, or an empty mythos deck.

Source: manual_eng.pdf p.4; EH_reference.pdf p.3, p.8

## Expansion rules (summary only)

- General setup: add expansion components, focus tokens, adventure token, impairment tokens if used; unique asset deck faceup beside the asset deck.
- Preludes: draw or choose 1 before setup, or none; no duplicate preludes.
- Focus: action, gain 1 focus (max 2); spend 1 to reroll 1 die.
- Gather Resources (Masks of Nyarlathotep): action, gain 1 resource (max 2); spend during Rest for +1 recovery each, during Acquire Assets for +1 success each; tradeable.
- Unique assets: double-sided, hidden back, unlimited, tradeable; "asset" covers both.
- Impairment: -1 then -2 per skill, not below modified value 1, at most twice; cancels improvement.
- Local paths: free movement along connected local paths once per round, not when delayed.
- Mysteries: advancing the active mystery places 1 token of the named type from the pool, stack or cup; epic monsters to defeat get health on the card reducing toughness; clues to spend go on the card.
- Adventures: enter play faceup, resolve the enters-play effect; completion resolves its effect and draws the next chapter, then discard with its tokens.
- Difficulty: remove hard cards (easier), remove easy cards (harder), staged, insane, starting rumor.

Source: manual_eng.pdf p.9, p.10
