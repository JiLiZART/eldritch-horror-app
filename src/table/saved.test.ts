import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board } from "../content/types";
import { setupGame } from "../engine/setup";
import { clearGame, loadGame, saveGame, type Slot } from "./saved";

const root = join(import.meta.dirname, "../..");
const board: Board = JSON.parse(readFileSync(join(root, "content/board/board.json"), "utf8"));
const set = loadSet(join(root, "content/sets/eh01"))!;
const game = () => setupGame({ board, set }, { ancientOne: "eh01/ancient-one/azathoth", investigators: ["eh01/investigator/leo-anderson"], seed: 3 });

/** A storage kept in memory. */
const fake = (): Slot & { items: Map<string, string> } => {
  const items = new Map<string, string>();
  return { items, getItem: (k) => items.get(k) ?? null, setItem: (k, v) => void items.set(k, v), removeItem: (k) => void items.delete(k) };
};

describe("the game in progress survives a reload", () => {
  it("loads back what was saved, with no note", () => {
    const storage = fake();
    saveGame(storage, game());
    expect(loadGame(storage)).toEqual({ state: game() });
  });
  it("loads nothing from an empty slot", () => {
    expect(loadGame(fake())).toEqual({});
  });
  it("sets aside garbage and a save without a phase with a note", () => {
    const storage = fake();
    storage.setItem("eldritch-horror.game", "{not json");
    expect(loadGame(storage)).toEqual({ note: "the saved game could not be read" });
    storage.setItem("eldritch-horror.game", JSON.stringify({ seed: 3 }));
    expect(loadGame(storage)).toEqual({ note: "the saved game could not be read" });
  });
  it("sets aside a save from an older state shape with a note", () => {
    const storage = fake();
    storage.setItem("eldritch-horror.game", JSON.stringify({ ...game(), version: 1 }));
    expect(loadGame(storage)).toEqual({ note: "the saved game was written by an older version and was set aside" });
  });
  it("clears the slot", () => {
    const storage = fake();
    saveGame(storage, game());
    clearGame(storage);
    expect(storage.items.size).toBe(0);
  });
});
