## Purpose
Model the Delayed state: card text lays an investigator's token on its side, they cannot perform actions, and their next Action turn stands the token up. Source: `inspired/manual_eng.pdf` p.4 "Delayed"; `inspired/EH_reference.pdf` p.4.

## ADDED Requirements

### Requirement: Card text delays an investigator
In the Encounter and Mythos phases a standing investigator SHALL become delayed by card text; delaying an already delayed investigator SHALL be refused. The delayed investigator SHALL still resolve encounters. **Deviation**: text that ends the delay early is left to the players.

#### Scenario: Delayed by text
- **WHEN** Leo Anderson with an encounter card showing becomes delayed
- **THEN** he is marked delayed and the log says so

#### Scenario: Already delayed
- **WHEN** a delayed investigator becomes delayed again
- **THEN** it is refused because the investigator is already delayed

#### Scenario: Still encounters
- **WHEN** the Encounter phase reaches a delayed Lily Chen
- **THEN** she encounters as usual

### Requirement: A delayed investigator stands up instead of acting
During their Action turn a delayed investigator SHALL have no actions: every action SHALL be refused because a delayed investigator cannot perform actions, and ending the turn SHALL stand the token up so that they are no longer delayed and act normally next round.

#### Scenario: Action refused
- **WHEN** a delayed Leo Anderson rests on his Action turn
- **THEN** the action is refused because a delayed investigator cannot perform actions

#### Scenario: Stands up
- **WHEN** a delayed Leo Anderson ends his Action turn
- **THEN** he is no longer delayed and Lily Chen is active

#### Scenario: Shown beside the board
- **WHEN** a delayed investigator's Action turn begins
- **THEN** the players see that the turn stands the token up and no action control is offered
