# reroll Specification

## Purpose
Let a test's dice wait so the rolling investigator can spend clues to reroll single dice before the result counts, as the rulebook allows right after rolling. Source: `inspired/manual_eng.pdf` p.3 "Tests", p.8 "Clues"; `inspired/EH_reference.pdf` p.8 "Переброс", p.11 "Улики".

## Requirements

### Requirement: A roll waits before it counts
After the dice of a test land they SHALL be shown and SHALL wait; the result SHALL be taken only when the player continues or makes the choice the test feeds. While a roll waits, no other roll or action SHALL be started for that investigator.

#### Scenario: Acquire waits
- **WHEN** Charlie Kane performs Acquire Assets
- **THEN** his Influence dice are shown and no card is gained until he chooses

#### Scenario: Fight waits
- **WHEN** Leo Anderson fights a Byakhee
- **THEN** his Will dice are shown and no sanity is lost until he continues

### Requirement: A die is rerolled for a clue
While a roll waits, the rolling investigator SHALL spend 1 clue to reroll 1 die of their choice; the new face SHALL replace the old one, better or worse, and the result SHALL be recounted; this MAY be repeated for each clue held. Without a clue the reroll SHALL be refused saying so. Rerolled faces SHALL come from the game seed so a replay repeats them. **Deviation**: focus tokens and possessions that reroll are the players' call.

#### Scenario: Rerolled
- **WHEN** Leo Anderson with 2 clues rerolls the first of his waiting Will dice
- **THEN** he holds 1 clue, the first die shows the new face and the successes are recounted

#### Scenario: Worse face kept
- **WHEN** a rerolled die lands lower than before
- **THEN** the new face stands

#### Scenario: No clue
- **WHEN** an investigator without clues rerolls a die
- **THEN** it is refused because a reroll costs 1 clue

#### Scenario: Nothing waiting
- **WHEN** a die is rerolled while no roll waits
- **THEN** it is refused because no roll is waiting
