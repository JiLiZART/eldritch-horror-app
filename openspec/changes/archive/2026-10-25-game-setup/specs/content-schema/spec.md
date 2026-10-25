## MODIFIED Requirements

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

## ADDED Requirements

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
