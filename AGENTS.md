# AGENTS.md

Browser app for the Eldritch Horror board game (non-commercial fan project). TypeScript, React, React Three Fiber, Three.js; pnpm. Product scope goes through OpenSpec changes in `openspec/` (`openspec/config.yaml` holds the artifact rules). Reference material lives in `inspired/` (gitignored, read-only).

## Skills

Project skills live in `.agents/skills/`. `.claude/skills/` links to them, except the OpenSpec and impeccable skills, which are generated per tool (Claude uses `/opsx:*` and `/impeccable`) and stay as separate copies. Add a new skill to `.agents/skills/` and symlink it: `ln -s ../../.agents/skills/<name> .claude/skills/<name>`.

Load the named skill before the matching work.

### Planning (OpenSpec)
- `openspec-explore`, `grill-me` — before proposing, when the idea or scope is unclear.
- `openspec-propose` — create a change with proposal, specs, design and tasks.
- `openspec-update-change` — revise a change's artifacts and keep them coherent.
- `openspec-apply-change` — implement a change's tasks.
- `openspec-sync-specs` — merge delta specs into `openspec/specs/`.
- `openspec-archive-change` — archive a finished change.
- `openspec-git-discipline` — commit, branch and merge timing across propose → apply → archive.
- `glossary` — whenever authoring or reviewing proposal, specs, design or tasks.
- `gherkin-authoring` — when writing scenarios.
- `architectural-decision-records` — significant design decisions.
- `c4-diagrams` — architecture diagrams.
- `spec-as-source`, `acceptance-test-authoring` — opt-in only, when a change or the user says so.

### Implementation
- `test-driven-development` — every implementation task (red, green, refactor).
- `react-three-fiber`, `threejs-fundamentals`, `threejs-interaction`, `threejs-materials`, `threejs-textures`, `threejs-lighting`, `threejs-animation`, `threejs-shaders` — 3D scene work.
- `vercel-react-best-practices`, `vercel-composition-patterns`, `split-react-components`, `you-might-not-need-an-effect` — React code.
- `impeccable`, `web-design-guidelines` — UI design and review.
- `feature-sliced-design`, `improve-codebase-architecture` — structure and architecture work.
- `agent-browser` — driving the app in a browser.

### Finishing
- `simplify`, `deslop`, `code-simplifier` — before declaring implementation done.
- `git-conventions`, `commit` — conventional commit messages.
