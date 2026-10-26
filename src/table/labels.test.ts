import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Board, BoardLabels } from "../content/types";
import { fitScale, iconGaps } from "./labels";

const read = (path: string) => JSON.parse(readFileSync(new URL(`../../${path}`, import.meta.url), "utf8"));

describe("fitScale", () => {
  it("keeps text that fits", () => {
    expect(fitScale([0, 0, 50, 10], 100, 20)).toBe(1);
  });
  it("shrinks by the tighter of width and height", () => {
    expect(fitScale([-100, -5, 100, 5], 100, 20)).toBe(0.5);
    expect(fitScale([0, 0, 10, 40], 100, 20)).toBe(0.5);
  });
});

describe("iconGaps", () => {
  it("leaves plain text alone", () => {
    expect(iconGaps("New clues")).toEqual({ text: "New clues", icons: [] });
  });
  it("replaces each skill placeholder with one gap character at its index", () => {
    const { text, icons } = iconGaps("Test {lore} or {will}.");
    expect(text).toBe("Test   or  .");
    expect(icons).toEqual([
      { skill: "lore", index: 5 },
      { skill: "will", index: 10 },
    ]);
  });
  it("keeps unknown braces as text", () => {
    expect(iconGaps("{nope}").icons).toEqual([]);
  });
});

describe("board labels data", () => {
  const labels: BoardLabels = read("content/board/labels.json");
  const board: Board = read("content/board/board.json");
  const spaces = new Set(board.spaces.map((s) => s.id));
  const keys = [...labels.slots, ...labels.locations.flatMap((l) => l.slots)].map((s) => s.key);

  it("places 34 cut-outs on board spaces, each with its image", () => {
    expect(labels.locations).toHaveLength(34);
    for (const l of labels.locations) {
      expect(spaces.has(l.space), l.space).toBe(true);
      expect(existsSync(new URL(`../../public/${l.image}`, import.meta.url)), l.image).toBe(true);
    }
  });
  it.each(["en", "ru"])("has a %s string for every slot", (lang) => {
    const strings: Record<string, string> = read(`content/board/i18n/${lang}.json`);
    expect(keys.filter((k) => !strings[k])).toEqual([]);
  });
  it("names London in both languages", () => {
    expect(read("content/board/i18n/en.json")["loc.london.name"]).toBe("London");
    expect(read("content/board/i18n/ru.json")["loc.london.name"]).toBe("Лондон");
  });
});
