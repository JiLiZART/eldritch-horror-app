// Draws space markers, ids and straight path lines over a downscaled board for eyeball checks.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Board } from "../src/content/types";

const root = join(import.meta.dirname, "..");
const board: Board = JSON.parse(readFileSync(join(root, "content/board/board.json"), "utf8"));
const out = process.argv[2] ?? join(root, ".cache/board-overlay");
mkdirSync(out, { recursive: true });

const W = 1900;
const H = Math.round((W * board.source.height) / board.source.width);
const small = join(out, "small.jpg");
execFileSync("magick", [join(root, board.source.file), "-resize", `${W}x`, small]);

const color: Record<string, string> = { train: "#ff2020", ship: "#2060ff", uncharted: "#ffe020", local: "#20e040" };
const at = new Map(board.spaces.map((s) => [s.id, { x: s.x * W, y: s.y * H }]));
const mvg = ["push graphic-context", "stroke-width 3 fill none"];
for (const p of board.paths) {
  const a = at.get(p.from)!;
  const b = at.get(p.to)!;
  mvg.push(`stroke ${color[p.type]} line ${a.x},${a.y} ${b.x},${b.y}`);
}
mvg.push("stroke #ff00ff stroke-width 2 fill #ff00ff");
for (const s of board.spaces) {
  const { x, y } = at.get(s.id)!;
  mvg.push(`circle ${x},${y} ${x + 6},${y}`);
}
mvg.push("stroke none fill #ffffff font-size 14");
for (const s of board.spaces) {
  const { x, y } = at.get(s.id)!;
  mvg.push(`text ${x + 8},${y - 6} '${s.id}'`);
}
mvg.push("pop graphic-context");
const mvgFile = join(out, "overlay.mvg");
writeFileSync(mvgFile, mvg.join("\n"));
const overlay = join(out, "overlay.jpg");
execFileSync("magick", [small, "-font", "/System/Library/Fonts/Helvetica.ttc", "-draw", `@${mvgFile}`, overlay]);
console.log(overlay);
