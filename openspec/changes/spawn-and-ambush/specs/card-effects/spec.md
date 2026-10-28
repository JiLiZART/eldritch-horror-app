## ADDED Requirements

### Requirement: Gates, clues and monsters are spawned by card text
In the Encounter and Mythos phases the players SHALL spawn a gate, a clue, or a monster on any space they name, by the same rules the Mythos icons follow: the gate opens from the top of the gate stack with 1 monster from the cup, the gate discard reshuffled in first and doom advancing by 1 instead when no token is left; the clue comes from the top of the pool, the clue discard reshuffled in first, none when both are empty; the monster is the top of the cup, moved where its token back says, none when the cup is empty. Each spawn SHALL be logged, and the reshuffles SHALL follow the game seed. **Deviation**: the space a card names is the players' reading; named and set-aside monsters are not offered.

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

### Requirement: A monster ambushes the investigator
In the Encounter phase the encountering investigator SHALL fight the top monster of the cup at once when card text says a monster ambushes them: the monster is not spawned, so its token back does not move it and no spawn effect applies; the fight follows the combat rules; when the fight settles, defeated or not, the monster returns to the cup, and so it does when the investigator is defeated during the fight. With an empty cup the ambush SHALL be refused saying so. **Deviation**: an epic monster is never in the cup and never ambushes.

#### Scenario: Ambushed
- **WHEN** Leo Anderson on Buenos Aires is ambushed with a Color Out of Space on top of the cup
- **THEN** he fights it on Buenos Aires, not on Tunguska, and its Will dice wait

#### Scenario: Back in the cup
- **WHEN** Leo Anderson continues through an ambush the monster survives
- **THEN** the monster is in the cup and not on the board

#### Scenario: Defeated mid-ambush
- **WHEN** Leo Anderson is defeated by the ambushing monster's horror
- **THEN** the monster is in the cup and not on the board

#### Scenario: Empty cup
- **WHEN** an ambush is called with an empty cup
- **THEN** it is refused because the monster cup is empty
