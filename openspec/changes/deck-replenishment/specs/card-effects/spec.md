## MODIFIED Requirements

### Requirement: Cards are gained and discarded
Gaining a card from a deck SHALL take the top card of the asset or artifact deck, the bottom card of the spell or condition deck, or the first card of that deck matching a given name; an empty asset or artifact deck SHALL first be rebuilt by shuffling its discard; a spell or condition whose name the investigator already holds SHALL be refused, and a deck with nothing to draw or an absent name SHALL be refused naming the deck. Assets, artifacts and spells join the investigator's possessions; conditions are held apart and SHALL NOT be traded. Discarding a held card SHALL put an asset on the asset discard, an artifact on the artifact discard, and shuffle a spell or condition back into its deck. **Deviation**: card text, including "flip this card", is left to the players.

#### Scenario: Random spell
- **WHEN** Leo Anderson gains a spell with no name given
- **THEN** he holds the former bottom card of the spell deck

#### Scenario: Named condition
- **WHEN** Lily Chen gains the Cursed condition
- **THEN** she holds Cursed, listed among her conditions, and the condition deck holds one Cursed fewer

#### Scenario: Duplicate refused
- **WHEN** Lily Chen holding Cursed gains the Cursed condition
- **THEN** it is refused because she already has that condition

#### Scenario: Condition not tradeable
- **WHEN** Lily Chen trades her Cursed card to Leo Anderson on the same space
- **THEN** the trade is refused because conditions are not possessions

#### Scenario: Spell discarded
- **WHEN** Leo Anderson discards a held spell
- **THEN** it is back somewhere in the spell deck and not among his possessions

#### Scenario: Asset discarded
- **WHEN** Leo Anderson discards a held asset
- **THEN** it is on top of the asset discard

#### Scenario: Artifact deck rebuilt
- **WHEN** Leo Anderson gains an artifact while the artifact deck is empty and one artifact lies on its discard
- **THEN** he gains that artifact and the discard is empty
