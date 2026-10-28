## MODIFIED Requirements

### Requirement: Two tests decide the fight
A fight SHALL run the Will test with the token's modifier and wait; on continuing, sanity lost equals the horror minus the successes when positive. Then the Strength test with the token's modifier SHALL be rolled and wait; on continuing, health lost equals the damage minus the successes when positive, and the monster loses health equal to the successes. A test the token does not print SHALL be skipped. A monster whose lost health reaches its toughness SHALL be defeated and shuffled back into the monster cup, the cup's order drawn from the game seed, a set-aside monster being set aside again instead; otherwise it stays with its lost health. While a fight waits, no encounter card SHALL be drawn, no other fight started and the encounter SHALL not finish. **Deviation**: text on the token back is left to the players; a toughness printed as a formula is not evaluated. A loss of health or sanity greater than what the investigator has SHALL leave zero, never a negative number, and the defeat that follows SHALL record zero on the side that fell.

#### Scenario: Losses by the difference
- **WHEN** Leo Anderson fights a Byakhee (horror 1, damage 2, toughness 2) and continues through 0 Will successes and 1 Strength success
- **THEN** he loses 1 sanity and 1 health, and the Byakhee stays with 1 health lost

#### Scenario: Monster defeated
- **WHEN** Leo Anderson fights a Byakhee and continues through 1 Will success and 2 Strength successes
- **THEN** he loses nothing, the Byakhee leaves the board and is in the monster cup

#### Scenario: Wounded monster finished
- **WHEN** a Byakhee with 1 health lost is fought and the Strength test is continued with 1 success
- **THEN** it is defeated

#### Scenario: Missing test skipped
- **WHEN** an investigator fights a monster whose token prints no Will test
- **THEN** no Will dice are rolled and the Strength dice wait at once

#### Scenario: Fight waits
- **WHEN** Leo Anderson's Will dice wait and he draws an encounter card
- **THEN** it is refused because the fight is not over

#### Scenario: Cup shuffled
- **WHEN** a Byakhee is defeated with three monsters in the cup
- **THEN** the cup holds four monsters in a seeded order, the Byakhee among them, not necessarily last

#### Scenario: Set-aside monster defeated
- **WHEN** a Deep One from the set-aside pile is defeated in combat
- **THEN** it is set aside again and not in the cup

#### Scenario: Damage past zero
- **WHEN** Leo Anderson has 1 health and the Strength test leaves him losing 2
- **THEN** his health is 0, he is defeated by health, and no number below zero is recorded
