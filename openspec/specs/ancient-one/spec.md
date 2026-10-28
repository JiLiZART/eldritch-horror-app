# ancient-one Specification

## Purpose
Model the Ancient One's end game: doom moved by card text, the awakening at doom 0, mysteries solved by card text and the investigators' victory. Source: `inspired/manual_eng.pdf` p.4 "The Ancient One Awakens", "Winning the Game"; `inspired/EH_reference.pdf` p.3, p.8, p.12.

## Requirements

### Requirement: Doom changes by card text
In the Encounter and Mythos phases the players SHALL advance or retreat doom by 1; doom SHALL never go below 0 nor above the Ancient One's starting value. The log SHALL say the new doom.

#### Scenario: Advanced
- **WHEN** doom is 12 and card text advances doom
- **THEN** doom is 11 and the log says so

#### Scenario: Retreat capped at the start value
- **WHEN** doom stands at Azathoth's starting value and card text retreats doom
- **THEN** it is refused because doom cannot retreat past the start of the track

### Requirement: The Ancient One awakens at doom 0
The moment doom reaches 0 from any cause the Ancient One SHALL awaken once: the state remembers it, the sheet back is shown, and the log says the Awakens effects, the reckoning and the losing condition on the back are left to the players. **Deviation**: the back's text and cultist row are the players' call.

#### Scenario: Awakens on the omen
- **WHEN** doom is 1 and the omen advances onto a colour with a gate
- **THEN** doom is 0, the Ancient One is awakened and the log says the back is left to the players

#### Scenario: Awakens on card text
- **WHEN** doom is 1 and card text advances doom
- **THEN** the Ancient One is awakened

#### Scenario: Awakens once
- **WHEN** an awakened Ancient One's doom is retreated to 1 and advanced to 0 again
- **THEN** it is still awakened and no second awakening is logged

### Requirement: A mystery is solved by card text
In the Encounter and Mythos phases card text SHALL solve the current mystery: it joins the solved pile and the next mystery is drawn from the mystery deck as current. Solving SHALL discard every token placed on it. Once the Ancient One is awakened the final mystery SHALL be solvable too, and before that it SHALL be refused.

#### Scenario: Solved
- **WHEN** Azathoth's current mystery is solved with 3 in the deck
- **THEN** 1 mystery is solved, a new one is current and 2 remain in the deck

#### Scenario: Final mystery before awakening
- **WHEN** the final mystery is solved while the Ancient One sleeps
- **THEN** it is refused because the final mystery is solved after the awakening

#### Scenario: Tokens discarded on solving
- **WHEN** the current mystery holds 2 tokens and is solved
- **THEN** the new current mystery holds none

### Requirement: The investigators win
The game SHALL be won at once when 3 mysteries are solved and the Ancient One is not awakened, or when 3 mysteries and the final mystery are solved after the awakening; the reason SHALL be shown beside the board and no further play SHALL be possible.

#### Scenario: Three solved
- **WHEN** the third mystery is solved while the Ancient One sleeps
- **THEN** the game is won and the reason names 3 mysteries

#### Scenario: Awakened needs the final mystery
- **WHEN** the third mystery is solved after the awakening
- **THEN** the game goes on until the final mystery is solved, then it is won

### Requirement: The end game is shown beside the board
The players SHALL see controls to advance and retreat doom and to solve the current mystery and, once awakened, the final mystery, wherever card text is applied; the Ancient One SHALL be marked awakened with its sheet back shown; the count of solved mysteries SHALL be listed.

#### Scenario: Awakened shown
- **WHEN** the Ancient One awakens
- **THEN** the panel marks it awakened and shows the sheet back

#### Scenario: Won shown
- **WHEN** the game is won
- **THEN** the panel says the investigators win with the reason

### Requirement: Tokens are placed on the mystery by card text
In the Encounter and Mythos phases card text SHALL place a token on the current mystery or remove one; removing from a mystery holding none SHALL be refused saying so. The count SHALL be shown with the mystery. **Deviation**: the token's kind (clue, eldritch, health) is the players' reading of the card; one count serves all.

#### Scenario: Placed
- **WHEN** card text places a token on the mystery twice
- **THEN** the mystery holds 2 tokens and the panel shows the count

#### Scenario: Nothing to remove
- **WHEN** a token is removed from a mystery holding none
- **THEN** it is refused because the mystery holds no token
