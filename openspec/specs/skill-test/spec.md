# skill-test Specification

## Purpose
Roll a skill test the way the rulebook says, so that Acquire Assets today and encounters and combat later share one dice rule. Source: `inspired/manual_eng.pdf` p.3 "Tests", p.8; `inspired/EH_reference.pdf` p.9, p.10 (Проверка).

## Requirements

### Requirement: A test rolls dice for a skill
A test SHALL roll dice equal to the investigator's printed skill value plus the test modifier, at least 1 die. Each die showing 5 or 6 SHALL count as a success; the number of successes SHALL be the test result, and the test passes when the result is at least 1. The dice rolled SHALL be visible to the players. Dice SHALL be drawn from the game seed, so the same game replays the same rolls. **Deviation**: skill bonuses printed on possessions, improvement tokens, rerolls and spent clues are not applied; the players apply them by hand.

#### Scenario: Plain test
- **WHEN** Charlie Kane, Influence 4, tests Influence with modifier 0
- **THEN** 4 dice are shown and the result is the count of dice showing 5 or 6

#### Scenario: Negative modifier
- **WHEN** Charlie Kane, Influence 4, tests Influence with modifier -1
- **THEN** 3 dice are shown

#### Scenario: At least one die
- **WHEN** Norman Withers, Influence 1, tests Influence with modifier -2
- **THEN** 1 die is shown

#### Scenario: Replay
- **WHEN** two games with the same seed and setup run the same tests in the same order
- **THEN** every die shows the same face in both games
