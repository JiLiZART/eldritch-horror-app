## MODIFIED Requirements

### Requirement: A monster is moved by card text
In the Encounter and Mythos phases a monster on the board SHALL be moved to any space the players name, or 1 space toward the nearest standing investigator along a shortest route; a monster already on a space with a standing investigator SHALL stay where it is. A monster not on the board or an unknown space SHALL be refused naming it. The log SHALL say where the monster moves. When several investigators are equally near, or several neighbouring spaces each start a shortest route, the players SHALL choose the step among those spaces, as the active investigator does at the table; a step that is not on a shortest route to a nearest investigator SHALL be refused naming the spaces that are; with one such space no choice is asked. **Deviation**: moving an epic monster is the players' call.

#### Scenario: Moved to a named space
- **WHEN** a Byakhee on London is moved to Arkham by card text
- **THEN** the Byakhee stands on Arkham and the log says it moves to Arkham

#### Scenario: Toward the nearest investigator
- **WHEN** a Byakhee on Arkham moves toward the nearest investigator while Leo Anderson is on London and Lily Chen on Shanghai
- **THEN** the Byakhee stands on London and the log says it moves to London

#### Scenario: Already with an investigator
- **WHEN** a Byakhee on London moves toward the nearest investigator while Leo Anderson is on London
- **THEN** the Byakhee stays on London and the log says it is already with Leo Anderson

#### Scenario: Not on the board
- **WHEN** a monster that is not on the board is moved
- **THEN** it is refused naming the monster

#### Scenario: A tie among steps
- **WHEN** a Byakhee on a space with two neighbours each one path from an investigator moves toward the nearest investigator
- **THEN** the move waits for the players to name one of the two neighbours, steps there, and refuses any other space naming both
