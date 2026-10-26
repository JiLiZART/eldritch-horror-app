## Purpose
Play the Encounter phase between the Action and Mythos phases: each investigator in turn fights the monsters on their space or draws one encounter card, and an investigator at 0 health or sanity is defeated. Source: `inspired/manual_eng.pdf` p.3 "2. Encounter Phase", p.4 "Defeated Investigators"; `inspired/EH_reference.pdf` p.5, p.8, p.20.

## ADDED Requirements

### Requirement: Investigators encounter in seat order
When the last seat ends its Action turn the Encounter phase SHALL begin with the lead investigator, then clockwise, one investigator at a time, skipping defeated investigators. When the last investigator finishes their encounter the Mythos phase SHALL draw its card.

#### Scenario: Phase opens
- **WHEN** Lily Chen, the last seat, ends her Action turn
- **THEN** the phase is Encounter with Leo Anderson, the lead, encountering

#### Scenario: Last encounter opens Mythos
- **WHEN** Lily Chen, the last investigator, finishes her encounter
- **THEN** the phase is Mythos with the top mythos card showing

### Requirement: One encounter of the investigator's choice
With no monster on the space the investigator SHALL draw exactly one card from a deck the space allows: the location deck of the space's region or the general deck on any space; the research deck when a clue token lies on the space; the other world deck when a gate stands on the space; the expedition deck when the active expedition token lies on the space. The drawn card SHALL be shown until the player finishes, then discarded to its deck's discard; a finished expedition encounter SHALL move the expedition token to the space named by the new top expedition card. A deck the space does not allow, a second draw, a draw while a monster still stands on the space, or finishing while a monster on the space has not been fought SHALL be refused with the rule named; a survivor already fought ends the encounter without a draw. **Deviation**: the card text is left to the players; rumor, defeated-investigator and special encounters are not offered; a Detained investigator is not modelled.

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

### Requirement: An investigator at 0 health or sanity is defeated
When an investigator's health or sanity reaches 0 they SHALL be defeated at once: doom advances by 1, their turns are skipped for the rest of the game, and the lead token passes to the next seat when the defeated investigator held it. When every investigator is defeated the game SHALL be lost with the reason shown. The defeated investigator SHALL be shown as such beside the board. **Deviation**: the pawn stays where it fell and no replacement investigator is chosen; the players are told so.

#### Scenario: Defeated by horror
- **WHEN** Leo Anderson at 1 sanity loses 1 sanity in combat at doom 12
- **THEN** he is defeated by sanity, doom is 11, and Lily Chen is encountering

#### Scenario: Lead passes
- **WHEN** the lead investigator is defeated
- **THEN** the next seat holds the lead token

#### Scenario: Skipped in the Action phase
- **WHEN** the next round starts with Leo Anderson defeated
- **THEN** Lily Chen is active and ending her turn opens the Encounter phase without Leo Anderson

#### Scenario: All defeated
- **WHEN** the last standing investigator is defeated
- **THEN** the game is lost and the reason says every investigator is defeated

### Requirement: The encounter is shown beside the board
During the Encounter phase the players SHALL see whose encounter it is, the monsters on the space with their printed backs and health, a Fight button per monster, the decks the space allows, the drawn card and a Finish button; each fight SHALL list its dice, losses and the monster's fate.

#### Scenario: Monsters listed
- **WHEN** Leo Anderson's encounter starts on a space with a Ghoul
- **THEN** the Ghoul's back is shown with a Fight button and no deck can be drawn

#### Scenario: Fight logged
- **WHEN** Leo Anderson fights the Ghoul
- **THEN** the Will and Strength dice, the sanity and health lost and whether the Ghoul is defeated are listed
