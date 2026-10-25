import { reachable } from "./board";
import type { Board, GameSet, IconManifest, Images } from "./types";

/** Returns human-readable problems; empty when the board is valid. */
export function validateBoard(board: Board): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const s of board.spaces) {
    if (ids.has(s.id)) errors.push(`duplicate space id ${s.id}`);
    ids.add(s.id);
    if (s.x < 0 || s.x > 1 || s.y < 0 || s.y > 1) errors.push(`space ${s.id} has coordinates outside 0..1`);
  }
  for (const p of board.paths) {
    for (const end of [p.from, p.to]) {
      if (!ids.has(end)) errors.push(`path ${p.from}-${p.to} references unknown space ${end}`);
    }
  }
  const core = board.spaces.filter((s) => s.set === "eh01").map((s) => s.id);
  const start = core[0];
  if (start !== undefined) {
    const reached = reachable(board, new Set(core), start);
    for (const id of core) if (!reached.has(id)) errors.push(`core space ${id} is not reachable from ${start}`);
  }
  return errors;
}

/** `imageExists` resolves a path relative to public/. */
export function validateSet(set: GameSet, imageExists: (path: string) => boolean): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const check = (id: string, images: Images, ...extra: (string | undefined)[]) => {
    if (ids.has(id)) errors.push(`duplicate id ${id}`);
    ids.add(id);
    for (const img of [images.front, images.back, ...extra]) {
      if (img !== undefined && !imageExists(img)) errors.push(`${id} references missing image ${img}`);
    }
  };
  for (const i of set.investigators) check(i.id, i.images, i.pawn);
  const cardIds = set.cards.map((c) => c.id);
  for (const i of set.investigators) {
    const refs = [...(i.starting.assets ?? []), ...(i.starting.spells ?? []), ...(i.starting.uniqueAssets ?? []), ...(i.starting.conditions ?? [])];
    for (const ref of refs) {
      // Cards with several copies carry a -N suffix; a starting item names the card, not the copy.
      if (!cardIds.some((id) => id === ref || /^-\d+$/.test(id.slice(ref.length)) && id.startsWith(ref))) {
        errors.push(`${i.id} starts with unknown card ${ref}`);
      }
    }
  }
  for (const a of set.ancientOnes) {
    check(a.id, a.images);
    for (const c of [...a.mysteries, ...a.research, ...(a.special ?? [])]) check(c.id, c.images);
  }
  for (const c of set.cards) check(c.id, c.images);
  for (const m of set.monsters) check(m.id, m.images);
  for (const d of set.encounterDecks) for (const c of d.cards) check(c.id, c.images);
  for (const m of set.mythos) check(m.id, m.images);
  for (const p of set.preludes) check(p.id, p.images);
  return errors;
}

/** `files` are the paths present on disk relative to public/, icons and dice included. */
export function validateIcons(manifest: IconManifest, files: string[]): string[] {
  const errors: string[] = [];
  const listed = new Set([...Object.values(manifest.icons).map((i) => i.file), manifest.dice.file]);
  const present = new Set(files);
  for (const f of listed) if (!present.has(f)) errors.push(`manifest entry ${f} is not on disk`);
  for (const f of present) if (!listed.has(f)) errors.push(`file ${f} is not in the manifest`);
  if (!manifest.dice.file.endsWith(".svg")) errors.push("dice entry must be an SVG");
  return errors;
}
