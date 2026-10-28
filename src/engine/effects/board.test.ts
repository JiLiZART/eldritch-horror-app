import { describe, expect, it } from "vitest";
import { endTurn } from "../actions";
import { setupGame } from "../setup";
import type { GameState } from "../types";
import { ambush, changeEldritchOnOmen, closeGate, discardMonster, placeToken, removeToken, spawnClueByText, spawnGateByText, spawnMonsterByText, spawnNamed, spawnSetAside } from "../effects";
import { set, content, leo, lily, encounters, log } from "./fixture";

describe("a named monster is spawned from the cup", () => {
  const cultist = "eh01/monster/cultist";
  it("takes the kind from wherever it lies in the cup", () => {
    const before = encounters();
    const s = spawnNamed(before, content, leo, cultist, "london");
    expect(s.monsters.at(-1)).toMatchObject({ id: cultist, space: "london" });
    expect(s.monsterCup).toHaveLength(before.monsterCup.length - 1);
    expect(log(s)).toMatch(/Cultist spawns on London/);
  });
  it("refuses a kind the cup lacks", () => {
    const s = encounters();
    expect(() => spawnNamed({ ...s, monsterCup: s.monsterCup.filter((m) => m.id !== cultist) }, content, leo, cultist, "london")).toThrow(/no Cultist is in the cup/);
  });
});

describe("a gate on the space is closed", () => {
  it("discards the gate token and leaves the monsters", () => {
    const open = { ...encounters(), gates: ["buenos-aires"], monsters: [{ id: "eh01/monster/ghoul", instance: 1, space: "buenos-aires", health: 0 }] };
    const s = closeGate(open, content, leo);
    expect(s.gates).toEqual([]);
    expect(s.gateDiscard[0]).toBe("buenos-aires");
    expect(s.monsters).toHaveLength(1);
  });
  it("is refused without a gate", () => {
    expect(() => closeGate(encounters(), content, leo)).toThrow(/no gate stands on Buenos Aires/);
  });
});

describe("rumor and eldritch tokens are placed and removed by card text", () => {
  it("places a rumor token and logs it", () => {
    const s = placeToken(encounters(), content, "rumor", "london");
    expect(s.rumors).toEqual(["london"]);
    expect(log(s)).toMatch(/a rumor token is placed on London/);
  });
  it("stacks eldritch tokens", () => {
    const s = placeToken(placeToken(encounters(), content, "eldritch", "tunguska"), content, "eldritch", "tunguska");
    expect(s.eldritch).toEqual({ tunguska: 2 });
  });
  it("removes a token", () => {
    const s = removeToken(placeToken(encounters(), content, "rumor", "london"), content, "rumor", "london");
    expect(s.rumors).toEqual([]);
    expect(log(s)).toMatch(/the rumor token on London is removed/);
    expect(removeToken(placeToken(encounters(), content, "eldritch", "arkham"), content, "eldritch", "arkham").eldritch).toEqual({});
  });
  it("refuses to remove what is not there and an unknown space", () => {
    expect(() => removeToken(encounters(), content, "eldritch", "arkham")).toThrow(/Arkham holds no eldritch token/);
    expect(() => placeToken(encounters(), content, "rumor", "atlantis")).toThrow(/no space atlantis/);
  });
});

describe("eldritch tokens on the omen track change by card text", () => {
  it("adds to the green space", () => {
    const s = changeEldritchOnOmen(encounters(), 0, 1);
    expect(s.eldritchOnOmen).toEqual([2, 0, 0, 0]);
    expect(log(s)).toMatch(/an eldritch token is added to the green omen space/);
  });
  it("refuses to remove from an empty space", () => {
    expect(() => changeEldritchOnOmen(encounters(), 1, -1)).toThrow(/blue omen space holds no eldritch token/);
  });
});

describe("gates, clues and monsters are spawned by card text", () => {
  it("opens the top gate with a monster and logs it", () => {
    const before = encounters();
    const [top] = before.gateStack;
    const s = spawnGateByText(before, content, leo);
    expect(s.gates).toContain(top);
    expect(s.monsters.length + s.monsterCup.length).toBe(before.monsters.length + before.monsterCup.length);
    expect(s.monsters).toHaveLength(before.monsters.length + 1);
    expect(log(s)).toMatch(/a gate opens on/);
    expect(s.rolls).toBe(before.rolls + 1);
  });
  it("spawns the top monster on the named space or where its back sends it", () => {
    const before = encounters();
    const [top] = before.monsterCup;
    const s = spawnMonsterByText(before, content, leo, "buenos-aires");
    const sheet = set.monsters.find((m) => m.id === top!.id)!;
    expect(s.monsters.at(-1)).toMatchObject({ id: top!.id, space: sheet.spawnMoveTo ?? "buenos-aires" });
    expect(() => spawnMonsterByText(before, content, leo, "atlantis")).toThrow(/no space atlantis/);
  });
  it("spawns a clue on its printed space and logs an empty cup", () => {
    const before = encounters();
    const [top] = before.cluePool;
    expect(spawnClueByText(before, content, leo).clues).toContain(top);
    expect(log(spawnMonsterByText({ ...before, monsterCup: [] }, content, leo, "london"))).toMatch(/the monster cup is empty/);
  });
  it("ambushes only in the Encounter phase", () => {
    expect(ambush).toBeTypeOf("function");
  });
});

describe("set-aside monsters are spawned by name and set aside again", () => {
  const deepOne = "eh01/monster/deep-one";
  /** Cthulhu's Encounter phase with Leo Anderson encountering and no monster on either space. */
  const cthulhu = (): GameState => {
    const s = setupGame(content, { ancientOne: "eh01/ancient-one/cthulhu", investigators: [leo, lily], seed: 3 });
    return endTurn(endTurn({ ...s, monsters: s.monsters.filter((m) => !s.investigators.some((i) => i.space === m.space)) }));
  };
  it("spawns a set-aside Deep One on the named space", () => {
    const before = cthulhu();
    const s = spawnSetAside(before, content, leo, deepOne, "shanghai");
    expect(s.monsters.at(-1)).toMatchObject({ id: deepOne, space: "shanghai", setAside: true });
    expect(s.setAsideMonsters).toHaveLength(before.setAsideMonsters.length - 1);
    expect(log(s)).toMatch(/Deep One spawns from the set-aside pile on Shanghai/);
  });
  it("refuses when none of the kind is set aside", () => {
    const once = spawnSetAside(cthulhu(), content, leo, deepOne, "shanghai");
    expect(() => spawnSetAside(once, content, leo, deepOne, "london")).toThrow(/no Deep One is set aside/);
  });
  it("sets a discarded one aside again, not into the cup", () => {
    const once = spawnSetAside(cthulhu(), content, leo, deepOne, "shanghai");
    const token = once.monsters.at(-1)!;
    const s = discardMonster(once, content, token);
    expect(s.setAsideMonsters.some((m) => m.id === deepOne)).toBe(true);
    expect(s.monsterCup.some((m) => m.id === deepOne && m.instance === token.instance)).toBe(false);
    expect(log(s)).toMatch(/is discarded and is set aside again/);
  });
});
