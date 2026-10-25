## Why

The content foundation is data only. Nothing renders it, so the board graph, coordinates and images are unverified in practice, and the 3D-versus-2D question for the table is still open. A minimal screen that draws the board and its graph settles both and gives every later change a running app to build on.

## What Changes

- Bootstrap the web app: Vite, React, TypeScript, React Three Fiber, Three.js, one entry page, dev and build scripts.
- Render the board texture on a table in a 3D scene with a top-down camera that can pan and zoom.
- Draw every space from `content/board/board.json` as a marker at its coordinates, and every path as a line coloured by type, filtered by the enabled sets (core, Mountains of Madness, Under the Pyramids, The Dreamlands).
- Let the player select a space to see its id, English and Russian names, kind, region, set, and neighbouring spaces with path types.
- Place the twelve core investigator pawns on their starting spaces using the pawn images from the core set data.
- Keep all state in this change as view state (selection, enabled sets, camera). No game state yet.
- Non-goals: any rules or turn logic, cards on the table, mobile layout, English labels baked into the board image, performance tuning, hosting.

## Capabilities

### New Capabilities
- `table-view`: the board, its graph and the starting pawns shown on an interactive 3D table.

### Modified Capabilities
<!-- none -->

## Impact

- New runtime dependencies: react, react-dom, three, @react-three/fiber, @react-three/drei. Dev: vite, @vitejs/plugin-react, @types/react, @types/react-dom, @types/three.
- New `index.html`, `src/main.tsx`, `src/table/` for the scene and `src/content/` gains a loader that fetches the committed JSON at runtime.
- `package.json` gains `dev`, `build`, `preview` scripts; `tsconfig.json` gains DOM and JSX settings.
- Wrong edges in `board.json` (flagged during the content change) become visible and will be fixed as data corrections in this change.
