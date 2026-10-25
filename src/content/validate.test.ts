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
  const card = (id: string) => ({ id, name: id, deck: "asset" as const, images: { front: `cards/${id}.png` } });
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
