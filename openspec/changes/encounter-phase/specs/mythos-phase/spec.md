## MODIFIED Requirements

### Requirement: The last turn opens the Mythos phase
When the last investigator finishes their encounter the top mythos card SHALL be drawn and the game SHALL enter the Mythos phase with that card showing. When no card can be drawn the investigators SHALL lose, and the reason SHALL be shown.

#### Scenario: Card drawn
- **WHEN** Lily Chen, the last investigator, finishes her encounter with 16 cards in the mythos deck
- **THEN** the phase is Mythos with the former top card showing and 15 cards remain

#### Scenario: Deck exhausted
- **WHEN** the last investigator finishes their encounter with an empty mythos deck
- **THEN** the game is lost and the reason names the mythos deck
