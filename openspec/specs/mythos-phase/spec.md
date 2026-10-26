# mythos-phase Specification

## Purpose
Resolve the Mythos phase at the end of each round: draw the top mythos card, apply its printed icons as rules, keep ongoing cards in play, let the lead pass the token, and lose the game when the deck runs out. Source: `inspired/manual_eng.pdf` p.3 "3. Mythos Phase", p.4; `inspired/EH_reference.pdf` p.3 (gate), p.4 (omen), p.6 (monster surge, mythos card), p.13 (clue).

## Requirements

### Requirement: The last turn opens the Mythos phase
When the last investigator finishes their encounter the top mythos card SHALL be drawn and the game SHALL enter the Mythos phase with that card showing. When no card can be drawn the investigators SHALL lose, and the reason SHALL be shown.

#### Scenario: Card drawn
- **WHEN** Lily Chen, the last investigator, finishes her encounter with 16 cards in the mythos deck
- **THEN** the phase is Mythos with the former top card showing and 15 cards remain

#### Scenario: Deck exhausted
- **WHEN** the last investigator finishes their encounter with an empty mythos deck
- **THEN** the game is lost and the reason names the mythos deck

### Requirement: Icons resolve in printed order
Resolving the card SHALL apply its icons left to right: advance omen (move the omen 1 space clockwise, then advance doom by 1 per gate matching the new omen); spawn gates (the reference card number, each with 1 monster from the cup on the gate's space, the gate discard reshuffled when the stack is empty, doom advanced by 1 instead when no gate token is left); monster surge (the reference card number of monsters at each gate matching the omen, or 1 gate when none matches); spawn clues (the reference card number from the pool, none when the pool and discard are empty). Each step SHALL be written to a log in rule words. **Deviation**: reckoning, place rumor, place eldritch tokens and resolve text are logged as left to the players.

#### Scenario: Omen advances doom
- **WHEN** the omen is green, gates stand on Arkham (red) and Rome (green), and a card with only advance omen resolves
- **THEN** the omen is blue and doom is unchanged

#### Scenario: Omen matches a gate
- **WHEN** the omen is blue, a gate stands on Arkham (red), doom is 12, and a card with only advance omen resolves
- **THEN** the omen is red and doom is 11

#### Scenario: Gate spawns a monster
- **WHEN** a card with only spawn gates resolves for 4 investigators with the gate stack topped by London
- **THEN** a gate stands on London with 1 monster from the cup, and the stack is 1 shorter

#### Scenario: No gate token left
- **WHEN** the gate stack and discard are empty and a card with only spawn gates resolves at doom 10
- **THEN** no gate is spawned and doom is 9

#### Scenario: Surge at matching gates
- **WHEN** the omen is red, a gate stands on Arkham (red), and a card with only monster surge resolves for 5 investigators
- **THEN** 2 more monsters stand on Arkham

#### Scenario: Surge without a matching gate
- **WHEN** the omen is green, only Arkham (red) holds a gate, and a card with only monster surge resolves
- **THEN** 1 gate is spawned with its monster

#### Scenario: Clues spawn
- **WHEN** a card with only spawn clues resolves for 3 investigators
- **THEN** 2 clues are placed from the top of the pool on their printed spaces

#### Scenario: Players' steps are logged
- **WHEN** a rumor card with place rumor and resolve text resolves
- **THEN** the log says the rumor token and the card text are left to the players, and the card stays in play

### Requirement: Cards leave play by trait
An event card SHALL be discarded after resolving; an ongoing card (rumor cards among them) SHALL stay in play until a game effect discards it. The ongoing cards SHALL be visible beside the board.

#### Scenario: Event discarded
- **WHEN** an event card resolves
- **THEN** it is on the mythos discard and nothing stays in play

#### Scenario: Ongoing kept
- **WHEN** an ongoing card resolves
- **THEN** it is listed in play and not on the discard

### Requirement: The lead may pass the token
After the card resolves, the lead investigator MAY give the lead token to any other investigator; then the next round begins in the Action phase with the lead active.

#### Scenario: Token passed
- **WHEN** Leo Anderson passes the lead to Lily Chen and the next round starts
- **THEN** Lily Chen holds the token and is active in round 2

#### Scenario: Token kept
- **WHEN** the next round starts without passing
- **THEN** Leo Anderson is still the lead and active

### Requirement: The Mythos phase is shown beside the board
During the Mythos phase the players SHALL see the drawn card image, a button to resolve it, the resolution log, the pass-lead choice and the next-round button; at all times the mythos deck size, the ongoing cards and doom reaching 0 SHALL be visible. **Deviation**: at doom 0 the panel says the Ancient One's awakening is not modelled.

#### Scenario: Card shown
- **WHEN** the Mythos phase begins
- **THEN** the drawn card's image is shown with a Resolve button

#### Scenario: Log shown
- **WHEN** the card is resolved
- **THEN** each applied icon and each step left to the players is listed, with a Next round button and a lead select
