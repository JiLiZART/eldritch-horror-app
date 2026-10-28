import { describe, expect, it } from "vitest";
import { validateBoard, validateIcons, validateSet } from "./validate";
import type { Board, IconManifest, GameSet } from "./types";

const space = (id: string, extra: Partial<Board["spaces"][number]> = {}) => ({
  id,
  name: { en: id, ru: id },
  kind: "city" as const,
  region: "europe" as const,
  set: "eh01" as const,
  x: 0.5,
  y: 0.5,
  ...extra,
});

const board: Board = {
  source: { file: "inspired/All_boards.jpg", width: 100, height: 50 },
  texture: "board/all-boards.jpg",
  tracks: { doom: { from: { x: 0.1, y: 0.1 }, to: { x: 0.9, y: 0.1 }, spaces: 21 }, omen: { center: { x: 0.9, y: 0.3 }, radius: 0.05 } },
  spaces: [space("a"), space("b"), space("c", { set: "eh07" })],
  paths: [
    { from: "a", to: "b", type: "train" },
    { from: "b", to: "c", type: "local" },
  ],
};

const emptySet: GameSet = {
  id: "eh01",
  name: "Core",
  investigators: [],
  ancientOnes: [],
  cards: [],
  monsters: [],
  encounterDecks: [],
  mythos: [],
  preludes: [],
};

describe("validateBoard", () => {
  it("requires tracks inside the board", () => {
    expect(validateBoard({ ...board, tracks: { ...board.tracks, doom: { ...board.tracks.doom, to: { x: 1.2, y: 0.1 } } } })).toEqual(["doom track has coordinates outside 0..1"]);
    expect(validateBoard({ ...board, tracks: { ...board.tracks, doom: { ...board.tracks.doom, spaces: 1 } } })).toEqual(["doom track needs at least 2 spaces"]);
    expect(validateBoard({ ...board, tracks: { ...board.tracks, omen: { center: { x: 0.9, y: -0.1 }, radius: 0.05 } } })).toEqual(["omen track has coordinates outside 0..1"]);
  });
  it("accepts a connected board", () => {
    expect(validateBoard(board)).toEqual([]);
  });
  it("reports a path to an unknown space", () => {
    const bad = { ...board, paths: [...board.paths, { from: "a", to: "zzz", type: "ship" as const }] };
    expect(validateBoard(bad).join("\n")).toContain("zzz");
  });
  it("reports a disconnected core graph", () => {
    const bad = { ...board, spaces: [...board.spaces, space("island")] };
    expect(validateBoard(bad).join("\n")).toContain("island");
  });
  it("reports coordinates outside the unit square", () => {
    const bad = { ...board, spaces: [...board.spaces, space("far", { x: 1.5 })] };
    expect(validateBoard(bad).join("\n")).toContain("far");
  });
});

describe("validateSet", () => {
  const card = (id: string) => ({ id, name: id, deck: "asset" as const, value: 1, traits: ["Item"], images: { front: `cards/${id}.png` } });
  it("reports an asset without a value", () => {
    const { value: _, ...bad } = card("eh01/asset/x");
    expect(validateSet({ ...emptySet, cards: [bad] }, () => true).join("\n")).toContain("eh01/asset/x has no value");
  });
  it("reports an asset without traits", () => {
    const bad = { ...card("eh01/asset/x"), traits: [] };
    expect(validateSet({ ...emptySet, cards: [bad] }, () => true).join("\n")).toContain("eh01/asset/x has no traits");
  });
  it("reports duplicate ids", () => {
    const bad = { ...emptySet, cards: [card("eh01/asset/x"), card("eh01/asset/x")] };
    expect(validateSet(bad, () => true).join("\n")).toContain("eh01/asset/x");
  });
  it("reports a missing image", () => {
    const bad = { ...emptySet, cards: [card("eh01/asset/x")] };
    expect(validateSet(bad, () => false).join("\n")).toContain("cards/eh01/asset/x.png");
  });
  it("reports a starting item that is not a card", () => {
    const inv = { id: "eh01/investigator/x", name: "x", health: 1, sanity: 1, skills: { lore: 1, influence: 1, observation: 1, strength: 1, will: 1 }, startingSpace: "a", starting: { spells: ["eh01/spell/nope"] }, personalStory: "s", images: { front: "i.png" }, pawn: "p.png" };
    expect(validateSet({ ...emptySet, investigators: [inv] }, () => true).join("\n")).toContain("eh01/spell/nope");
  });
  it("resolves a starting item to a numbered copy", () => {
    const inv = { id: "eh01/investigator/x", name: "x", health: 1, sanity: 1, skills: { lore: 1, influence: 1, observation: 1, strength: 1, will: 1 }, startingSpace: "a", starting: { spells: ["eh01/spell/wither"] }, personalStory: "s", images: { front: "i.png" }, pawn: "p.png" };
    const spell = { id: "eh01/spell/wither-1", name: "Wither", deck: "spell" as const, images: { front: "w.png" } };
    expect(validateSet({ ...emptySet, investigators: [inv], cards: [spell] }, () => true)).toEqual([]);
  });
  it("accepts a set whose images exist", () => {
    expect(validateSet({ ...emptySet, cards: [card("eh01/asset/x")] }, () => true)).toEqual([]);
  });
  const combat = { will: { modifier: 0, horror: 1 }, strength: { modifier: 0, damage: 1 }, toughness: 1 };
  const monster = (id: string, extra: Partial<GameSet["monsters"][number]> = {}) => ({ id, name: id, combat, images: { front: "m.png", back: "mb.png" }, ...extra });
  it("reports a non-epic monster without a toughness", () => {
    const bad = { ...emptySet, monsters: [monster("eh01/monster/ghoul", { combat: { will: combat.will } })] };
    expect(validateSet(bad, () => true).join("\n")).toContain("eh01/monster/ghoul has no toughness");
  });
  it("reports a non-epic monster without any test", () => {
    const bad = { ...emptySet, monsters: [monster("eh01/monster/ghoul", { combat: { toughness: 1 } })] };
    expect(validateSet(bad, () => true).join("\n")).toContain("eh01/monster/ghoul has no test");
  });
  it("accepts an epic monster whose toughness is a formula", () => {
    const ok = { ...emptySet, monsters: [monster("eh01/monster/cthulhu", { epic: true, combat: { will: combat.will } })] };
    expect(validateSet(ok, () => true)).toEqual([]);
  });
  const ancient = (setup: NonNullable<GameSet["ancientOnes"][number]["setup"]>) => ({
    id: "eh01/ancient-one/x", name: "x", doom: 10, images: { front: "a.png" }, mysteries: [], research: [],
    mythos: { stage1: { green: 1, yellow: 1, blue: 1 }, stage2: { green: 1, yellow: 1, blue: 1 }, stage3: { green: 1, yellow: 1, blue: 1 } }, setup, cultists: combat,
  });
  it("reports a set-aside monster the set does not have", () => {
    const bad = { ...emptySet, monsters: [monster("eh01/monster/ghoul")], ancientOnes: [ancient({ setAsideMonsters: { "eh01/monster/nope": 1 } })] };
    expect(validateSet(bad, () => true, board).join("\n")).toContain("eh01/monster/nope");
  });
  it("reports a spawn relocation to a space not on the board", () => {
    const bad = { ...emptySet, monsters: [monster("eh01/monster/mummy", { spawnMoveTo: "atlantis" })] };
    expect(validateSet(bad, () => true, board).join("\n")).toContain("eh01/monster/mummy");
  });
  const mythos = (extra: Partial<GameSet["mythos"][number]> = {}) => ({
    id: "eh01/mythos/green/x", name: "x", color: "green" as const, difficulty: "easy" as const, trait: "event" as const, effects: ["advance-omen" as const], images: { front: "m.png" }, ...extra,
  });
  it("reports an unknown mythos trait naming the card", () => {
    const bad = { ...emptySet, mythos: [mythos({ trait: "rumor" as "event" })] };
    expect(validateSet(bad, () => true).join("\n")).toMatch(/eh01\/mythos\/green\/x.*rumor/);
  });
  it("reports an unknown mythos effect naming the card", () => {
    const bad = { ...emptySet, mythos: [mythos({ effects: ["advance-omen", "summon-dragons" as "reckoning"] })] };
    expect(validateSet(bad, () => true).join("\n")).toMatch(/eh01\/mythos\/green\/x.*summon-dragons/);
  });
  it("reports a mythos card without icons", () => {
    const bad = { ...emptySet, mythos: [mythos({ effects: [] })] };
    expect(validateSet(bad, () => true).join("\n")).toContain("eh01/mythos/green/x");
  });
  it("accepts a mythos card with a known trait and icons", () => {
    expect(validateSet({ ...emptySet, mythos: [mythos()] }, () => true)).toEqual([]);
  });
  it("accepts set-aside monsters and relocations that resolve", () => {
    const ok = { ...emptySet, monsters: [monster("eh01/monster/ghoul", { count: 2, spawnMoveTo: "a" })], ancientOnes: [ancient({ setAsideMonsters: { "eh01/monster/ghoul": 2 } })] };
    expect(validateSet(ok, () => true, board)).toEqual([]);
  });
});

describe("validateIcons", () => {
  const manifest: IconManifest = {
    icons: { clue: { file: "icons/clue.png", width: 81, height: 81, source: "inspired/manual_eng.pdf", page: 3 } },
    dice: { file: "icons/dice.svg", source: "ttp" },
  };
  it("accepts a manifest matching the directory", () => {
    expect(validateIcons(manifest, ["icons/clue.png", "icons/dice.svg"])).toEqual([]);
  });
  it("reports a file not in the manifest", () => {
    expect(validateIcons(manifest, ["icons/clue.png", "icons/dice.svg", "icons/stray.png"]).join("\n")).toContain("stray");
  });
  it("reports a manifest entry not on disk", () => {
    expect(validateIcons(manifest, ["icons/dice.svg"]).join("\n")).toContain("clue");
  });
});
