## ADDED Requirements

### Requirement: A monster is moved by card text
In the Encounter and Mythos phases a monster on the board SHALL be moved to any space the players name, or 1 space toward the nearest standing investigator along a shortest route; a monster already on a space with a standing investigator SHALL stay where it is. A monster not on the board or an unknown space SHALL be refused naming it. The log SHALL say where the monster moves. **Deviation**: a tie among nearest investigators is broken by seat order, a tie among routes by board order, instead of the active investigator's choice; moving an epic monster is the players' call.

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

### Requirement: A monster is discarded by card text
In the Encounter and Mythos phases a monster on the board SHALL be discarded by card text: a non-epic monster returns to the monster cup, an epic monster leaves the game. The log SHALL say where the monster went. **Deviation**: the cup is not reshuffled on return, as after combat; set-aside monsters return to the cup too.

#### Scenario: Returns to the cup
- **WHEN** a Byakhee on London is discarded by card text
- **THEN** no Byakhee stands on London, the cup holds it, and the log says it returns to the cup

#### Scenario: Epic leaves the game
- **WHEN** an epic monster on Arkham is discarded by card text
- **THEN** it is neither on the board nor in the cup, and the log says it leaves the game

## MODIFIED Requirements

### Requirement: The effects are offered beside the board
During the Encounter phase and after the mythos card is resolved the players SHALL see, for a chosen standing investigator, controls to change health and sanity, gain and spend a clue, close the gate on their space, gain a card from a deck or by name, and discard a held card; and, for a chosen monster on the board, controls to move it to a named space, move it toward the nearest investigator and discard it; a refusal SHALL be explained in the rule's words, and each investigator's conditions SHALL be listed.

#### Scenario: Controls shown
- **WHEN** Leo Anderson has an encounter card showing
- **THEN** the health, sanity, clue, gate and card controls are shown for him

#### Scenario: Monster controls shown
- **WHEN** a Byakhee stands on London while an encounter card is showing
- **THEN** the Byakhee on London can be chosen with Move, Toward nearest investigator and Discard controls

#### Scenario: Refusal explained
- **WHEN** Leo Anderson gains a clue with no clue anywhere
- **THEN** the panel says no clue can be gained
