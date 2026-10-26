## ADDED Requirements

### Requirement: Mythos cards carry their printed icons
Each mythos card entry SHALL record its trait (event or ongoing, the ids of `mythosTraits`; a rumor card is ongoing with a place rumor effect) and its icon effects in printed order using the ids of `content/rules/enums.json` `mythosEffects`. Validation SHALL fail on an unknown trait or effect id, naming the card.

#### Scenario: Core card
- **WHEN** "A Proposition" is read
- **THEN** it is an event with effects advance omen, reckoning, spawn clues in that order

#### Scenario: Unknown effect
- **WHEN** validation runs on a card whose effects include an id not in the enum
- **THEN** validation fails and names the card
