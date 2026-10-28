## MODIFIED Requirements

### Requirement: The board is shown on a table
When the app opens, the board texture SHALL be visible on a flat table seen from above, keeping the source aspect ratio, and the player SHALL be able to pan and zoom the view without rotating it under the table. The view SHALL stay within the table, which is the board alone without a game and the board with the tableau beside it during one, so zooming out fully shows the whole table and panning stops at its edges.

#### Scenario: First open
- **WHEN** the app loads
- **THEN** the whole board is visible with its printed proportions, and the doom track along the top edge is readable after zooming in

#### Scenario: Zoom limits
- **WHEN** the player zooms out as far as allowed
- **THEN** the whole board still fills a large part of the view and the camera never passes below the table

#### Scenario: Zoomed out during a game
- **WHEN** a game is in progress and the player zooms out as far as allowed
- **THEN** the board and the Ancient One sheet beside it are both in view, whichever space is selected

#### Scenario: Panning stops at the edge
- **WHEN** the player drags the table far past its edge
- **THEN** the view stops with the table's edge at the edge of the view
