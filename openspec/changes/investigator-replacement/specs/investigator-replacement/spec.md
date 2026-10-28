## Purpose
Model what the rules do with a defeated investigator's player: at the end of the Mythos phase they take a previously unused investigator, prepared as at setup, unless the Ancient One has awakened. Source: `inspired/manual_eng.pdf` p.4 "Defeated", "The Ancient One Awakens"; `inspired/EH_reference.pdf` p.12.

## ADDED Requirements

### Requirement: A defeated investigator is replaced at the end of the Mythos phase
After the mythos card is resolved a defeated investigator not yet replaced SHALL be replaced by any investigator of the set not yet in the game: the newcomer starts on their printed space with full health and sanity, their starting clues from the pool and their starting cards from the decks, and takes the fallen seat in turn order; the fallen token stays where it lies with its possessions. Replacing an investigator who is standing, already replaced or not in the game, or with an investigator already in the game, SHALL be refused naming the reason. After the awakening the replacement SHALL be refused because the defeated are eliminated. The log SHALL say who takes whose seat.

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

### Requirement: The next round waits for the replacements
While a defeated investigator is not replaced, the Ancient One sleeps and an unused investigator remains, the next round SHALL be refused saying the defeated investigator is replaced first; with no unused investigator left the next round goes on.

#### Scenario: Waits
- **WHEN** Leo Anderson lies defeated and unreplaced and the next round is started
- **THEN** it is refused because the defeated investigator is replaced first

#### Scenario: Nobody left
- **WHEN** every investigator of the set is in the game and one lies defeated
- **THEN** the next round starts

### Requirement: Replacement is offered beside the board
In the Mythos phase after the card is resolved the players SHALL see, for each unreplaced defeated investigator, a choice of unused investigators and a control to replace; Status SHALL mark a replaced investigator with the newcomer's name.

#### Scenario: Offered
- **WHEN** the mythos card is resolved with Leo Anderson defeated
- **THEN** a replacement choice for Leo Anderson is shown with Charlie Kane among the options
