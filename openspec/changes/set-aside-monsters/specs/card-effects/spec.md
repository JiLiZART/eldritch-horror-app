## MODIFIED Requirements

### Requirement: Gates, clues and monsters are spawned by card text
In the Encounter and Mythos phases the players SHALL spawn a gate, a clue, or a monster on any space they name, by the same rules the Mythos icons follow: the gate opens from the top of the gate stack with 1 monster from the cup, the gate discard reshuffled in first and doom advancing by 1 instead when no token is left; the clue comes from the top of the pool, the clue discard reshuffled in first, none when both are empty; the monster is the top of the cup, moved where its token back says, none when the cup is empty; a monster spawned on a random space takes the space of the top clue token of the pool, that token going to the clue discard, and is refused with no clue token anywhere. Each spawn SHALL be logged, and the reshuffles SHALL follow the game seed. A set-aside monster of a named kind SHALL be spawned on any space the players name when one of that kind is still set aside, moved where its token back says; with every token of that kind on the board the spawn SHALL be refused naming the kind. **Deviation**: the space a card names is the players' reading; named monsters from the cup are not offered.

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

#### Scenario: Set-aside monster spawned
- **WHEN** Cthulhu's text spawns a Deep One on Shanghai
- **THEN** the set-aside Deep One stands on Shanghai and one fewer monster is set aside

#### Scenario: None set aside
- **WHEN** a second Deep One is spawned with the only one on the board
- **THEN** it is refused because no Deep One is set aside

### Requirement: A monster is discarded by card text
In the Encounter and Mythos phases a monster on the board SHALL be discarded by card text: a non-epic monster is shuffled back into the monster cup, a set-aside monster is set aside again, an epic monster leaves the game. The log SHALL say where the monster went.

#### Scenario: Returns to the cup
- **WHEN** a Byakhee on London is discarded by card text
- **THEN** no Byakhee stands on London, the cup holds it, and the log says it returns to the cup

#### Scenario: Epic leaves the game
- **WHEN** an epic monster on Arkham is discarded by card text
- **THEN** it is neither on the board nor in the cup, and the log says it leaves the game

#### Scenario: Set aside again
- **WHEN** a Deep One spawned from the set-aside pile is discarded by card text
- **THEN** it is set aside again and not in the cup
