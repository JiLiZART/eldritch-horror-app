## MODIFIED Requirements

### Requirement: Card text delays an investigator
In the Encounter and Mythos phases a standing investigator SHALL become delayed by card text; delaying an already delayed investigator SHALL be refused. The delayed investigator SHALL still resolve encounters. Card text that ends the delay early SHALL stand the token up at once; standing up an investigator who is not delayed SHALL be refused saying so.

#### Scenario: Delayed by text
- **WHEN** Leo Anderson with an encounter card showing becomes delayed
- **THEN** he is marked delayed and the log says so

#### Scenario: Already delayed
- **WHEN** a delayed investigator becomes delayed again
- **THEN** it is refused because the investigator is already delayed

#### Scenario: Still encounters
- **WHEN** the Encounter phase reaches a delayed Lily Chen
- **THEN** she encounters as usual

#### Scenario: Stood up by text
- **WHEN** a delayed Leo Anderson is stood up by card text
- **THEN** he is no longer delayed and the log says so

#### Scenario: Not delayed
- **WHEN** card text stands up an investigator who is not delayed
- **THEN** it is refused because the investigator is not delayed
