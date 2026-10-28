## MODIFIED Requirements

### Requirement: A game is started from the players' choices
When no game is in progress the players SHALL be led through the setup in steps, in this order: the Ancient One, the investigators, the difficulty and seed, then a review. They SHALL be offered every Ancient One and investigator of the core set, a difficulty of normal, easy or hard, and a seed. Investigators are chosen in seat order. The players SHALL be able to return to any earlier step without losing later choices. **Deviation**: the rulebook chooses investigators (step 3) before the Ancient One (step 5); the order of choosing has no rule effect. Starting SHALL be offered only on the review step and SHALL build the state by the `game-setup` capability, identical to the setup preview shown, and show it on the table and in the panel.

#### Scenario: Start with two investigators
- **WHEN** the players pick Cthulhu, then Leo Anderson and Lily Chen in that order, and start
- **THEN** Leo Anderson's pawn stands on Buenos Aires, Lily Chen's on Shanghai, doom reads 12, the omen is green, and Leo Anderson is the lead investigator

#### Scenario: Seat order
- **WHEN** the players pick Lily Chen first and Leo Anderson second
- **THEN** Lily Chen is the lead investigator

#### Scenario: Seed
- **WHEN** the players start twice with the same choices and the same seed
- **THEN** the same gates, clues, monsters, reserve and mystery appear both times

#### Scenario: Going back keeps choices
- **WHEN** the players on the review step return to the Ancient One step and change Cthulhu to Azathoth
- **THEN** the chosen investigators, difficulty and seed are unchanged and the review shows doom 15

#### Scenario: Start matches the preview
- **WHEN** the players start from the review step
- **THEN** every gate, monster, clue, the active expedition and the reserve stand where the preview showed them

### Requirement: Refused choices are explained
When the choices cannot start a game, the reason from the setup rules SHALL be shown on the step whose choice causes it, the review SHALL show no preview, and no game starts.

#### Scenario: No investigator
- **WHEN** the players reach the review with no investigator chosen
- **THEN** the investigator step's reason says at least one investigator is needed and the board stays empty

#### Scenario: Nine investigators
- **WHEN** nine investigators are chosen
- **THEN** the investigator step says at most eight are allowed

#### Scenario: Deck too small
- **WHEN** the chosen Ancient One asks for more cards of a colour than the difficulty allows
- **THEN** the difficulty step names the colour and the review shows no preview

## ADDED Requirements

### Requirement: The Ancient One's sheet is shown before choosing
While the Ancient One is being chosen the players SHALL see, for the Ancient One under consideration, its sheet face and the values setup takes from it: starting doom, the green, yellow and blue mythos card counts of each stage, the monsters set aside from the cup, the eldritch tokens placed on the omen track, the number of mysteries and the Cultist row. Setup text the app does not apply SHALL be readable on the sheet face only. Source: `inspired/eh01_rulebook.pdf` p.4 "Setup" step 5, p.6 "Building the Mythos Deck"; `inspired/eh01_reference_guide1.pdf` p.2, p.5.

#### Scenario: Cthulhu
- **WHEN** the players consider Cthulhu
- **THEN** they see doom 12, stage I with 0 green, 2 yellow and 2 blue, stage II with 1 green, 3 yellow and 0 blue, stage III with 3 green, 4 yellow and 0 blue, one Deep One and one Star Spawn set aside, and 4 mysteries

#### Scenario: Azathoth
- **WHEN** the players consider Azathoth
- **THEN** they see doom 15 and 1 eldritch token on the green omen space

#### Scenario: Nothing set aside
- **WHEN** the players consider Yog-Sothoth
- **THEN** they are told no monsters are set aside and no eldritch tokens are placed

### Requirement: Investigators are shown before choosing
While investigators are being chosen the players SHALL see, for each investigator, the printed health, sanity, the five skills, the starting space and the starting possessions. The chosen seat order SHALL be listed with the first seat marked as the lead investigator. Source: `inspired/eh01_rulebook.pdf` p.4 "Setup" steps 3 and 4.

#### Scenario: Akachi Onyele
- **WHEN** the players consider Akachi Onyele
- **THEN** they see 5 health, 7 sanity, her skills, starting space 15, Mists of Releh and 1 clue

#### Scenario: Lead marked
- **WHEN** Lily Chen is chosen first and Leo Anderson second
- **THEN** the seat order reads Lily Chen then Leo Anderson and Lily Chen is marked as the lead investigator

### Requirement: Setup is previewed on the table before starting
On the review step the table SHALL show the board as setup would leave it from the current choices and seed: pawns on their starting spaces, gates with their monsters, clues, the active expedition, doom, omen, eldritch tokens and the reserve, and the Ancient One's cards beside the board. The review SHALL also list the spawned gates and clues by space and the monster surge value. The players SHALL be able to draw a new seed, which refreshes the preview. Nothing previewed SHALL be saved as a game until the players start. Source: `inspired/eh01_rulebook.pdf` p.5 "Setup" step 9 B–H; `inspired/eh01_reference_guide1.pdf` p.10.

#### Scenario: Preview for four investigators
- **WHEN** the review is reached with four investigators chosen
- **THEN** the table shows one gate with one monster and two clues, and the review lists their spaces and a monster surge value of 2

#### Scenario: New seed
- **WHEN** the players draw a new seed on the review step
- **THEN** the seed shown changes and the gates, clues and monsters on the table follow the new seed

#### Scenario: Preview is not saved
- **WHEN** the players leave the page during the review without starting
- **THEN** a reload shows the setup steps with no game resumed
