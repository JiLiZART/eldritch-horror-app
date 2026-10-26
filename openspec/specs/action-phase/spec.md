# action-phase Specification

## Purpose
Let investigators take their turns in the Action phase: Travel, Rest, Prepare for Travel and Trade, two different actions each, in seat order from the lead investigator. Source: `inspired/manual_eng.pdf` p.3 "1. Action Phase"; `inspired/EH_reference.pdf` p.6–10.

## Requirements

### Requirement: Investigators act in seat order
Starting with the lead investigator and following seat order, one investigator at a time SHALL be active. The active investigator SHALL perform up to 2 actions in the phase, each action at most once, and SHALL be able to end the turn early. When the last seat ends its turn the Mythos phase SHALL begin. **Deviation**: the Encounter phase is not modelled yet, so the Mythos phase follows the Action phase directly, and the players are told so.

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
- **WHEN** the last seat ends its turn and the mythos card is resolved and the next round is started
- **THEN** round 2 begins in the Action phase with the lead investigator active, and the players are told the Encounter phase was skipped

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

### Requirement: Acquire Assets buys from the reserve
Acquire Assets SHALL be allowed only on a city space without a monster. It SHALL test Influence, show the roll, then let the active investigator gain reserve cards whose printed values add up to at most the result; when no card is gained, 1 reserve card MAY be discarded. The reserve SHALL be refilled to 4 from the asset deck, the asset discard reshuffled in when the deck is empty. Until the cards are chosen no other action and no end of turn SHALL be accepted. A choice that breaks these rules SHALL be refused with the rule named and the reserve left as it was. Source: `inspired/manual_eng.pdf` p.3 "Acquire Assets"; `inspired/EH_reference.pdf` p.9 (Приобретение активов), p.10 (Резерв). **Deviation**: the Bank Loan and Debt are not modelled.

#### Scenario: Influence tested
- **WHEN** Charlie Kane on San Francisco with no monster present acquires assets
- **THEN** the Influence dice are shown with the result, and the reserve waits for his choice

#### Scenario: Cards gained
- **WHEN** the result is 3 and Charlie Kane takes a value 1 card and a value 2 card from the reserve
- **THEN** both cards are among his possessions, the reserve holds 4 cards again, and Acquire Assets is spent for the phase

#### Scenario: Too expensive
- **WHEN** the result is 2 and Charlie Kane takes a value 3 card
- **THEN** the choice is refused because the total value exceeds the result, and the reserve is unchanged

#### Scenario: Nothing gained
- **WHEN** the result is 0 and Charlie Kane discards 1 reserve card
- **THEN** that card is on the asset discard, the reserve holds 4 cards again, and Acquire Assets is spent

#### Scenario: Discard only when empty-handed
- **WHEN** Charlie Kane takes a value 1 card and discards another
- **THEN** the choice is refused because a card may be discarded only when none is gained

#### Scenario: Not a city
- **WHEN** an investigator on space 2 acquires assets
- **THEN** the action is refused because Acquire Assets needs a city space

#### Scenario: Monster present
- **WHEN** an investigator on a city with a monster acquires assets
- **THEN** the action is refused naming the monster

#### Scenario: Turn cannot end mid-choice
- **WHEN** Charlie Kane ends his turn after rolling and before choosing
- **THEN** the end of turn is refused until the choice is made

#### Scenario: Deck runs out
- **WHEN** the asset deck is empty, 2 cards sit on the asset discard, and 1 reserve card is gained
- **THEN** the discard is shuffled into the deck and the reserve is refilled from it
