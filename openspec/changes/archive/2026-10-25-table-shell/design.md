## Context

See proposal.md - Why. Data exists under `content/` and `public/` from the content-foundation change; the repo has TypeScript, vitest and tsx but no bundler, no React, no DOM types. Stack is fixed: TypeScript, React, React Three Fiber, Three.js.

## Goals / Non-Goals

**Goals:**
- One screen, one scene, data read at runtime from the committed JSON.
- Pure functions for everything testable (coordinate mapping, set filtering, neighbour lookup); the scene stays thin.
- Settle the rendering model: the table is a 3D scene with a top-down camera.

**Non-Goals:**
- Component library, routing, state management library, i18n framework. Not needed for one screen.
- Visual design pass. Default colours and a plain side panel are enough to verify data.

## Decisions

### D1: 3D scene from the start
The table is an R3F `Canvas` with an orthographic camera looking straight down and drei `MapControls` limited to pan and zoom (no rotation, polar angle fixed). Pawns are vertical sprites so they read as standing pieces.
- Alternative: a 2D canvas or SVG overlay now, 3D later. Rejected: the stack is fixed and switching later would redo the picking, camera and layout work.

### D2: World units
The board plane is `width = 10`, `height = 10 / aspect` world units centred at the origin. `boardToWorld(space, board)` maps normalized texture coordinates to `(x, y)` with the y axis flipped (texture origin is top-left). This is a pure function in `src/table/geometry.ts` with tests.

### D3: Content loading
`src/content/client.ts` fetches `content/board/board.json` and `content/sets/eh01/*.json` served as static files. Vite serves `public/` at the root; the JSON under `content/` is copied to `public/content/` by a small Vite plugin at dev and build time rather than duplicated in git.
- Alternative: import the JSON as modules. Rejected: bundles 100 KB of data into the JS and ties the schema to the build; fetching keeps content a runtime asset like the images.

### D4: Graph filtering
`activeGraph(board, enabledSets)` returns the spaces and paths whose endpoints are all enabled; pure, in `src/content/board.ts` next to `neighbors` and `distance`. The scene renders the result; it never filters inline.

### D5: Picking and selection
Markers are small discs with R3F pointer events. Selection is React state in the page component; the panel and the highlighted marker read it. The space list in the panel is a list of buttons so keyboard users can select without the canvas.

### D6: Pawns
One drei `Billboard` per investigator with the pawn texture on a plane, scaled to roughly a city marker's diameter. Pawns sharing a space are spread on a small circle around the marker.

### D7: Textures
Textures load through drei `useTexture` with Suspense. WebP is decoded by the browser's image pipeline, no extra loader. `colorSpace` is set to sRGB for every texture.

### D8: Reduced motion
A `usePrefersReducedMotion` hook reads the media query; camera focus moves use `MapControls` without damping when it is set. No other animation exists in this change.

### D9: Tooling additions
Vite with `@vitejs/plugin-react`; `tsconfig.json` adds `"lib": ["ES2022", "DOM", "DOM.Iterable"]` and `"jsx": "react-jsx"`. vitest keeps `environment: node` for pure tests; no DOM test runner is added in this change.

## Risks / Trade-offs

- Pointer events on many small meshes are fine at 55 markers; revisit if later changes add hundreds of pieces.
- Three.js and drei add roughly 700 KB gzipped to the bundle. Accepted; it is the platform.
- Board coordinates were typed by hand. This change will surface errors; fixing them edits `board.json`, not code.

## Open Questions

- None blocking.
