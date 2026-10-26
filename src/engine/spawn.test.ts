import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board } from "../content/types";
import { rng } from "./rng";
import { setupGame } from "./setup";
import { spawnClue, spawnGate, spawnMonster } from "./spawn";

const root = join(import.meta.dirname, "../..");
const board: Board = JSON.parse(readFileSync(join(root, "content/board/board.json"), "utf8"));
const set = loadSet(join(root, "content/sets/eh01"))!;
const content = { board, set };
const game = () =>
  setupGame(content, { ancientOne: "eh01/ancient-one/azathoth", investigators: ["eh01/investigator/leo-anderson", "eh01/investigator/lily-chen"], seed: 3 });

describe("spawnGate", () => {
  it("opens the top gate of the stack with 1 monster from the cup", () => {
    const s = game();
    const next = spawnGate(s, content, rng(1));
    expect(next.gates).toEqual([...s.gates, s.gateStack[0]]);
    expect(next.gateStack).toEqual(s.gateStack.slice(1));
    expect(next.monsters).toHaveLength(s.monsters.length + 1);
    expect(next.monsters.at(-1)?.id).toBe(s.monsterCup[0]?.id);
    expect(next.monsterCup).toEqual(s.monsterCup.slice(1));
  });
  it("reshuffles the gate discard into an empty stack first", () => {
    const s = { ...game(), gateStack: [], gateDiscard: ["london", "rome"] };
    const next = spawnGate(s, content, rng(1));
    expect(next.gateDiscard).toEqual([]);
    expect(next.gateStack).toHaveLength(1);
    expect(["london", "rome"]).toContain(next.gates.at(-1));
  });
  it("advances doom by 1 instead when no gate token is left", () => {
    const s = { ...game(), gateStack: [], gateDiscard: [], doom: 10 };
    const next = spawnGate(s, content, rng(1));
    expect(next.doom).toBe(9);
    expect(next.gates).toEqual(s.gates);
    expect(next.monsters).toEqual(s.monsters);
  });
});

describe("spawnMonster", () => {
  it("moves a monster whose token back names another space", () => {
    const s = { ...game(), monsterCup: [{ id: "eh01/monster/color-out-of-space", instance: 1 }] };
    const next = spawnMonster(s, content, "london");
    expect(next.monsters.at(-1)).toEqual({ id: "eh01/monster/color-out-of-space", instance: 1, space: "tunguska" });
    expect(next.monsterCup).toEqual([]);
  });
  it("spawns nothing from an empty cup", () => {
    const s = { ...game(), monsterCup: [] };
    expect(spawnMonster(s, content, "london").monsters).toEqual(s.monsters);
  });
});

describe("spawnClue", () => {
  it("places the top clue of the pool", () => {
    const s = game();
    const next = spawnClue(s, content, rng(1));
    expect(next.clues).toEqual([...s.clues, s.cluePool[0]]);
    expect(next.cluePool).toEqual(s.cluePool.slice(1));
  });
  it("reshuffles the clue discard into an empty pool first", () => {
    const s = { ...game(), cluePool: [], clueDiscard: ["rome", "london"] };
    const next = spawnClue(s, content, rng(1));
    expect(next.clueDiscard).toEqual([]);
    expect(next.cluePool).toHaveLength(1);
    expect(["rome", "london"]).toContain(next.clues.at(-1));
  });
  it("places nothing when the pool and discard are empty", () => {
    const s = { ...game(), cluePool: [], clueDiscard: [] };
    expect(spawnClue(s, content, rng(1)).clues).toEqual(s.clues);
  });
});
