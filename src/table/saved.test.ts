import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board } from "../content/types";
import { setupGame } from "../engine/setup";
import { fileName, loadGame, loadSlots, parseGame, removeGame, renameGame, saveGame, type Slot } from "./saved";

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
  it("keeps two games in two listed slots and resumes the current one", () => {
    const storage = fake();
    const other = { ...game(), seed: 4 };
    saveGame(storage, "a", game(), "Azathoth · seed 3 · round 1");
    saveGame(storage, "b", other, "Azathoth · seed 4 · round 1");
    const index = loadSlots(storage);
    expect(index.slots.map((s) => s.name)).toEqual(["Azathoth · seed 3 · round 1", "Azathoth · seed 4 · round 1"]);
    expect(index.current).toBe("b");
    expect(loadGame(storage, "a")).toEqual({ state: game(), history: [] });
    expect(loadGame(storage, "b")).toEqual({ state: other, history: [] });
  });
  it("removes one slot and keeps the other", () => {
    const storage = fake();
    saveGame(storage, "a", game(), "A");
    saveGame(storage, "b", { ...game(), seed: 4 }, "B");
    expect(removeGame(storage, "b")).toEqual({ slots: [expect.objectContaining({ id: "a", name: "A" })] });
    expect(loadGame(storage, "a")).toEqual({ state: game(), history: [] });
    expect(loadGame(storage, "b")).toEqual({});
  });
  it("moves a save from before slots existed into a slot", () => {
    const storage = fake();
    storage.setItem("eldritch-horror.game", JSON.stringify(game()));
    const index = loadSlots(storage);
    expect(index.slots).toHaveLength(1);
    expect(index.current).toBe(index.slots[0]!.id);
    expect(storage.items.has("eldritch-horror.game")).toBe(false);
    expect(loadGame(storage, index.current!)).toEqual({ state: game(), history: [] });
  });
  it("sets aside garbage, a save without a phase and an older shape with a note", () => {
    const storage = fake();
    storage.setItem("eldritch-horror.game.x", "{not json");
    expect(loadGame(storage, "x")).toEqual({ note: "the saved game could not be read" });
    storage.setItem("eldritch-horror.game.x", JSON.stringify({ seed: 3 }));
    expect(loadGame(storage, "x")).toEqual({ note: "the saved game could not be read" });
    storage.setItem("eldritch-horror.game.x", JSON.stringify({ ...game(), version: 1 }));
    expect(loadGame(storage, "x")).toEqual({ note: "the saved game was written by an older version and was set aside" });
    expect(loadGame(storage, "nope")).toEqual({});
  });
});

describe("a slot can carry a players' name", () => {
  it("keeps the title through a later save and clears it when emptied", () => {
    const storage = fake();
    saveGame(storage, "a", game(), "Azathoth · seed 3 · round 1");
    renameGame(storage, "a", "Tuesday group");
    saveGame(storage, "a", { ...game(), round: 2 }, "Azathoth · seed 3 · round 2");
    expect(loadSlots(storage).slots[0]).toMatchObject({ name: "Azathoth · seed 3 · round 2", title: "Tuesday group" });
    expect(renameGame(storage, "a", "").slots[0]?.title).toBeUndefined();
  });
});

describe("the last step can be undone", () => {
  const steps = (n: number) => Array.from({ length: n }, (_, k) => ({ ...game(), round: k + 1 }));
  it("brings the history back with the game, bounded to the last ten", () => {
    const storage = fake();
    saveGame(storage, "a", game(), "A", steps(12));
    expect(loadGame(storage, "a").history?.map((s) => s.round)).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });
  it("drops the history with its slot", () => {
    const storage = fake();
    saveGame(storage, "a", game(), "A", steps(2));
    removeGame(storage, "a");
    expect([...storage.items.keys()].filter((k) => k.includes("history"))).toEqual([]);
  });
  it("loads a garbage history as empty", () => {
    const storage = fake();
    saveGame(storage, "a", game(), "A", steps(2));
    storage.setItem("eldritch-horror.history.a", "{nope");
    expect(loadGame(storage, "a")).toEqual({ state: game(), history: [] });
  });
});

describe("the game is saved to and loaded from a file", () => {
  it("parses a saved state and names the file after the seed and round", () => {
    expect(parseGame(JSON.stringify(game()))).toEqual({ state: game() });
    expect(fileName({ ...game(), round: 3 })).toBe("eldritch-horror-3-round-3.json");
  });
  it("refuses garbage, an older shape and nothing", () => {
    expect(parseGame("{not json")).toEqual({ note: "the saved game could not be read" });
    expect(parseGame(JSON.stringify({ ...game(), version: 1 }))).toEqual({ note: "the saved game was written by an older version and was set aside" });
    expect(parseGame("")).toEqual({ note: "the saved game could not be read" });
  });
});
