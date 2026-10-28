## MODIFIED Requirements

### Requirement: Gates, clues and monsters are spawned by card text
In the Encounter and Mythos phases the players SHALL spawn a gate, a clue, or a monster on any space they name, by the same rules the Mythos icons follow: the gate opens from the top of the gate stack with 1 monster from the cup, the gate discard reshuffled in first and doom advancing by 1 instead when no token is left; the clue comes from the top of the pool, the clue discard reshuffled in first, none when both are empty; the monster is the top of the cup, moved where its token back says, none when the cup is empty; a monster spawned on a random space takes the space of the top clue token of the pool, that token going to the clue discard, and is refused with no clue token anywhere. Each spawn SHALL be logged, and the reshuffles SHALL follow the game seed. A set-aside monster of a named kind SHALL be spawned on any space the players name when one of that kind is still set aside, moved where its token back says; with every token of that kind on the board the spawn SHALL be refused naming the kind. A monster of a named kind SHALL be spawned from the cup on any space the players name when the cup holds one, taken from wherever it lies in the cup and moved where its token back says; with none of that kind in the cup the spawn SHALL be refused naming the kind. **Deviation**: the space a card names is the players' reading.

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

#### Scenario: Named monster spawned
- **WHEN** card text spawns a Cultist on London with Cultists in the cup
- **THEN** a Cultist from the cup stands on London and the cup is one shorter

#### Scenario: None of the kind
- **WHEN** card text spawns a Cultist with no Cultist in the cup
- **THEN** it is refused because no Cultist is in the cup
