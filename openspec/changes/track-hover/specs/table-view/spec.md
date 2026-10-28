## MODIFIED Requirements

### Requirement: The doom and omen tokens stand on their tracks
While a game is in progress the table SHALL show the doom token on the printed doom track at the space matching the current doom, the omen token on the printed omen track at the current omen's space, and one eldritch token beside each omen space per token placed there; the tokens SHALL move when doom, the omen or the eldritch tokens change, and none SHALL stand before a game starts. The track positions SHALL come from board data, not from the image, so another board can declare its own. Pointing at the doom token SHALL show the doom value, at the omen token the omen's colour and the eldritch tokens on it, and at an eldritch token on the track its omen space, in the panel's language, in the badge the pieces use.

#### Scenario: Doom advances
- **WHEN** doom goes from 15 to 14
- **THEN** the doom token stands on the track's 14 space

#### Scenario: Omen moves
- **WHEN** the omen advances from green to blue
- **THEN** the omen token stands on the blue space clockwise from the comet

#### Scenario: Eldritch tokens on the track
- **WHEN** two eldritch tokens lie on the green omen space
- **THEN** two eldritch tokens show beside the comet

#### Scenario: Hover names the track tokens
- **WHEN** the pointer rests on the doom token at doom 12, then on the omen token on green with 1 eldritch token
- **THEN** the badges read the doom value, then the omen's colour with its eldritch count, and vanish when the pointer leaves
