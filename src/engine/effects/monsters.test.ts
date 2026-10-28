import { describe, expect, it } from "vitest";
import { fight } from "../encounter";
import { discardMonster, monsterSteps, moveMonster, moveMonsterToward } from "../effects";
import { content, leo, lily, patch, encounters, log, byakhee, cthulhu, withMonster, on } from "./fixture";

describe("a monster is moved by card text", () => {
  it("moves to a named space", () => {
    const s = moveMonster(withMonster(byakhee, "london"), content, byakhee, "arkham");
    expect(on(s, byakhee.id)).toEqual(["arkham"]);
    expect(log(s)).toMatch(/the Byakhee moves to Arkham/);
  });
  it("moves one space toward the nearest investigator", () => {
    const s = moveMonsterToward(patch(withMonster(byakhee, "arkham"), leo, { space: "london" }), content, byakhee);
    expect(on(s, byakhee.id)).toEqual(["london"]);
    expect(log(s)).toMatch(/the Byakhee moves to London/);
  });
  it("asks the players to choose among tied steps and takes their pick", () => {
    const tied = patch(patch(withMonster(byakhee, "istanbul"), leo, { space: "london" }), lily, { space: "london" });
    expect(monsterSteps(tied, content, byakhee)).toEqual(["rome", "space-14"]);
    expect(() => moveMonsterToward(tied, content, byakhee)).toThrow(/choose the Byakhee's step: Rome, Space 14/);
    expect(() => moveMonsterToward(tied, content, byakhee, "arkham")).toThrow(/choose the Byakhee's step/);
    expect(on(moveMonsterToward(tied, content, byakhee, "space-14"), byakhee.id)).toEqual(["space-14"]);
  });
  it("stays when already with an investigator", () => {
    const before = patch(withMonster(byakhee, "london"), leo, { space: "london" });
    const s = moveMonsterToward(before, content, byakhee);
    expect(s.monsters).toEqual(before.monsters);
    expect(log(s)).toMatch(/the Byakhee is already with Leo Anderson/);
  });
  it("refuses to move or discard the monster being fought", () => {
    const s = withMonster(byakhee, "buenos-aires");
    const waiting = fight(s, content, byakhee);
    expect(() => moveMonster(waiting, content, byakhee, "arkham")).toThrow(/fight is not over/);
    expect(() => discardMonster(waiting, content, byakhee)).toThrow(/fight is not over/);
  });
  it("refuses a monster not on the board", () => {
    expect(() => moveMonster(encounters(), content, { id: "eh01/monster/byakhee", instance: 9 }, "arkham")).toThrow(/no Byakhee on the board/);
  });
  it("refuses an unknown space", () => {
    expect(() => moveMonster(withMonster(byakhee, "london"), content, byakhee, "atlantis")).toThrow(/no space atlantis/);
  });
});

describe("a monster is discarded by card text", () => {
  it("returns a non-epic monster to the cup", () => {
    const before = withMonster(byakhee, "london");
    const s = discardMonster(before, content, byakhee);
    expect(s.rolls).toBe(before.rolls + 1);
    expect(on(s, byakhee.id)).toEqual([]);
    expect(s.monsterCup).toContainEqual(byakhee);
    expect(log(s)).toMatch(/the Byakhee is discarded and returns to the cup/);
  });
  it("removes an epic monster from the game", () => {
    const s = discardMonster(withMonster(cthulhu, "arkham"), content, cthulhu);
    expect(on(s, cthulhu.id)).toEqual([]);
    expect(s.monsterCup).not.toContainEqual(cthulhu);
    expect(log(s)).toMatch(/the Cthulhu is discarded and leaves the game/);
  });
});
