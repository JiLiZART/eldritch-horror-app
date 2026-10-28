## MODIFIED Requirements

### Requirement: Cards leave play by trait
An event card SHALL be discarded after resolving; an ongoing card (rumor cards among them) SHALL stay in play until a game effect discards it; in the Encounter and Mythos phases card text SHALL discard an ongoing card to the mythos discard, naming it, a card not in play being refused. The ongoing cards SHALL be visible beside the board. **Deviation**: the tokens a discarded rumor placed are removed by the players with the token controls.

#### Scenario: Event discarded
- **WHEN** an event card resolves
- **THEN** it is on the mythos discard and nothing stays in play

#### Scenario: Ongoing kept
- **WHEN** an ongoing card resolves
- **THEN** it is listed in play and not on the discard

#### Scenario: Ongoing card discarded by text
- **WHEN** a rumor card in play is discarded by card text
- **THEN** it is on the mythos discard and no longer listed in play
