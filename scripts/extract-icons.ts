/**
 * One-shot extraction of game icons into public/icons and content/icons/manifest.json.
 * Needs poppler (pdfimages, pdftoppm) and ImageMagick 7 (magick) on PATH.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { IconManifest } from "../src/content/types";

const root = join(import.meta.dirname, "..");
const pdf = join(root, "inspired/manual_eng.pdf");
const outDir = join(root, "public/icons");
const work = join(root, "node_modules/.cache/extract-icons");
mkdirSync(outDir, { recursive: true });
mkdirSync(work, { recursive: true });

const run = (cmd: string, args: string[]) => execFileSync(cmd, args, { encoding: "utf8" });

/** Raster icons: page and PDF object id of the image (its soft mask shares the id). */
const raster: Record<string, { page: number; object: number }> = {
  "clue-token": { page: 3, object: 70 },
  "gate-token": { page: 3, object: 71 },
  expedition: { page: 3, object: 90 },
  "rumor-token": { page: 3, object: 57 },
  omen: { page: 3, object: 59 },
  reckoning: { page: 3, object: 69 },
  gate: { page: 3, object: 67 },
  monster: { page: 3, object: 78 },
  clue: { page: 3, object: 65 },
  rumor: { page: 3, object: 61 },
  eldritch: { page: 3, object: 93 },
};

/** Vector glyphs drawn inline in the text: page and box in PDF points (x, y, w, h). */
const glyphs: Record<string, { page: number; box: [number, number, number, number] }> = {
  influence: { page: 5, box: [130.5, 311.5, 12, 10] },
  will: { page: 8, box: [127.3, 261.5, 7.9, 10.5] },
  strength: { page: 8, box: [153.6, 287, 10, 12] },
};

/**
 * Skill glyphs absent from the PDF, taken from the mod's improvement tokens (coloured glyph on white).
 * `cut` is a polygon in token pixels painted white before thresholding, to drop the ring fragment next to the glyph.
 */
const tokens: Record<string, { file: string; box: [number, number, number, number]; cut: string }> = {
  lore: { file: "01 Core/Improvements/lore+.jpg", box: [28, 32, 137, 84], cut: "polygon 162,72 156,82 150,94 142,104 135,112 127,120 256,120 256,60" },
  observation: { file: "01 Core/Improvements/observation+.jpg", box: [24, 24, 131, 76], cut: "polygon 165,70 157,80 150,87 145,95 140,105 135,120 256,120 256,60" },
};

const manifest: IconManifest = { icons: {}, dice: { file: "icons/dice.svg", source: "inspired/ttp-eldritch-horror-master/assets/Eldritch Horror Dice.svg" } };

const record = (name: string, source: string, page: number) => {
  const file = join(outDir, `${name}.png`);
  const [w, h] = run("magick", ["identify", "-format", "%w %h", file]).split(" ").map(Number);
  manifest.icons[name] = { file: `icons/${name}.png`, width: w!, height: h!, source, page };
};

// 1. raster icons with their soft masks
run("pdfimages", ["-png", "-p", pdf, join(work, "img")]);
const rows = run("pdfimages", ["-list", pdf]).split("\n").slice(2).filter(Boolean).map((l) => l.trim().split(/\s+/));
const find = (page: number, object: number, type: string) => {
  const r = rows.find((c) => Number(c[0]) === page && c[2] === type && Number(c[10]) === object);
  if (!r) throw new Error(`no ${type} for page ${page} object ${object}`);
  return join(work, `img-${String(page).padStart(3, "0")}-${String(r[1]).padStart(3, "0")}.png`);
};
for (const [name, { page, object }] of Object.entries(raster)) {
  run("magick", [find(page, object, "image"), find(page, object, "smask"), "-alpha", "off", "-compose", "CopyOpacity", "-composite", join(outDir, `${name}.png`)]);
  record(name, "inspired/manual_eng.pdf", page);
}

// 2. vector glyphs: render the box at 600 dpi, drop the paper colour, trim
const dpi = 600;
const s = dpi / 72;
const paper = "srgb(255,251,248)";
for (const [name, { page, box: [x, y, w, h] }] of Object.entries(glyphs)) {
  const tmp = join(work, `glyph-${name}`);
  run("pdftoppm", ["-r", String(dpi), "-png", "-f", String(page), "-l", String(page), "-x", String(Math.round(x * s)), "-y", String(Math.round(y * s)), "-W", String(Math.round(w * s)), "-H", String(Math.round(h * s)), pdf, tmp]);
  const rendered = `${tmp}-${String(page).padStart(2, "0")}.png`;
  run("magick", [rendered, "-fuzz", "20%", "-transparent", paper, "-trim", "+repage", join(outDir, `${name}.png`)]);
  record(name, "inspired/manual_eng.pdf", page);
}

// 3. improvement-token glyphs: keep the coloured glyph as a black shape with alpha
for (const [name, { file, box: [x, y, w, h], cut }] of Object.entries(tokens)) {
  const src = join(root, "inspired/ttp-eldritch-horror-master/assets", file);
  const out = join(outDir, `${name}.png`);
  run("magick", [src, "-fill", "white", "-draw", cut, "-crop", `${w}x${h}+${x}+${y}`, "+repage", "-colorspace", "gray", "-threshold", "55%", "-negate", "-write", "mpr:mask", "+delete", "-size", `${w}x${h}`, "xc:black", "mpr:mask", "-alpha", "off", "-compose", "CopyOpacity", "-composite", "-trim", "+repage", out]);
  record(name, `inspired/ttp-eldritch-horror-master/assets/${file}`, 0);
}

// 4. dice
copyFileSync(join(root, manifest.dice.source), join(outDir, "dice.svg"));

writeFileSync(join(root, "content/icons/manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`${Object.keys(manifest.icons).length} icons written to public/icons`);
