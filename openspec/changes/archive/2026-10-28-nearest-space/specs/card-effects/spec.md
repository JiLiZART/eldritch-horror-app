## MODIFIED Requirements

### Requirement: An investigator is moved by card text
In the Encounter and Mythos phases a standing investigator SHALL be moved to any space the players name, without spending a ticket or an action; an unknown space SHALL be refused naming it. A move to a random space SHALL take the space printed on the top clue token of the pool, that token going to the clue discard, the discard being shuffled into an empty pool first; with no clue token anywhere the move SHALL be refused saying the lead investigator chooses the space instead. A move to the nearest space of a kind, or to the nearest space holding a gate or a clue, SHALL take the matching space at the smallest number of paths from the investigator, their own space counting first when it matches; with no matching space the move SHALL be refused naming what was sought. **Deviation**: among several nearest spaces the first in board order is taken instead of the active investigator's choice.

#### Scenario: Moved
- **WHEN** Leo Anderson on Buenos Aires is moved to Arkham by card text
- **THEN** his pawn stands on Arkham and the log says he moves to Arkham

#### Scenario: Unknown space
- **WHEN** an investigator is moved to a space not on the board
- **THEN** it is refused naming the space

#### Scenario: Random space
- **WHEN** Leo Anderson is moved to a random space by card text with London printed on the top clue token
- **THEN** he stands on London and that clue token lies on the clue discard

#### Scenario: No token for a random space
- **WHEN** a random move is called with an empty clue pool and discard
- **THEN** it is refused because the lead investigator chooses the space

#### Scenario: Nearest city
- **WHEN** Leo Anderson on Space 2 is moved to the nearest city by card text
- **THEN** he stands on San Francisco

#### Scenario: Already there
- **WHEN** Leo Anderson on Buenos Aires is moved to the nearest city
- **THEN** he stays on Buenos Aires and the log says so

#### Scenario: Nearest gate
- **WHEN** Leo Anderson on Buenos Aires is moved to the nearest space with a gate while the only gate stands on London
- **THEN** he stands on London

#### Scenario: Nothing matching
- **WHEN** Leo Anderson is moved to the nearest space with a clue while no clue lies on the board
- **THEN** it is refused because no space with a clue exists
