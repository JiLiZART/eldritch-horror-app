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
Each Ancient One entry SHALL record its doom value, its mystery and research card lists, and the mythos deck composition per stage as counts of green, yellow and blue cards.

#### Scenario: Mythos composition
- **WHEN** an Ancient One's stages are read
- **THEN** each of three stages gives a count for green, yellow and blue cards

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
