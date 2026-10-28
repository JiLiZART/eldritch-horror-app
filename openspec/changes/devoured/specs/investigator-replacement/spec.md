## MODIFIED Requirements

### Requirement: A defeated investigator is replaced at the end of the Mythos phase
After the mythos card is resolved a defeated or devoured investigator not yet replaced SHALL be replaced by any investigator of the set not yet in the game: the newcomer starts on their printed space with full health and sanity, their starting clues from the pool and their starting cards from the decks, and takes the fallen seat in turn order; a defeated token stays where it lies with its possessions, a devoured one is gone. Replacing an investigator who is standing, already replaced or not in the game, or with an investigator already in the game, SHALL be refused naming the reason. After the awakening the replacement SHALL be refused because the defeated are eliminated. The log SHALL say who takes whose seat.

#### Scenario: Replaced
- **WHEN** Leo Anderson lies defeated and Charlie Kane replaces him after the mythos card is resolved
- **THEN** Charlie Kane stands on his starting space with his starting kit, acts in Leo Anderson's seat next round, and Leo Anderson's token still lies on its city

#### Scenario: Already in the game
- **WHEN** Lily Chen, already playing, is chosen to replace Leo Anderson
- **THEN** it is refused because she is already in the game

#### Scenario: Twice
- **WHEN** a replaced Leo Anderson is replaced again
- **THEN** it is refused because he is already replaced

#### Scenario: Eliminated
- **WHEN** Leo Anderson is defeated after the Ancient One awakened and a replacement is chosen
- **THEN** it is refused because defeated investigators are eliminated after the awakening

#### Scenario: Devoured replaced
- **WHEN** Leo Anderson was devoured and Charlie Kane replaces him after the mythos card is resolved
- **THEN** Charlie Kane acts in Leo Anderson's seat next round
