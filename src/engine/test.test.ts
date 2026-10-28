import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board } from "../content/types";
import { setupGame } from "./setup";
import { rerollDie, test as skillTest } from "./test";
import type { GameState } from "./types";

const root = join(import.meta.dirname, "../..");
const board: Board = JSON.parse(readFileSync(join(root, "content/board/board.json"), "utf8"));
const set = loadSet(join(root, "content/sets/eh01"))!;
const charlie = "eh01/investigator/charlie-kane";
const norman = "eh01/investigator/norman-withers";
const game = (seed = 3) => setupGame({ board, set }, { ancientOne: "eh01/ancient-one/azathoth", investigators: [charlie, norman], seed });

describe("skill test", () => {
  it("rolls one die per point of the printed skill", () => {
    expect(skillTest(game(), set, charlie, "influence", 0).dice).toHaveLength(4);
  });
  it("adds the modifier to the dice count", () => {
    expect(skillTest(game(), set, charlie, "influence", -1).dice).toHaveLength(3);
  });
  it("adds the improvement to the dice count", () => {
    const s = game();
    const improved: GameState = { ...s, investigators: s.investigators.map((i) => (i.id === charlie ? { ...i, improvements: { influence: 2 as const } } : i)) };
    expect(skillTest(improved, set, charlie, "influence", 0).dice).toHaveLength(6);
  });
  it("rolls at least 1 die", () => {
    expect(skillTest(game(), set, norman, "influence", -2).dice).toHaveLength(1);
  });
  it("counts only 5 and 6 as successes", () => {
    for (let seed = 0; seed < 20; seed++) {
      const { dice, successes } = skillTest(game(seed), set, charlie, "influence", 2);
      for (const d of dice) expect(d).toBeGreaterThanOrEqual(1), expect(d).toBeLessThanOrEqual(6);
      expect(successes).toBe(dice.filter((d) => d >= 5).length);
    }
  });
  it("replays the same faces from the same seed and order", () => {
    const roll = () => {
      const first = skillTest(game(), set, charlie, "influence", 0);
      return [first.dice, skillTest(first.state, set, charlie, "lore", 0).dice];
    };
    expect(roll()).toEqual(roll());
  });
  it("counts the roll on the state so the next test rolls new dice", () => {
    const first = skillTest(game(), set, charlie, "influence", 0);
    expect(first.state.rolls).toBe(game().rolls + 1);
  });
});

describe("a die is rerolled for a clue", () => {
  /** Charlie Kane's Influence roll waiting in the Action phase, with `clues` to spend. */
  const waiting = (dice: number[], clues = 2, seed = 3): GameState => {
    const s = game(seed);
    return {
      ...s,
      heldClues: Array.from({ length: clues }, () => "arkham"),
      investigators: s.investigators.map((i) => (i.id === charlie ? { ...i, clues } : i)),
      phase: { name: "action", active: charlie, taken: [], acquiring: { investigator: charlie, dice, successes: dice.filter((d) => d >= 5).length } },
    };
  };
  const roll = (s: GameState) => (s.phase.name === "action" ? s.phase.acquiring! : undefined!);
  it("spends 1 clue, replaces the die and recounts", () => {
    const s = rerollDie(waiting([1, 2, 3, 4]), set, 1);
    expect(s.investigators.find((i) => i.id === charlie)!.clues).toBe(1);
    expect(roll(s).dice.filter((_, n) => n !== 1)).toEqual([1, 3, 4]);
    expect(roll(s).dice[1]).toBeGreaterThanOrEqual(1);
    expect(roll(s).successes).toBe(roll(s).dice.filter((d) => d >= 5).length);
    expect(s.rolls).toBe(game().rolls + 1);
  });
  it("keeps a worse face", () => {
    for (let seed = 0; seed < 50; seed++) {
      const s = rerollDie(waiting([6, 6, 6, 6], 1, seed), set, 0);
      if (roll(s).dice[0]! < 5) {
        expect(roll(s).successes).toBe(3);
        return;
      }
    }
    throw new Error("no seed rerolled below 5");
  });
  it("moves the spent token to the clue discard", () => {
    const before = { ...waiting([1, 2, 3, 4]), heldClues: ["arkham", "london"] };
    const s = rerollDie(before, set, 0);
    expect(s.clueDiscard).toEqual(["london"]);
    expect(s.heldClues).toEqual(["arkham"]);
  });
  it("refuses without a clue", () => {
    expect(() => rerollDie(waiting([1, 2, 3, 4], 0), set, 0)).toThrow(/costs 1 clue/);
  });
  it("refuses when no roll is waiting", () => {
    expect(() => rerollDie(game(), set, 0)).toThrow(/no roll is waiting/);
  });
});
