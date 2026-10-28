## ADDED Requirements

### Requirement: Health and sanity tokens lie on the sheets
During a game each investigator's sheet SHALL carry a health token showing their current health on the printed heart and a sanity token showing their current sanity on the printed brain, updating with every change; a defeated investigator's sheet SHALL show the zero token on the side that fell.

#### Scenario: Tokens at set-up
- **WHEN** a game is set up with Lily Chen
- **THEN** her sheet shows a 6 health token on the heart and a 6 sanity token on the brain

#### Scenario: Tokens follow the state
- **WHEN** Lily Chen loses 2 health
- **THEN** the token on her heart shows 4 and the one on her brain still shows 6
