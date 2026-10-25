## Purpose
Let investigators take their turns in the Action phase: Travel, Rest, Prepare for Travel and Trade, two different actions each, in seat order from the lead investigator. Source: `inspired/manual_eng.pdf` p.3 "1. Action Phase"; `inspired/EH_reference.pdf` p.6–10.

## ADDED Requirements

### Requirement: Investigators act in seat order
Starting with the lead investigator and following seat order, one investigator at a time SHALL be active. The active investigator SHALL perform up to 2 actions in the phase, each action at most once, and SHALL be able to end the turn early. When the last seat ends its turn the next round SHALL begin. **Deviation**: the Encounter and Mythos phases are not modelled yet, so the next round's Action phase follows directly, and the players are told so.

#### Scenario: First turn
- **WHEN** a game starts with Leo Anderson then Lily Chen
- **THEN** round 1 is in the Action phase, Leo Anderson is active and has 2 actions left

#### Scenario: Turn passes
- **WHEN** Leo Anderson ends his turn
- **THEN** Lily Chen is active with 2 actions left

#### Scenario: Same action twice refused
- **WHEN** the active investigator who has already rested this phase rests again
- **THEN** the action is refused with the rule that each action may be performed once per phase, and nothing changes

#### Scenario: Third action refused
- **WHEN** the active investigator who has performed 2 actions this phase performs another
- **THEN** the action is refused with the rule that an investigator performs up to 2 actions, and nothing changes

#### Scenario: Round advances
- **WHEN** the last seat ends its turn
- **THEN** round 2 begins in the Action phase with the lead investigator active, and the players are told the Encounter and Mythos phases were skipped

### Requirement: Travel moves along paths
Travel SHALL move the active investigator to an adjacent space, then 1 more space per travel ticket spent, each extra step along a path matching the spent ticket's type. A route that breaks these rules SHALL be refused with the rule named and the investigator SHALL stay put.

#### Scenario: Adjacent move
- **WHEN** Charlie Kane on San Francisco travels to space 5
- **THEN** his pawn stands on space 5 and Travel is spent for the phase

#### Scenario: Ticket move
- **WHEN** Charlie Kane on San Francisco holding a train ticket travels to space 5 and on to Arkham
- **THEN** his pawn stands on Arkham and the train ticket is gone

#### Scenario: Not adjacent
- **WHEN** Charlie Kane on San Francisco travels straight to Arkham without a ticket
- **THEN** the move is refused as not adjacent and he stays on San Francisco

#### Scenario: Wrong ticket
- **WHEN** Charlie Kane on San Francisco holding only a ship ticket travels to space 5 and on to Arkham by the train path
- **THEN** the move is refused because a ship ticket only pays for a ship path, and he stays on San Francisco

### Requirement: Rest recovers health and sanity
Rest SHALL give the active investigator 1 health and 1 sanity, never above the sheet maximums, and SHALL be refused while a monster is on the investigator's space.

#### Scenario: Rest heals
- **WHEN** Akachi Onyele at 4 health and 6 sanity rests
- **THEN** she has 5 health and 7 sanity

#### Scenario: Rest at full
- **WHEN** Akachi Onyele at 5 health and 7 sanity rests
- **THEN** she stays at 5 health and 7 sanity and Rest is spent

#### Scenario: Monster blocks rest
- **WHEN** an investigator on a space holding a monster rests
- **THEN** the action is refused naming the monster rule

### Requirement: Prepare for Travel gains a ticket
Prepare for Travel SHALL give the active investigator 1 train or ship ticket, only on a city space, and only of a type that matches a path connected to that space. An investigator SHALL hold at most 2 tickets; gaining a third SHALL replace a ticket the player names.

#### Scenario: Train ticket
- **WHEN** Norman Withers on Arkham prepares for travel by train
- **THEN** he holds 1 train ticket

#### Scenario: Not a city
- **WHEN** Jacqueline Fine on Tunguska prepares for travel
- **THEN** the action is refused because tickets are gained on city spaces only

#### Scenario: No such path
- **WHEN** an investigator on a city with no ship path prepares for travel by ship
- **THEN** the action is refused because no ship path leaves the space

#### Scenario: Third ticket
- **WHEN** an investigator holding 2 train tickets prepares for travel by ship and gives up a train ticket
- **THEN** he holds 1 train ticket and 1 ship ticket

### Requirement: Trade exchanges possessions on a shared space
Trade SHALL let the active investigator and another investigator on the same space exchange any of their possessions, clue tokens and travel tickets in both directions in one action. Items not held by the giver, or a partner on another space, SHALL be refused.

#### Scenario: Cards and clues
- **WHEN** Charlie Kane, on the same space as Jacqueline Fine, trades Personal Assistant for 1 clue
- **THEN** Jacqueline Fine holds Personal Assistant and Charlie Kane holds 1 more clue

#### Scenario: Different space
- **WHEN** Charlie Kane on San Francisco trades with Lily Chen on Shanghai
- **THEN** the trade is refused because they do not share a space

#### Scenario: Not owned
- **WHEN** an investigator gives a card they do not hold
- **THEN** the trade is refused naming the card

### Requirement: The turn is shown beside the board
While a game is in progress the players SHALL see the round, the phase, the active investigator, the actions left and each investigator's tickets, and the action controls SHALL explain a refusal in the rule's words. A travel route SHALL be previewed on the table before it is confirmed.

#### Scenario: Turn display
- **WHEN** a game starts with Leo Anderson then Lily Chen
- **THEN** the players see round 1, Action phase, Leo Anderson active, 2 actions left, no tickets

#### Scenario: Route preview
- **WHEN** the active investigator picks space 5 and then Arkham as a travel route
- **THEN** both spaces are highlighted on the table and the move happens only on confirmation
