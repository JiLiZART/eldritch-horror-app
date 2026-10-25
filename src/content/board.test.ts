import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { activeGraph, distance, reachable } from "./board";
import type { Board } from "./types";

const board: Board = JSON.parse(readFileSync(new URL("../../content/board/board.json", import.meta.url), "utf8"));
const byId = (id: string) => board.spaces.find((s) => s.id === id);
const active = (sets: string[]) => new Set(board.spaces.filter((s) => sets.includes(s.set)).map((s) => s.id));

describe("board graph", () => {
  it("has London as a core Europe city", () => {
    expect(byId("london")).toMatchObject({ kind: "city", region: "europe", set: "eh01" });
  });
  it("has Lake Camp as eh03 wilderness without region", () => {
    expect(byId("eh03-lake-camp")).toMatchObject({ kind: "wilderness", set: "eh03" });
    expect(byId("eh03-lake-camp")?.region).toBeUndefined();
  });
  it("has numbered spaces 1 to 21 with their printed kind", () => {
    for (let n = 1; n <= 21; n++) expect(byId(`space-${n}`)?.number).toBe(n);
    expect(byId("space-15")?.kind).toBe("city");
    expect(byId("space-2")?.kind).toBe("sea");
  });
  it("joins San Francisco and space 5 by train", () => {
    // The printed board has no direct SF-Arkham path: it runs SF-5-Arkham.
    const p = board.paths.find((p) => [p.from, p.to].sort().join() === "san-francisco,space-5");
    expect(p?.type).toBe("train");
  });
  it("reaches every core space from Arkham with the core set only", () => {
    const core = active(["eh01"]);
    expect([...reachable(board, core, "arkham")].sort()).toEqual([...core].sort());
  });
  it("has no active path to the Dreamlands when eh07 is disabled", () => {
    const on = active(["eh01", "eh03", "eh05"]);
    const dream = board.spaces.filter((s) => s.set === "eh07").map((s) => s.id);
    for (const p of board.paths) {
      if (on.has(p.from) && on.has(p.to)) expect(dream).not.toContain(p.from);
    }
    expect(dream.length).toBeGreaterThan(0);
  });
  it("counts adjacent spaces as distance 1", () => {
    expect(distance(board, "san-francisco", "space-5")).toBe(1);
    expect(distance(board, "san-francisco", "arkham")).toBe(2);
  });
});

describe("activeGraph", () => {
  it("keeps only core spaces and paths between them", () => {
    const g = activeGraph(board, new Set(["eh01"]));
    expect(g.spaces).toHaveLength(36);
    const ids = new Set(g.spaces.map((s) => s.id));
    for (const p of g.paths) expect(ids.has(p.from) && ids.has(p.to)).toBe(true);
  });
  it("adds the Dreamlands spaces when eh07 is enabled", () => {
    const g = activeGraph(board, new Set(["eh01", "eh07"]));
    expect(g.spaces).toHaveLength(43);
    expect(g.paths.some((p) => p.from.startsWith("eh07") || p.to.startsWith("eh07"))).toBe(true);
  });
});
