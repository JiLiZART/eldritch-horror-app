## Why

Every page load logs a console error: the set loader asks for `content/sets/eh01/preludes.json`, the core set has no preludes (they are expansion material, `inspired/manual_eng.pdf` "Prelude cards"), and the file is absent, so the request is a 404 the loader then treats as an empty list. The content schema already says every set declares its preludes; the core set should declare none rather than nothing.

## What Changes

- `content/sets/eh01/preludes.json` is added as an empty list, so the core set declares its preludes like every other list and the page loads without a console error.
- **Deviations**: none; no spec changes, the schema already covers it, `skip_specs`.
- Non-goals: prelude rules, expansion sets.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- none (content-only change, `skip_specs: true`)

## Impact

- `content/sets/eh01/preludes.json` only; `pnpm content:validate` keeps passing; the browser checks lose their one known console error.
