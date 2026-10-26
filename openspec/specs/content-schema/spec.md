# content-schema Specification

## Purpose
Define what a set of game content contains and guarantee that the data on disk conforms, starting with the core set.

## Requirements

### Requirement: Sets declare their components
Each set SHALL be identified by a stable id (core set is `eh01`) and declare its investigators, Ancient Ones, monsters, card decks (asset, spell, condition, artifact, unique asset), encounter decks by region or kind, mythos cards by color and difficulty, and preludes, each as a list of entries with a unique id and display name.

#### Scenario: Core set loads
- **WHEN** the core set is loaded
- **THEN** it has 12 investigators, 4 Ancient Ones, and encounter decks for America, Europe, Asia, General, Other World and Expedition

#### Scenario: Duplicate id
- **WHEN** validation runs on a set where two cards share an id
- **THEN** validation fails and names the id

### Requirement: Investigators carry their printed setup
Each investigator entry SHALL record health, sanity, the five skill values, starting space, starting possessions and personal story name, matching the investigator sheet.

#### Scenario: Investigator sheet data
- **WHEN** Akachi Onyele is read
- **THEN** health is 5, sanity is 7, starting space is space 15, and starting possessions include one clue and the spell Mists of Releh

### Requirement: Ancient Ones carry doom and mythos composition
Each Ancient One entry SHALL record its doom value, its mystery and research card lists, the mythos deck composition per stage as counts of green, yellow and blue cards, and its printed setup: monsters set aside by monster id and count, and eldritch tokens placed on the omen track. Set-aside monster ids SHALL resolve to monsters of the same set.

#### Scenario: Mythos composition
- **WHEN** an Ancient One's stages are read
- **THEN** each of three stages gives a count for green, yellow and blue cards

#### Scenario: Cthulhu setup
- **WHEN** Cthulhu's entry is read
- **THEN** it sets aside 1 Deep One and 1 Star Spawn

#### Scenario: Unknown set-aside monster
- **WHEN** validation runs on an Ancient One that sets aside a monster id the set does not have
- **THEN** validation fails and names the id

### Requirement: Every card references an image
Each card, monster, investigator and Ancient One entry SHALL reference an image file that exists, with back images where the component is double-sided.

#### Scenario: Missing image
- **WHEN** validation runs and an entry references an image that is not on disk
- **THEN** validation fails and names the entry

### Requirement: Validation runs as one command
All content data SHALL be validated by a single command that exits non-zero on the first failure and reports all failures it found.

#### Scenario: Clean data
- **WHEN** the validation command runs on committed data
- **THEN** it exits zero

### Requirement: Attribution is recorded
The content directory SHALL carry a notice naming Fantasy Flight Games as the rights holder of the artwork and the non-commercial fan nature of the project.

#### Scenario: Notice present
- **WHEN** the content directory is listed
- **THEN** an attribution file is present and names the rights holder

### Requirement: Monsters carry token count and spawn relocation
Each monster entry SHALL record how many identical tokens the set holds (default 1) and, when the token back moves the monster on spawn, the space it moves to. Source: monster token backs; mirrored in the mod's `src/Templates/01 Core/eh01 - token - monsters.json`.

#### Scenario: Token counts
- **WHEN** the core monsters are read
- **THEN** Cultist has 5 tokens, Ghoul 2, Goat Spawn 2, and the non-epic tokens total 34

#### Scenario: Spawn relocation
- **WHEN** Color Out of Space is read
- **THEN** its spawn relocation is Tunguska

#### Scenario: Unknown relocation space
- **WHEN** validation runs on a monster whose relocation space is not on the board
- **THEN** validation fails and names the monster

### Requirement: Mythos cards carry their printed icons
Each mythos card entry SHALL record its trait (event or ongoing, the ids of `mythosTraits`; a rumor card is ongoing with a place rumor effect) and its icon effects in printed order using the ids of `content/rules/enums.json` `mythosEffects`. Validation SHALL fail on an unknown trait or effect id, naming the card.

#### Scenario: Core card
- **WHEN** "A Proposition" is read
- **THEN** it is an event with effects advance omen, reckoning, spawn clues in that order

#### Scenario: Unknown effect
- **WHEN** validation runs on a card whose effects include an id not in the enum
- **THEN** validation fails and names the card

### Requirement: Asset cards carry their printed value and traits
Each asset card entry SHALL record the value printed in its corner and its trait line in printed order. Validation SHALL fail on an asset without a value or without traits, naming the card.

#### Scenario: Core card
- **WHEN** ".38 Revolver" is read
- **THEN** its value is 1 and its traits are Item, Weapon

#### Scenario: Missing value
- **WHEN** validation runs on an asset card without a value
- **THEN** validation fails and names the card
