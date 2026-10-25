# game-setup Specification

## Purpose
Produce the start-of-game state from the chosen Ancient One, investigators and difficulty by following the printed setup steps, so every later phase starts from a legal position. Source: `inspired/manual_eng.pdf` p.3 "Setup"; `inspired/EH_reference.pdf` p.2 (doom), p.10 (reserve), p.11 (clue pool).

## Requirements

### Requirement: Setup accepts a legal group
Setup SHALL take an Ancient One from the set, one to eight distinct investigators in seat order, a mythos difficulty (normal, easy or hard) and a random seed, and SHALL refuse any other input with a message naming the broken rule. The first seat holds the lead investigator token. Setup SHALL also start round 1 in the Action phase with the lead investigator active, no actions taken and no travel tickets.

#### Scenario: Nine investigators
- **WHEN** setup is asked for nine investigators
- **THEN** setup is refused and the message names the limit of eight

#### Scenario: Duplicate investigator
- **WHEN** the same investigator appears twice in seat order
- **THEN** setup is refused and the message names the investigator

#### Scenario: Lead investigator
- **WHEN** setup finishes for Leo Anderson then Lily Chen
- **THEN** Leo Anderson holds the lead investigator token

#### Scenario: First turn is the lead's
- **WHEN** a game starts with Leo Anderson then Lily Chen
- **THEN** round 1 is in the Action phase, Leo Anderson is active with no action taken, and nobody holds a travel ticket

### Requirement: Investigators start as printed
Each chosen investigator SHALL stand on the starting space printed on the sheet back with full health and sanity and SHALL hold the printed starting possessions: starting cards leave their decks, starting clues leave the clue pool.

#### Scenario: Akachi Onyele
- **WHEN** Akachi Onyele is set up
- **THEN** she stands on space 15 with 5 health and 7 sanity, holds Mists of Releh and 1 clue, and the clue pool holds one token fewer

#### Scenario: Starting asset leaves the deck
- **WHEN** Charlie Kane is set up
- **THEN** he holds Personal Assistant and Personal Assistant is not in the asset deck or the reserve

### Requirement: Doom and omen start on the sheet values
The doom token SHALL start on the Ancient One's printed doom value and the omen token on the green (comet) space. An Ancient One whose sheet places eldritch tokens on the omen track at setup SHALL have them placed on the green space.

#### Scenario: Cthulhu doom
- **WHEN** Cthulhu is the Ancient One
- **THEN** doom is 12 and the omen is green

#### Scenario: Azathoth eldritch token
- **WHEN** Azathoth is the Ancient One
- **THEN** 1 eldritch token lies on the green omen space

### Requirement: The monster cup holds the right tokens
The monster cup SHALL hold every non-epic monster token of the set as many times as the token count, minus the monsters the Ancient One sheet sets aside; set-aside monsters SHALL be recorded apart from the cup and never enter it. Epic monsters SHALL not be in the cup.

#### Scenario: Core cup
- **WHEN** Azathoth is the Ancient One
- **THEN** the cup holds 34 tokens, among them 5 Cultists, 2 Ghouls and 2 Goat Spawn, and no epic monster

#### Scenario: Cthulhu sets monsters aside
- **WHEN** Cthulhu is the Ancient One
- **THEN** one Deep One and one Star Spawn are set aside and the cup holds neither

### Requirement: The mythos deck is built in stages
The mythos deck SHALL be built from three stages using the Ancient One's printed counts of green, yellow and blue cards, each stage shuffled on its own, stage I on top, stage II below it, stage III at the bottom. Normal difficulty uses every card; easy difficulty uses no hard cards; hard difficulty uses no easy cards (rulebook variant). Setup SHALL be refused when a colour lacks enough cards, naming the colour.

#### Scenario: Azathoth normal deck
- **WHEN** Azathoth is set up at normal difficulty
- **THEN** the deck has 16 cards: the first 4 are 1 green, 2 yellow and 1 blue; the next 6 are 2 green, 3 yellow and 1 blue; the last 6 are 2 green and 4 yellow

#### Scenario: Hard difficulty
- **WHEN** any Ancient One is set up at hard difficulty
- **THEN** no easy mythos card is in the deck

#### Scenario: Not enough cards
- **WHEN** an Ancient One asks for more blue cards than the difficulty allows
- **THEN** setup is refused and the message names blue

### Requirement: Gates and clues spawn per the reference card
The gate stack SHALL hold one shuffled gate token per named core city (numbered city spaces have no gate token); the clue pool one shuffled clue token per core space. Setup SHALL spawn gates and clues by investigator count as printed on the reference cards: 1–2 investigators 1 gate and 1 clue; 3–4 investigators 1 gate and 2 clues; 5–6 investigators 2 gates and 3 clues; 7–8 investigators 2 gates and 4 clues. Each spawned gate lies on the city printed on its token with one monster drawn from the cup; a monster whose back says to move when spawned stands on that space instead. Each spawned clue lies on the space printed on its token. The reference card's monster surge value SHALL be kept in the state for later phases (1, 2, 2, 3 for the same groups).

#### Scenario: Four investigators
- **WHEN** four investigators are set up
- **THEN** one gate stands on a named core city with one monster, two clues lie on two different core spaces, the gate stack holds 8 tokens and the monster surge value is 2

#### Scenario: Seven investigators
- **WHEN** seven investigators are set up
- **THEN** two gates stand on two different cities, each with one monster, and four clues lie on the board

#### Scenario: Spawn relocation
- **WHEN** the monster drawn for the gate on London is Color Out of Space
- **THEN** the gate stays on London and Color Out of Space stands on Tunguska

### Requirement: Reserve, expedition and mystery are dealt
The reserve SHALL hold the top 4 cards of the shuffled asset deck. The expedition deck SHALL be shuffled and the active expedition token SHALL lie on the space named by its top card. One mystery SHALL be drawn from the Ancient One's shuffled mysteries as the current mystery; the rest stay in the mystery deck. The research deck SHALL be shuffled. Spell, condition, artifact and encounter decks SHALL be shuffled.

#### Scenario: Reserve dealt
- **WHEN** setup finishes
- **THEN** the reserve holds 4 asset cards and the asset deck holds 40 cards minus 4 minus the starting assets dealt

#### Scenario: Active expedition
- **WHEN** setup finishes
- **THEN** the active expedition token lies on one of Antarctica, The Amazon, The Himalayas, The Pyramids, Heart of Africa or Tunguska, matching the top expedition card

#### Scenario: Current mystery
- **WHEN** Cthulhu is set up
- **THEN** one Cthulhu mystery is current and three remain in the mystery deck

### Requirement: Setup is reproducible
The same seed and the same choices SHALL produce an identical state, so a game can be replayed or shared by seed.

#### Scenario: Same seed
- **WHEN** setup runs twice with the same seed, Ancient One, investigators and difficulty
- **THEN** both states are identical, including every deck order and every spawned space
