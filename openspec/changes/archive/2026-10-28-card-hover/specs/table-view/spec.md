## ADDED Requirements

### Requirement: Card faces name themselves on hover
Pointing at a card face on the table (a reserve card, the Ancient One sheet, the mystery card, an ongoing mythos card, an investigator sheet or a held card) SHALL show its name beside it until the pointer leaves, a reserve card with its value as well, in the badge the pieces use.

#### Scenario: Hover names a reserve card
- **WHEN** the pointer rests on the first reserve card
- **THEN** a badge shows the card's name and its value, and vanishes when the pointer leaves

#### Scenario: Hover names a sheet
- **WHEN** the pointer rests on Lily Chen's sheet
- **THEN** the badge reads Lily Chen
