## MODIFIED Requirements

### Requirement: Reserve, expedition and mystery are dealt
The reserve SHALL hold the top 4 cards of the shuffled asset deck. The expedition deck SHALL be shuffled and the active expedition token SHALL lie on the space named by its top card. One mystery SHALL be drawn from the Ancient One's shuffled mysteries as the current mystery; the rest stay in the mystery deck. The research deck SHALL be shuffled, and the Ancient One's special deck too when it has one. Spell, condition, artifact and encounter decks SHALL be shuffled.

#### Scenario: Reserve dealt
- **WHEN** setup finishes
- **THEN** the reserve holds 4 asset cards and the asset deck holds 40 cards minus 4 minus the starting assets dealt

#### Scenario: Active expedition
- **WHEN** setup finishes
- **THEN** the active expedition token lies on one of Antarctica, The Amazon, The Himalayas, The Pyramids, Heart of Africa or Tunguska, matching the top expedition card

#### Scenario: Current mystery
- **WHEN** Cthulhu is set up
- **THEN** one Cthulhu mystery is current and three remain in the mystery deck
