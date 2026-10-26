import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board } from "../content/types";
import { setupGame } from "./setup";
import { test as skillTest } from "./test";

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
