## MODIFIED Requirements

### Requirement: The board is shown on a table
When the app opens, the board texture SHALL be visible on a flat table seen from above, keeping the source aspect ratio, and the player SHALL be able to pan and zoom the view without rotating it under the table; a scroll zoom SHALL keep the point under the pointer where it is, so zooming in lands on what the pointer rests on. The view SHALL stay within the table, which is the board alone without a game and the board with the tableau beside it during one, so zooming out fully shows the whole table and panning stops at its edges; the table SHALL carry a small margin around its contents, so a card at its edge can be centred when brought up to read. The panel beside the table SHALL be hideable by a control that stays visible while it is hidden, so the table fills the window on a shared screen; the choice SHALL be remembered in the browser. The panel's width SHALL be adjustable by dragging its edge, within sensible bounds, the table refitting as it changes, and the width SHALL be remembered in the browser. The arrow keys SHALL pan the view and the plus and minus keys zoom it, when no form field has keyboard focus, so the table is reachable without a pointer; the clamp and the zoom limits apply as to a drag or a scroll.

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

#### Scenario: Edge card centred
- **WHEN** the player brings up the first held card under the leftmost sheet
- **THEN** the card sits clear of the view's edges, with table margin around it

#### Scenario: Zoom under the pointer
- **WHEN** the pointer rests on London and the player scrolls to zoom in
- **THEN** London stays under the pointer as the view enlarges

#### Scenario: Hide the panel
- **WHEN** the player hides the panel
- **THEN** the table fills the window, the whole table still fits at full zoom-out, a Show panel control remains, and after a reload the panel is still hidden

#### Scenario: Widen the panel
- **WHEN** the player drags the panel's edge to the left
- **THEN** the panel widens, the table refits to the narrower canvas, and after a reload the panel keeps that width

#### Scenario: Pan and zoom by keyboard
- **WHEN** no field has focus and the player presses the right arrow, then plus
- **THEN** the view moves right by part of its width, then zooms in one step, within the table and the zoom limits
