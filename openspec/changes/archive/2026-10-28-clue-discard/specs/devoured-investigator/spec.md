## MODIFIED Requirements

### Requirement: A devoured investigator leaves the game
In the Encounter and Mythos phases card text SHALL devour a standing investigator: doom advances by 1; their assets and artifacts go to their discards, their spells and conditions are shuffled back into their decks, their clue tokens join the clue discard, their tickets and improvements are gone; the pawn leaves the board; their turns are skipped for the rest of the game; the lead passes to the next seat when they held it; when nobody stands the game is lost with the reason shown. Their encounter, when it was theirs, passes to the next seat at once. The log SHALL say who was devoured.

#### Scenario: Devoured
- **WHEN** Leo Anderson holding Hired Muscle, 1 clue and Lore +1 is devoured at doom 12
- **THEN** doom is 11, Hired Muscle is on the asset discard, his clue and improvement are gone, his pawn is off the board and Lily Chen is encountering

#### Scenario: Lead passes
- **WHEN** the lead investigator is devoured
- **THEN** the next seat holds the lead token

#### Scenario: Last one standing
- **WHEN** the only standing investigator is devoured
- **THEN** the game is lost and the reason names the devoured investigator

#### Scenario: Shown
- **WHEN** Leo Anderson is devoured
- **THEN** the status marks him devoured and the Investigator group offered Devour for him

#### Scenario: Clues discarded
- **WHEN** Leo Anderson holding 2 clues is devoured
- **THEN** two clue tokens lie on the clue discard
