## MODIFIED Requirements

### Requirement: The last turn opens the Mythos phase
When the last investigator finishes their encounter the top mythos card SHALL be drawn and the game SHALL enter the Mythos phase with that card showing. When no card can be drawn the investigators SHALL lose, and the reason SHALL be shown.

#### Scenario: Card drawn
- **WHEN** Lily Chen, the last investigator, finishes her encounter with 16 cards in the mythos deck
- **THEN** the phase is Mythos with the former top card showing and 15 cards remain

#### Scenario: Deck exhausted
- **WHEN** the last investigator finishes their encounter with an empty mythos deck
- **THEN** the game is lost and the reason names the mythos deck

### Requirement: The Mythos phase is shown beside the board
During the Mythos phase the players SHALL see the drawn card image, a button to resolve it, the resolution log, the pass-lead choice and the next-round button; at all times the mythos deck size, the ongoing cards and doom reaching 0 SHALL be visible. **Deviation**: at doom 0 the panel says the Ancient One's awakening is not modelled.

#### Scenario: Card shown
- **WHEN** the Mythos phase begins
- **THEN** the drawn card's image is shown with a Resolve button

#### Scenario: Log shown
- **WHEN** the card is resolved
- **THEN** each applied icon and each step left to the players is listed, with a Next round button and a lead select
