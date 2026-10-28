## MODIFIED Requirements

### Requirement: One encounter of the investigator's choice
With no monster on the space the investigator SHALL draw exactly one card from a deck the space allows: the location deck of the space's region or the general deck on any space; the research deck when a clue token lies on the space; the other world deck when a gate stands on the space; the expedition deck when the active expedition token lies on the space; the Ancient One's special deck on any space when the Ancient One has one; and, on a space where a defeated investigator's token lies, that investigator's sheet back as the encounter, after which the token and sheet leave the game; and, on a space holding a rumor token, the rumor encounter printed on the rumor card in play, which discards nothing when finished. A deck that is empty when a draw is due, or that the draw leaves empty, SHALL at once be rebuilt by shuffling its discard; a deck whose discard is empty too SHALL refuse the draw naming the deck. The drawn card SHALL be shown until the player finishes, then discarded to its deck's discard; a finished expedition encounter SHALL move the expedition token to the space named by the new top expedition card. A deck the space does not allow, a second draw, a draw while a monster still stands on the space, or finishing while a monster on the space has not been fought SHALL be refused with the rule named; a survivor already fought ends the encounter without a draw. **Deviation**: the card text is left to the players; when the special deck may be drawn, and which rumor card a token belongs to, are the players' reading.

#### Scenario: Location encounter
- **WHEN** Leo Anderson on Buenos Aires, with no monster there, draws from the America deck
- **THEN** the former top America card is shown and the deck is 1 card shorter

#### Scenario: Research encounter
- **WHEN** Lily Chen on Shanghai with a clue token there draws from the research deck
- **THEN** the former top research card of the Ancient One is shown

#### Scenario: Deck not allowed
- **WHEN** Lily Chen on Shanghai with no gate there draws from the other world deck
- **THEN** the draw is refused because an other world encounter needs a gate on the space

#### Scenario: Second draw refused
- **WHEN** Leo Anderson has a drawn card showing and draws again
- **THEN** the draw is refused because an investigator resolves one encounter

#### Scenario: Monster blocks the draw
- **WHEN** Leo Anderson on a space with a Ghoul draws from the general deck
- **THEN** the draw is refused because the monster must be fought first

#### Scenario: Survivor ends the encounter
- **WHEN** Leo Anderson has fought a Ghoul that survived and finishes
- **THEN** Lily Chen is encountering and no card was drawn

#### Scenario: Encounter finished
- **WHEN** Leo Anderson finishes with the America card showing
- **THEN** the card is on the America discard and Lily Chen is encountering

#### Scenario: Expedition token moves
- **WHEN** an investigator on the active expedition space finishes an expedition encounter
- **THEN** the expedition token lies on the space named by the new top expedition card

#### Scenario: Deck rebuilt from the discard
- **WHEN** Leo Anderson draws from the America deck while it is empty and three America cards lie on its discard
- **THEN** one of those three is shown, two remain in the deck and the discard is empty

#### Scenario: Rebuilt as the last card is drawn
- **WHEN** the last America card is drawn with two on the discard
- **THEN** the deck holds those two again before the encounter is finished

#### Scenario: Deck and discard empty
- **WHEN** Leo Anderson draws from the America deck while the deck and its discard are empty
- **THEN** the draw is refused naming the America deck

#### Scenario: Expedition token after the last card
- **WHEN** the last expedition card is drawn with cards on the expedition discard and the encounter is finished
- **THEN** the expedition token lies on the space named by the top card of the rebuilt deck

#### Scenario: Special encounter
- **WHEN** Leo Anderson draws from Cthulhu's special deck
- **THEN** the former top special card is shown and the deck is 1 card shorter

#### Scenario: No special deck
- **WHEN** Leo Anderson draws from the special deck while Azathoth has none
- **THEN** the draw is refused because the Ancient One has no special encounters

#### Scenario: Defeated investigator's encounter
- **WHEN** Lily Chen on the city where Leo Anderson's defeated token lies resolves his encounter and finishes
- **THEN** his sheet back was shown and his token and sheet are out of the game

#### Scenario: Rumor encounter
- **WHEN** Leo Anderson on a space holding a rumor token resolves the rumor encounter and finishes
- **THEN** the log says the rumor card's text is left to the players and no deck or discard changed

#### Scenario: No rumor token
- **WHEN** Leo Anderson resolves a rumor encounter on a space without a rumor token
- **THEN** it is refused because no rumor token lies there
