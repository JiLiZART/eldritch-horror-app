import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board } from "../content/types";
import { setupGame } from "../engine/setup";
import { duplicateGame, exportAll, fileName, importAll, loadGame, loadSlots, parseGame, removeGame, renameGame, saveGame, type Slot } from "./saved";

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

describe("every slot can be backed up and restored", () => {
  it("round-trips two slots with their names, histories and times, adding beside what is there", () => {
    const storage = fake();
    saveGame(storage, "a", game(), "A", [{ ...game(), round: 0 }]);
    renameGame(storage, "a", "Tuesday group");
    saveGame(storage, "b", { ...game(), seed: 4 }, "B");
    const text = exportAll(storage);
    removeGame(storage, "a");
    const result = importAll(storage, text);
    expect(result).toEqual({ added: 2, skipped: 0 });
    const index = loadSlots(storage);
    expect(index.slots).toHaveLength(3);
    const restored = index.slots.find((s) => s.title === "Tuesday group")!;
    expect(restored.id).not.toBe("a");
    expect(loadGame(storage, restored.id)).toEqual({ state: game(), history: [{ ...game(), round: 0 }] });
  });
  it("refuses a file that is not a backup and skips a state of an older shape", () => {
    const storage = fake();
    expect(() => importAll(storage, "{\"nope\":1}")).toThrow(/not a backup/);
    const text = JSON.stringify({ backup: 1, slots: [{ name: "old", savedAt: 1, state: { ...game(), version: 1 }, history: [] }] });
    expect(importAll(storage, text)).toEqual({ added: 0, skipped: 1 });
  });
});

describe("a slot can be duplicated", () => {
  it("copies the state, history and name into a new slot and leaves the original", () => {
    const storage = fake();
    const steps = [{ ...game(), round: 1 }];
    saveGame(storage, "a", { ...game(), round: 3 }, "Azathoth · seed 3 · round 3", steps);
    renameGame(storage, "a", "Tuesday group");
    const copy = duplicateGame(storage, "a");
    expect(copy).not.toBe("a");
    expect(loadGame(storage, copy)).toEqual({ state: { ...game(), round: 3 }, history: steps });
    expect(loadSlots(storage).slots.find((s) => s.id === copy)).toMatchObject({ name: "Azathoth · seed 3 · round 3", title: "Tuesday group (copy)" });
    expect(loadGame(storage, "a")).toEqual({ state: { ...game(), round: 3 }, history: steps });
    expect(loadSlots(storage).current).toBe(copy);
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
  it("writes the history before the game, so a following window finds both", () => {
    const order: string[] = [];
    const storage: Slot = { getItem: () => null, setItem: (k) => void order.push(k), removeItem: () => {} };
    saveGame(storage, "a", game(), "A", steps(1));
    expect(order.indexOf("eldritch-horror.history.a")).toBeLessThan(order.indexOf("eldritch-horror.game.a"));
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
    expect(fileName({ ...game(), round: 3 }, "Tuesday group")).toBe("Tuesday group.json");
    expect(fileName(game(), " Azathoth / round 4: final? ")).toBe("Azathoth - round 4- final.json");
    expect(fileName(game(), "   ")).toBe("eldritch-horror-3-round-1.json");
  });
  it("refuses garbage, an older shape and nothing", () => {
    expect(parseGame("{not json")).toEqual({ note: "the saved game could not be read" });
    expect(parseGame(JSON.stringify({ ...game(), version: 1 }))).toEqual({ note: "the saved game was written by an older version and was set aside" });
    expect(parseGame("")).toEqual({ note: "the saved game could not be read" });
  });
});
