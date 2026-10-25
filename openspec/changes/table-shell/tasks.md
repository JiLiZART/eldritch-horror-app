## 1. App bootstrap

- [x] 1.1 Add runtime deps react, react-dom, three, @react-three/fiber, @react-three/drei and dev deps vite, @vitejs/plugin-react, @types/react, @types/react-dom, @types/three; add `dev`, `build`, `preview` scripts; extend tsconfig with DOM libs and `jsx`; verify `pnpm typecheck` and `pnpm build` pass with a placeholder page
- [x] 1.2 Add the Vite plugin that serves and copies `content/` as `/content/`; verify `curl` of `/content/board/board.json` during `pnpm dev` returns the file and `dist/content/board/board.json` exists after build

## 2. Pure geometry and graph helpers

- [x] 2.1 Write failing tests for `boardToWorld` (corners map to plane corners, y flipped, aspect kept) and `activeGraph` (core only yields 36 spaces and no path touching a disabled set; enabling eh07 adds its 7 spaces); verify they fail
- [x] 2.2 Implement `src/table/geometry.ts` and `activeGraph` in `src/content/board.ts`; verify tests pass
- [x] 2.3 Write failing tests for `spreadOnCircle(n, radius)` used for pawns sharing a space (n = 1 returns the centre, n > 1 returns distinct points on the circle); implement; verify green

## 3. Scene

- [x] 3.1 Render the board plane with the WebP texture, orthographic top-down camera and pan/zoom controls with rotation disabled and zoom bounds; verify in the browser that the whole board is visible on load and the camera cannot go under the table
- [x] 3.2 Draw markers and path lines from `activeGraph`, coloured by type, with a legend; verify in the browser against `inspired/All_boards.jpg` that every core marker sits on its printed marker and list any that are off
- [x] 3.3 Add set toggles (eh03, eh05, eh07; core fixed on); verify toggling Dreamlands removes its markers and lines
- [x] 3.4 Add selection: click marker or choose from the keyboard-accessible list, panel shows the space details and neighbours with path types, highlight the selected marker, click on the table clears; verify the London scenario in the browser
- [x] 3.5 Place the twelve pawns as billboards on their starting spaces, spread when sharing a space; verify Charlie Kane on San Francisco and Akachi Onyele on space 15 in the browser
- [x] 3.6 Honour reduced motion for camera moves; verify by toggling the OS setting or emulating `prefers-reduced-motion` in devtools

## 4. Data corrections

- [x] 4.1 Fix every marker or path found wrong in 3.2 by editing `content/board/board.json`; verify `pnpm test` and `pnpm content:validate` stay green and the overlay script agrees

## 5. Finish

- [x] 5.1 Run simplify and deslop over `src/table` and the Vite config; verify `pnpm typecheck`, `pnpm test`, `pnpm build` and `pnpm content:validate` all green
