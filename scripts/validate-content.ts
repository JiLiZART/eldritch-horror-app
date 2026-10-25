import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { loadSet, readJson } from "../src/content/load";
import { validateBoard, validateIcons, validateSet } from "../src/content/validate";
import type { Board, IconManifest } from "../src/content/types";

const root = join(import.meta.dirname, "..");
const pub = join(root, "public");

const errors: string[] = [];

const board = readJson<Board>(join(root, "content/board/board.json"));
if (board) {
  errors.push(...validateBoard(board));
  if (!existsSync(join(pub, board.texture))) errors.push(`board texture ${board.texture} missing`);
}

const setsDir = join(root, "content/sets");
if (existsSync(setsDir)) {
  for (const id of readdirSync(setsDir)) {
    const set = loadSet(join(setsDir, id));
    if (set) errors.push(...validateSet(set, (p) => existsSync(join(pub, p)), board));
  }
}

const manifest = readJson<IconManifest>(join(root, "content/icons/manifest.json"));
if (manifest) {
  const dir = join(pub, "icons");
  const files = existsSync(dir)
    ? readdirSync(dir).filter((f) => statSync(join(dir, f)).isFile()).map((f) => relative(pub, join(dir, f)))
    : [];
  errors.push(...validateIcons(manifest, files));
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("content ok");
