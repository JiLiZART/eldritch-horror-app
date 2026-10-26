## ADDED Requirements

### Requirement: Location art responds to the pointer
Each of the 34 illustrated locations SHALL lie exactly over its art on the board. While the pointer is over it, or while its space is selected, it SHALL grow from its centre together with its printed text. Clicking it SHALL select its space exactly as clicking the space's marker does. The art of a location whose set is disabled SHALL not grow or select anything. With reduced motion the growth SHALL be instant.

#### Scenario: Hover London
- **WHEN** the pointer rests over the London illustration
- **THEN** London's art and its name grow around their centre, and shrink back when the pointer leaves

#### Scenario: Click the art
- **WHEN** the player clicks the Tokyo illustration
- **THEN** Tokyo is selected, as if its marker was clicked

#### Scenario: Disabled set
- **WHEN** Mountains of Madness is disabled and the pointer rests over the Lake Camp illustration
- **THEN** the art does not grow and clicking it selects nothing
