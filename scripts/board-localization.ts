/**
 * One-shot: copy inspired/board_localization_assets into the app. Writes the textless board and the
 * location cut-outs as WebP under public/board/, content/board/labels.json (text slots in board pixels,
 * keyed by board space id) and content/board/i18n/{en,ru}.json.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Board, BoardLabels, LabelSlot } from "../src/content/types";

const root = join(import.meta.dirname, "..");
const pack = join(root, "inspired/board_localization_assets");
const read = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const board: Board = read(join(root, "content/board/board.json"));

/** Pack location id -> board space id where the two differ. */
const ids: Record<string, string> = {
  unknown_kadath: "eh07-unknown-kadath",
  celephais: "eh07-celephais",
  the_moon: "eh07-the-moon",
  dylath_leen: "eh07-dylath-leen",
  ulthar: "eh07-ulthar",
  enchanted_wood: "eh07-the-enchanted-wood",
  underworld: "eh07-the-underworld",
  himalayas: "the-himalayas",
  bent_pyramid: "eh05-the-bent-pyramid",
  sahara: "eh05-the-sahara",
  alexandria: "eh05-alexandria",
  cairo: "eh05-cairo",
  pyramids: "the-pyramids",
  amarna: "eh05-amarna",
  heart_of_africa: "the-heart-of-africa",
  nile: "eh05-the-nile",
  amazon: "the-amazon",
  plateau_of_leng: "eh03-plateau-of-leng",
  city_of_elder_things: "eh03-city-of-the-elder-things",
  snowy_mountains: "eh03-snowy-mountains",
  frozen_waste: "eh03-frozen-waste",
  lake_camp: "eh03-lake-camp",
  miskatonic_outpost: "eh03-miskatonic-outpost",
};
const known = new Set(board.spaces.map((s) => s.id));
const spaceOf = (packId: string) => {
  const id = ids[packId] ?? packId.replaceAll("_", "-");
  if (!known.has(id)) throw new Error(`${packId}: no board space ${id}`);
  return id;
};

/** Strings the pack does not slot, measured by hand on the 9437 x 6198 board. */
const handSlots: LabelSlot[] = [
  { key: "board.legend_title", x: 490, y: 3370, w: 720, h: 65, bold: true },
  { key: "board.legend_paths", x: 230, y: 3545, w: 500, h: 60, bold: true },
  { key: "board.legend_locations", x: 930, y: 3545, w: 480, h: 60, bold: true },
  { key: "board.legend_train", x: 210, y: 3685, w: 350, h: 50, align: "right", bold: true },
  { key: "board.legend_trail", x: 210, y: 3843, w: 350, h: 50, align: "right", bold: true },
  { key: "board.legend_ship", x: 210, y: 3985, w: 350, h: 50, align: "right", bold: true },
  { key: "board.legend_local", x: 210, y: 4145, w: 350, h: 50, align: "right", bold: true },
  { key: "board.legend_city", x: 920, y: 3708, w: 350, h: 55, align: "right", bold: true },
  { key: "board.legend_wilderness", x: 920, y: 3925, w: 350, h: 50, align: "right", bold: true },
  { key: "board.legend_sea", x: 920, y: 4152, w: 350, h: 50, align: "right", bold: true },
  { key: "board.card_bank_loan_title", x: 200, y: 5430, w: 340, h: 50 },
  { key: "board.card_bank_loan_type", x: 200, y: 5800, w: 290, h: 40, bold: true },
  { key: "board.card_bank_loan_text", x: 150, y: 5845, w: 400, h: 170, size: 30 },
  // Ribbon under the omen dial: text follows a circle around the dial centre, tops facing inward.
  { key: "board.omens_title", x: 8935, y: 501, w: 690, h: 65, bold: true, arc: { radius: 600, angle: 117 } },
];

/** A rules box slot covers the whole box; its title sits above the printed rule line, the text below. */
function rulesBox(s: { key: string; x: number; y: number; w: number; h: number }): LabelSlot[] {
  return [
    { key: "board.rules_title", x: s.x + s.w * 0.2, y: s.y + s.h * 0.12, w: s.w * 0.6, h: s.h * 0.1, bold: true },
    { key: `board.${s.key}`, x: s.x + s.w * 0.1, y: s.y + s.h * 0.27, w: s.w * 0.82, h: s.h * 0.58, align: "left", size: 30 },
  ];
}

const pub = join(root, "public/board");
mkdirSync(join(pub, "locations"), { recursive: true });
const layout = read(join(pack, "layout.json"));
const { width, height } = layout.board;
execFileSync("magick", [join(pack, "board_textless.png"), "-resize", "4096x", "-quality", "85", join(pub, "board-textless.webp")]);

const labels: BoardLabels = {
  width,
  height,
  locations: layout.locations.map((l: any) => {
    const space = spaceOf(l.id);
    const image = `board/locations/${space}.webp`;
    // Half the source scale: a little sharper than the board texture, which is ~0.43.
    execFileSync("magick", [join(pack, l.file), "-resize", "50%", "-quality", "90", join(root, "public", image)]);
    const slots = Object.entries(l.text_slots as Record<string, Omit<LabelSlot, "key">>).map(([part, s]) => ({
      key: `loc.${space}.${part}`,
      ...s,
      ...(part === "name" && { lines: l.lines, bold: true }),
      ...(part === "rules" && { align: "left" as const, size: 22 }),
    }));
    return { space, x: l.x, y: l.y, w: l.w, h: l.h, image, slots };
  }),
  slots: [
    ...layout.board_text.flatMap((s: any) => (s.key.startsWith("rules_") ? rulesBox(s) : [{ key: `board.${s.key}`, x: s.x, y: s.y, w: s.w, h: s.h, bold: true }])),
    ...handSlots,
  ],
};
writeFileSync(join(root, "content/board/labels.json"), `${JSON.stringify(labels, null, 2)}\n`);

mkdirSync(join(root, "content/board/i18n"), { recursive: true });
for (const lang of ["en", "ru"]) {
  const strings: Record<string, string> = read(join(pack, `i18n/${lang}.json`));
  const rekeyed = Object.fromEntries(Object.entries(strings).map(([k, v]) => [k.replace(/^loc\.([a-z_]+)\./, (_, id) => `loc.${spaceOf(id)}.`), v]));
  writeFileSync(join(root, `content/board/i18n/${lang}.json`), `${JSON.stringify(rekeyed, null, 2)}\n`);
}
console.log(`${labels.locations.length} locations, ${labels.slots.length} board slots`);
