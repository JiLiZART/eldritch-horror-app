## Context

See proposal.md. `contentDir()` in `vite.config.ts` already learns `outDir` in `configResolved` and copies `content/` into it in `closeBundle`. Node's `rmSync` takes `maxRetries` and `retryDelay` and retries `ENOTEMPTY`, `EBUSY` and `EPERM`.

## Goals / Non-Goals

**Goals:**
- One hook, one option; the same output as before.

**Non-Goals:**
- Finder (see proposal).

## Decisions

### D1. `buildStart` removes the output folder with retries
`rmSync(outDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 50 })` in the plugin's `buildStart`, so up to half a second of retries covers a `.DS_Store` written mid-removal. Layer: tooling.

### D2. `build.emptyOutDir: false`
Vite's own non-retrying emptying is switched off, since the plugin has done it. Layer: tooling.
- Rejected: a shell `rm -rf dist &&` in the build script. The same race, without retries.

## Risks / Trade-offs

- A stale file would survive if the plugin's remove were skipped → it runs on every build, before anything is written.

## Open Questions

- None.
