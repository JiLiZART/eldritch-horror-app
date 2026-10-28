## MODIFIED Requirements

### Requirement: An investigator is moved by card text
In the Encounter and Mythos phases a standing investigator SHALL be moved to any space the players name, without spending a ticket or an action; an unknown space SHALL be refused naming it. A move to a random space SHALL take the space printed on the top clue token of the pool, that token going to the clue discard, the discard being shuffled into an empty pool first; with no clue token anywhere the move SHALL be refused saying the lead investigator chooses the space instead. **Deviation**: which space is "nearest" is the players' call.

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

### Requirement: Gates, clues and monsters are spawned by card text
In the Encounter and Mythos phases the players SHALL spawn a gate, a clue, or a monster on any space they name, by the same rules the Mythos icons follow: the gate opens from the top of the gate stack with 1 monster from the cup, the gate discard reshuffled in first and doom advancing by 1 instead when no token is left; the clue comes from the top of the pool, the clue discard reshuffled in first, none when both are empty; the monster is the top of the cup, moved where its token back says, none when the cup is empty; a monster spawned on a random space takes the space of the top clue token of the pool, that token going to the clue discard, and is refused with no clue token anywhere. Each spawn SHALL be logged, and the reshuffles SHALL follow the game seed. **Deviation**: the space a card names is the players' reading; named and set-aside monsters are not offered.

#### Scenario: Gate spawned
- **WHEN** card text spawns a gate with London on top of the stack
- **THEN** a gate stands on London with a monster from the cup beside it and the log says so

#### Scenario: Monster spawned on a named space
- **WHEN** card text spawns a monster on Buenos Aires
- **THEN** the top monster of the cup stands on Buenos Aires, or where its token back sends it

#### Scenario: Clue spawned
- **WHEN** card text spawns a clue
- **THEN** the top clue of the pool lies on its printed space

#### Scenario: Cup empty
- **WHEN** card text spawns a monster with an empty cup
- **THEN** no monster appears and the log says the cup is empty

#### Scenario: Monster on a random space
- **WHEN** card text spawns a monster on a random space with London printed on the top clue token
- **THEN** the monster spawns on London, or where its back sends it, and the token lies on the clue discard
