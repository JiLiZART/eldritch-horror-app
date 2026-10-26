## ADDED Requirements

### Requirement: Monsters carry their printed combat values
Each monster entry SHALL record the back of its token: the Will test modifier and horror when a Will test is printed, the Strength test modifier and damage when a Strength test is printed, and the toughness when printed as a number. Validation SHALL fail on a non-epic monster without a toughness or without any test, naming the monster.

#### Scenario: Core token
- **WHEN** the Byakhee is read
- **THEN** its Will test has modifier 0 and horror 1, its Strength test modifier 0 and damage 2, and its toughness is 2

#### Scenario: Missing toughness
- **WHEN** validation runs on a non-epic monster without a toughness
- **THEN** validation fails and names the monster
