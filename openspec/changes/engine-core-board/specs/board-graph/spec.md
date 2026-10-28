## ADDED Requirements

### Requirement: The game plays on the sets in play
The engine SHALL act on the active board of the sets in play, which is the core set until a set's cards and encounters exist in the content: travel, nearest-space and random-space moves, spawns and distances SHALL never reach a space of a set not in play, and a space of such a set named to the engine SHALL be refused naming the space. The table's set toggles SHALL only preview those spaces on the board.

#### Scenario: No travel into a set not in play
- **WHEN** Leo Anderson stands on Istanbul and a travel route into Under the Pyramids' Cairo is tried
- **THEN** the route is refused naming the space, while Istanbul's core neighbours remain open

#### Scenario: Random play stays on the core set
- **WHEN** the random-play test runs with the core set in play
- **THEN** every investigator and monster stands on a core space throughout
