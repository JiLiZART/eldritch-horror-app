## MODIFIED Requirements

### Requirement: A monster is discarded by card text
In the Encounter and Mythos phases a monster on the board SHALL be discarded by card text: a non-epic monster is shuffled back into the monster cup, an epic monster leaves the game. The log SHALL say where the monster went. **Deviation**: set-aside monsters return to the cup too.

#### Scenario: Returns to the cup
- **WHEN** a Byakhee on London is discarded by card text
- **THEN** no Byakhee stands on London, the cup holds it, and the log says it returns to the cup

#### Scenario: Epic leaves the game
- **WHEN** an epic monster on Arkham is discarded by card text
- **THEN** it is neither on the board nor in the cup, and the log says it leaves the game

### Requirement: A monster ambushes the investigator
In the Encounter phase the encountering investigator SHALL fight the top monster of the cup at once when card text says a monster ambushes them: the monster is not spawned, so its token back does not move it and no spawn effect applies; the fight follows the combat rules; when the fight settles, defeated or not, the monster is shuffled back into the cup, and so it is when the investigator is defeated during the fight. With an empty cup the ambush SHALL be refused saying so. **Deviation**: an epic monster is never in the cup and never ambushes.

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
