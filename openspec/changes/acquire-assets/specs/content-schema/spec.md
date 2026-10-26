## ADDED Requirements

### Requirement: Asset cards carry their printed value and traits
Each asset card entry SHALL record the value printed in its corner and its trait line in printed order. Validation SHALL fail on an asset without a value or without traits, naming the card.

#### Scenario: Core card
- **WHEN** ".38 Revolver" is read
- **THEN** its value is 1 and its traits are Item, Weapon

#### Scenario: Missing value
- **WHEN** validation runs on an asset card without a value
- **THEN** validation fails and names the card
