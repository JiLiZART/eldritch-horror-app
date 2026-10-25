# Eldritch Horror app

Browser version of the Eldritch Horror board game. Non-commercial fan project,
see `content/ATTRIBUTION.md`.

## Prerequisites

- Node 22+ and pnpm 11 (`package.json` pins the package manager).
- For content extraction scripts only:
  - `pdfimages` from poppler (tested with poppler 25.x): `brew install poppler`
  - `magick` from ImageMagick 7: `brew install imagemagick`

## Scripts

```
pnpm typecheck           # tsc
pnpm test                # vitest
pnpm content:validate    # validate every file under content/
pnpm content:extract-icons
pnpm content:copy-core
pnpm content:board-overlay
```

Source material lives in `inspired/` (gitignored, local only). Committed data
under `content/` and `public/` is the source of truth; the scripts are one-shot
helpers to regenerate it.
