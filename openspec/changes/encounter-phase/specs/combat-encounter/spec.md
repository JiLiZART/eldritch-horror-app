## Purpose
Resolve one combat encounter against one monster with the two printed tests. Source: `inspired/manual_eng.pdf` p.3, p.8 "Combat Encounters"; `inspired/EH_reference.pdf` p.2 (Боевой контакт).

## ADDED Requirements

### Requirement: Monsters on the space must be fought
While a monster stands on the investigator's space the investigator SHALL fight each monster there once, one at a time, in the order of their choice, every non-epic monster before an epic one. Fighting a monster on another space, a monster already fought this encounter, or an epic monster while a non-epic one remains SHALL be refused with the rule named.

#### Scenario: Order of choice
- **WHEN** Leo Anderson's space holds a Ghoul and a Cultist and he fights the Cultist first
- **THEN** the Cultist fight resolves and the Ghoul still waits

#### Scenario: Fought once
- **WHEN** Leo Anderson fights the Ghoul that survived his fight this encounter
- **THEN** the fight is refused because each monster is fought once per encounter

#### Scenario: Elsewhere refused
- **WHEN** Leo Anderson fights a Ghoul standing on another space
- **THEN** the fight is refused because combat is against monsters on the investigator's space

### Requirement: Two tests decide the fight
A fight SHALL run the Will test with the token's modifier: sanity lost equals the horror minus the successes when positive. Then the Strength test with the token's modifier: health lost equals the damage minus the successes when positive, and the monster loses health equal to the successes. A test the token does not print SHALL be skipped. A monster whose lost health reaches its toughness SHALL be defeated and returned to the monster cup; otherwise it stays with its lost health. **Deviation**: text on the token back is left to the players; a toughness printed as a formula is not evaluated.

#### Scenario: Losses by the difference
- **WHEN** Leo Anderson fights a Byakhee (horror 1, damage 2, toughness 2) with 0 Will successes and 1 Strength success
- **THEN** he loses 1 sanity and 1 health, and the Byakhee stays with 1 health lost

#### Scenario: Monster defeated
- **WHEN** Leo Anderson fights a Byakhee with 1 Will success and 2 Strength successes
- **THEN** he loses nothing, the Byakhee leaves the board and is in the monster cup

#### Scenario: Wounded monster finished
- **WHEN** a Byakhee with 1 health lost is fought with 1 Strength success
- **THEN** it is defeated

#### Scenario: Missing test skipped
- **WHEN** an investigator fights a monster whose token prints no Will test
- **THEN** no Will dice are rolled and no sanity is lost
