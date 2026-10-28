## MODIFIED Requirements

### Requirement: Acquire Assets buys from the reserve
Acquire Assets SHALL be allowed only on a city space without a monster. It SHALL test Influence, show the roll and let it wait for rerolls, then let the active investigator gain reserve cards whose printed values add up to at most the result; while the roll waits the investigator MAY take the Bank Loan printed on the board once: the result counts 2 more successes and they gain a Debt condition at once, refused when they already hold Debt or already took the loan on this roll, and the 2 successes survive later rerolls; when no card is gained, 1 reserve card MAY be discarded. The reserve SHALL be refilled to 4 from the asset deck, the asset discard reshuffled in when the deck is empty. Until the cards are chosen no other action and no end of turn SHALL be accepted. A choice that breaks these rules SHALL be refused with the rule named and the reserve left as it was. Source: `inspired/manual_eng.pdf` p.3 "Acquire Assets"; `inspired/EH_reference.pdf` p.9 (Приобретение активов), p.10 (Резерв).

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

#### Scenario: Rerolled before choosing
- **WHEN** Charlie Kane with a clue rerolls one Influence die and then takes cards
- **THEN** the cards are measured against the recounted result

#### Scenario: Bank Loan taken
- **WHEN** Charlie Kane rolls 1 success, takes the Bank Loan and gains cards worth 3
- **THEN** he holds a Debt condition and the cards are his

#### Scenario: Debt already held
- **WHEN** Charlie Kane holding Debt takes the Bank Loan
- **THEN** it is refused because he already has Debt

#### Scenario: Loan survives a reroll
- **WHEN** Charlie Kane takes the Bank Loan and then rerolls a die
- **THEN** the result still counts the 2 extra successes
