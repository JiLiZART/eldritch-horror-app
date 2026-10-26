/**
 * One-shot: copy the core set images from the Tabletop Playground mod into
 * public/cards/eh01 and emit content/sets/eh01/*.json from the file names plus
 * the hand-typed tables below (investigator sheets, Ancient One setup).
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import type { AncientOne, Card, EncounterDeck, Investigator, Monster, MythosCard, NamedCard } from "../src/content/types";
import { assetValues } from "./asset-values";
import { cultists, monsterStats } from "./monster-stats";
import { mythosEffects } from "./mythos-effects";

const root = join(import.meta.dirname, "..");
const src = join(root, "inspired/ttp-eldritch-horror-master/assets/01 Core");
const pub = join(root, "public/cards/eh01");
const out = join(root, "content/sets/eh01");

/** Deck-level atlas textures the mod uses for card sheets; every card also exists as its own file. */
const deckBacks = new Set(["assets", "spells", "conditions", "artifacts", "monsters", "epic monsters", "investigators", "encounter - expedition"]);
const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const files = (dir: string) => readdirSync(join(src, dir)).filter((f) => /\.(png|jpe?g|svg)$/i.test(f));
/** Source file names with typos, corrected to the printed card name. */
const typos: Record<string, string> = { "Personal Asistant": "Personal Assistant", "Buenos Aries": "Buenos Aires" };
const stem = (f: string) => { const s = basename(f, extname(f)); return typos[s] ?? s; };

const table: string[] = [];
/** Converts one source file to public/cards/eh01/<dir>/<name>.webp (long edge capped), returns the public-relative path. */
function copy(srcDir: string, file: string, dir: string, name: string): string {
  mkdirSync(join(pub, dir), { recursive: true });
  const svg = extname(file).toLowerCase() === ".svg";
  const rel = `cards/eh01/${dir}/${name}${svg ? ".svg" : ".webp"}`;
  if (svg) copyFileSync(join(src, srcDir, file), join(root, "public", rel));
  else execFileSync("magick", [join(src, srcDir, file), "-resize", "1600x1600>", "-quality", "85", join(root, "public", rel)]);
  table.push(`${srcDir}/${file} -> ${rel}`);
  return rel;
}

/** Splits "Name - front" / "Name 1 - back" style files into {name -> {front, back}}. */
function sides(srcDir: string, dir: string) {
  const byName = new Map<string, { front?: string; back?: string; file: string }>();
  for (const f of files(srcDir)) {
    const s = stem(f);
    if (/errata/i.test(s) || /^chipped tile$/i.test(s)) continue;
    const m = /^(.*?)\s*-\s*(front|back)$/i.exec(s);
    const name = m ? m[1]! : s;
    if (deckBacks.has(name.toLowerCase())) continue; // deck atlas art, not a card
    const side = m ? (m[2]!.toLowerCase() as "front" | "back") : "front";
    const entry = byName.get(name) ?? { file: f };
    entry[side] = copy(srcDir, f, dir, kebab(name) + (side === "back" ? "-back" : ""));
    byName.set(name, entry);
  }
  return byName;
}

function cards(srcDir: string, deck: Card["deck"], dir: string): Card[] {
  const result: Card[] = [];
  for (const [name, imgs] of sides(srcDir, dir)) {
    // Copies are numbered in the source ("Mists of Releh 2"); the printed name has no number.
    const id = `eh01/${dir}/${kebab(name)}`;
    const printed = deck === "asset" ? assetValues[id] : undefined;
    if (deck === "asset" && !printed) throw new Error(`${id} has no entry in scripts/asset-values.ts`);
    result.push({ id, name: name.replace(/ \d+$/, ""), deck, ...printed, images: { front: imgs.front!, ...(imgs.back && { back: imgs.back }) } });
  }
  return result;
}

/** Token copies and spawn relocation from the mod's src/Templates/01 Core/eh01 - token - monsters.json. */
const monsterCounts: Record<string, number> = { Cultist: 5, Ghoul: 2, "Goat Spawn": 2 };
const spawnMoveTo: Record<string, string> = {
  "Color Out of Space": "tunguska",
  Cthonian: "the-heart-of-africa",
  "Elder Thing": "antarctica",
  "Gnoph-Keh": "the-himalayas",
  Mummy: "the-pyramids",
  "Serpent People": "the-amazon",
};

function monsters(srcDir: string, epic: boolean): Monster[] {
  const result: Monster[] = [];
  for (const [name, imgs] of sides(srcDir, "monster")) {
    const count = monsterCounts[name];
    const moveTo = spawnMoveTo[name];
    const id = `eh01/monster/${kebab(name)}`;
    const combat = monsterStats[id];
    if (!combat) throw new Error(`${id} has no entry in scripts/monster-stats.ts`);
    result.push({ id, name, ...(epic && { epic }), ...(count && { count }), ...(moveTo && { spawnMoveTo: moveTo }), combat, images: { front: imgs.front!, back: imgs.back! } });
  }
  return result;
}

function encounters(): EncounterDeck[] {
  const decks: EncounterDeck[] = [];
  for (const region of ["America", "Europe", "Asia"] as const) {
    decks.push({ id: kebab(region), kind: "location", region: kebab(region) as EncounterDeck["region"], cards: numbered(`Encounters/${region}`, kebab(region)) });
  }
  decks.push({ id: "general", kind: "general", cards: numbered("Encounters/General", "general") });
  decks.push({ id: "other-world", kind: "other-world", cards: numbered("Encounters/Other World", "other-world") });
  const exp: NamedCard[] = [];
  for (const [name, imgs] of sides("Encounters/Expedition", "encounter/expedition")) {
    const short = name.replace(/^Encounter - Expedition - /, "");
    exp.push({ id: `eh01/encounter/expedition/${kebab(short)}`, name: short, images: { front: imgs.front!, back: imgs.back! } });
  }
  decks.push({ id: "expedition", kind: "expedition", cards: exp });
  return decks;
}

/** Single-sided numbered encounter cards sharing one deck back. */
function numbered(srcDir: string, id: string): NamedCard[] {
  const all = files(srcDir);
  const back = all.find((f) => / - back\./.test(f))!;
  const backRel = copy(srcDir, back, `encounter/${id}`, "back");
  return all
    .filter((f) => /\d+\./.test(f))
    .map((f) => {
      const n = /(\d+)\./.exec(f)![1]!;
      return { id: `eh01/encounter/${id}/${n}`, name: `${n}`, images: { front: copy(srcDir, f, `encounter/${id}`, n), back: backRel } };
    });
}

function mythos(): MythosCard[] {
  const result: MythosCard[] = [];
  for (const color of ["green", "yellow", "blue"] as const) {
    const dir = `Mythos/${color[0]!.toUpperCase()}${color.slice(1)}`;
    const backs: Record<string, string> = {};
    for (const f of files(dir)) {
      const m = /^(easy|medium|hard) - mythos$/i.exec(stem(f).replace(`${color} - `, ""));
      if (m) backs[m[1]!.toLowerCase()] = copy(dir, f, `mythos/${color}`, `${m[1]!.toLowerCase()}-back`);
    }
    for (const f of files(dir)) {
      const m = /^(Easy|Medium|Hard) - (.*)$/.exec(stem(f));
      if (!m || /errata/i.test(m[2]!)) continue;
      const difficulty = m[1]!.toLowerCase() as MythosCard["difficulty"];
      const id = `eh01/mythos/${color}/${kebab(m[2]!)}`;
      const icons = mythosEffects[id];
      if (!icons) throw new Error(`${id} has no entry in scripts/mythos-effects.ts`);
      result.push({ id, name: m[2]!, color, difficulty, ...icons, images: { front: copy(dir, f, `mythos/${color}`, kebab(m[2]!)), back: backs[difficulty]! } });
    }
  }
  return result;
}

/** Doom, mythos stages and sheet setup from the mod's src/Scripts/01 Core/<name>.js. */
const ancientSetup: Record<string, Pick<AncientOne, "doom" | "mythos" | "setup">> = {
  Azathoth: { doom: 15, mythos: { stage1: { green: 1, yellow: 2, blue: 1 }, stage2: { green: 2, yellow: 3, blue: 1 }, stage3: { green: 2, yellow: 4, blue: 0 } }, setup: { eldritchTokensOnOmen: 1 } },
  Cthulhu: { doom: 12, mythos: { stage1: { green: 0, yellow: 2, blue: 2 }, stage2: { green: 1, yellow: 3, blue: 0 }, stage3: { green: 3, yellow: 4, blue: 0 } }, setup: { setAsideMonsters: { "eh01/monster/deep-one": 1, "eh01/monster/star-spawn": 1 } } },
  "Shub-Niggurath": { doom: 13, mythos: { stage1: { green: 1, yellow: 2, blue: 1 }, stage2: { green: 3, yellow: 2, blue: 1 }, stage3: { green: 2, yellow: 4, blue: 0 } }, setup: { setAsideMonsters: { "eh01/monster/ghoul": 2, "eh01/monster/goat-spawn": 2, "eh01/monster/dark-young": 1 } } },
  "Yog-Sothoth": { doom: 14, mythos: { stage1: { green: 0, yellow: 2, blue: 1 }, stage2: { green: 2, yellow: 3, blue: 1 }, stage3: { green: 3, yellow: 4, blue: 0 } } },
};

function ancientOnes(): AncientOne[] {
  return Object.entries(ancientSetup).map(([name, setup]) => {
    const dir = `ancient-one/${kebab(name)}`;
    const srcDir = `Ancient Ones/${name}`;
    const all = files(srcDir).filter((f) => extname(f) !== ".xcf");
    const strip = (f: string) => stem(f).replace(`${name} - `, "");
    const find = (suffix: string) => all.find((f) => strip(f) === suffix)!;
    const backOf = (prefix: string) => copy(srcDir, find(`${prefix} - back`), dir, `${kebab(prefix)}-back`);
    const mysteryBack = backOf("Mystery");
    const researchBack = backOf("Research");
    const mysteries: NamedCard[] = [];
    const research: NamedCard[] = [];
    const special: NamedCard[] = [];
    for (const f of all) {
      const s = strip(f);
      if (/errata/i.test(s)) continue;
      let m = /^Mystery - (.+) - front$/.exec(s);
      if (m) mysteries.push({ id: `eh01/${dir}/mystery/${kebab(m[1]!)}`, name: m[1]!, images: { front: copy(srcDir, f, `${dir}/mystery`, kebab(m[1]!)), back: mysteryBack } });
      m = /^Research - (\d+)$/.exec(s);
      if (m) research.push({ id: `eh01/${dir}/research/${m[1]}`, name: m[1]!, images: { front: copy(srcDir, f, `${dir}/research`, m[1]!), back: researchBack } });
      m = /^Special - (.+) - (\d+)$/.exec(s);
      if (m) {
        const specialBack = copy(srcDir, find(`Special - ${m[1]} - back`), dir, `${kebab(m[1]!)}-back`);
        special.push({ id: `eh01/${dir}/special/${kebab(m[1]!)}-${m[2]}`, name: `${m[1]} ${m[2]}`, images: { front: copy(srcDir, f, `${dir}/special`, `${kebab(m[1]!)}-${m[2]}`), back: specialBack } });
      }
    }
    return {
      id: `eh01/ancient-one/${kebab(name)}`,
      name,
      ...setup,
      cultists: cultists[name]!,
      images: { front: copy(srcDir, find("front"), dir, "sheet"), back: copy(srcDir, find("back"), dir, "sheet-back") },
      mysteries,
      research,
      ...(special.length > 0 && { special }),
    };
  });
}

/**
 * Health, sanity, starting items, space and story from the mod's
 * src/Scripts/01 Core/investigators.js; skills typed from the sheet images.
 * Starting card ids omit the copy suffix ("mists-of-releh", not "-1").
 */
type Row = [name: string, health: number, sanity: number, skills: [number, number, number, number, number], space: string, story: string, starting: Investigator["starting"]];
const investigatorRows: Row[] = [
  ["Akachi Onyele", 5, 7, [3, 2, 2, 2, 4], "space-15", "Guardian of the Veil", { clues: 1, spells: ["eh01/spell/mists-of-releh"] }],
  ["Charlie Kane", 4, 8, [2, 4, 3, 2, 2], "san-francisco", "Citizen Kane", { assets: ["eh01/asset/personal-assistant"] }],
  ["Diana Stanley", 7, 5, [4, 2, 3, 3, 1], "space-7", "Bound by the Past", { assets: ["eh01/asset/arcane-manuscripts"], spells: ["eh01/spell/wither"] }],
  ["Jacqueline Fine", 4, 8, [4, 2, 3, 1, 3], "space-5", "Arbiter of Fate", { clues: 1, spells: ["eh01/spell/flesh-ward"] }],
  ["Jim Culver", 7, 5, [3, 3, 2, 2, 3], "space-6", "Dead Rising", { clues: 1, spells: ["eh01/spell/shriveling"] }],
  ["Leo Anderson", 6, 6, [2, 2, 3, 3, 3], "buenos-aires", "The Expedition", { assets: ["eh01/asset/hired-muscle"] }],
  ["Lily Chen", 6, 6, [2, 2, 2, 4, 3], "shanghai", "All That Stands", { assets: ["eh01/asset/protective-amulet", "eh01/asset/lucky-rabbit-s-foot"] }],
  ["Lola Hayes", 5, 7, [2, 4, 2, 2, 3], "tokyo", "In the Limelight", { assets: ["eh01/asset/18-derringer"] }],
  ["Mark Harrigan", 8, 4, [1, 2, 2, 4, 4], "space-14", "Shadowed Heart", { assets: ["eh01/asset/38-revolver", "eh01/asset/kerosene"] }],
  ["Norman Withers", 5, 7, [3, 1, 3, 2, 4], "arkham", "Written in the Stars", { spells: ["eh01/spell/feed-the-mind"] }],
  ["Silas Marsh", 8, 4, [1, 3, 3, 3, 3], "sydney", "The Call", { assets: ["eh01/asset/fishing-net"] }],
  ["Trish Scarborough", 7, 5, [1, 3, 4, 3, 2], "space-16", "Cracking the Code", { assets: ["eh01/asset/45-automatic"] }],
];

function investigators(): Investigator[] {
  const sheets = sides("Investigators", "investigator");
  const pawns = new Map(files("Investigators/Pawns").map((f) => [stem(f), copy("Investigators/Pawns", f, "investigator/pawn", kebab(stem(f)))]));
  return investigatorRows.map(([name, health, sanity, [lore, influence, observation, strength, will], startingSpace, personalStory, starting]) => {
    const imgs = sheets.get(name);
    if (!imgs?.front || !imgs.back || !pawns.has(name)) throw new Error(`missing images for ${name}`);
    return {
      id: `eh01/investigator/${kebab(name)}`,
      name,
      health,
      sanity,
      skills: { lore, influence, observation, strength, will },
      startingSpace,
      starting,
      personalStory,
      images: { front: imgs.front, back: imgs.back },
      pawn: pawns.get(name)!,
    };
  });
}

/** Tokens and reference art: copied, not catalogued in this change. */
function tokens() {
  for (const dir of ["Clues", "Gates", "Health", "Sanity", "Travel", "Improvements", "Icon Reference", "Icon Reference/Variant"]) {
    for (const f of files(dir)) copy(dir, f, `tokens/${kebab(dir)}`, kebab(stem(f)));
  }
  for (const f of files(".")) if (!/^(Game Board|Assets)$/.test(stem(f))) copy(".", f, "tokens", kebab(stem(f)));
}

const set = {
  cards: [
    ...cards("Assets", "asset", "asset"),
    ...cards("Spells", "spell", "spell"),
    ...cards("Conditions", "condition", "condition"),
    ...cards("Artifacts", "artifact", "artifact"),
  ],
  monsters: [...monsters("Monsters", false), ...monsters("Epic Monsters", true)],
  encounters: encounters(),
  mythos: mythos(),
  "ancient-ones": ancientOnes(),
  investigators: investigators(),
};
tokens();

mkdirSync(out, { recursive: true });
writeFileSync(join(out, "set.json"), JSON.stringify({ id: "eh01", name: "Eldritch Horror" }, null, 2) + "\n");
for (const [file, data] of Object.entries(set)) writeFileSync(join(out, `${file}.json`), JSON.stringify(data, null, 2) + "\n");

console.log(table.join("\n"));
console.log(`\ncopied ${table.length} files`);
for (const [k, v] of Object.entries(set)) console.log(`${k}: ${v.length}`);
