import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board } from "../content/types";
import { endTurn } from "./actions";
import { changeEldritchOnOmen, changeHealth, changeSanity, closeGate, delay, discardCard, discardImprovement, discardMonster, gainCard, gainClue, improveSkill, moveInvestigator, moveMonster, moveMonsterToward, placeToken, removeToken, spendClue } from "./effects";
import { finishEncounter } from "./encounter";
import { resolveMythos } from "./mythos";
import { setupGame } from "./setup";
import { note } from "./spawn";
import type { GameState, InvestigatorState, MonsterOnBoard } from "./types";

const root = join(import.meta.dirname, "../..");
const board: Board = JSON.parse(readFileSync(join(root, "content/board/board.json"), "utf8"));
const set = loadSet(join(root, "content/sets/eh01"))!;
const content = { board, set };
const leo = "eh01/investigator/leo-anderson";
const lily = "eh01/investigator/lily-chen";
/** Leo Anderson leads on Buenos Aires, Lily Chen second on Shanghai; Azathoth at doom 15, no monster on either space for seed 3. */
const game = () => setupGame(content, { ancientOne: "eh01/ancient-one/azathoth", investigators: [leo, lily], seed: 3 });
const who = (s: GameState, id: string) => s.investigators.find((i) => i.id === id)!;
const patch = (s: GameState, id: string, fields: Partial<InvestigatorState>): GameState => ({ ...s, investigators: s.investigators.map((i) => (i.id === id ? { ...i, ...fields } : i)) });
/** The Encounter phase of round 1 with Leo Anderson encountering. */
const encounters = () => endTurn(endTurn(game()));
const log = (s: GameState) => (s.phase.name === "encounter" || s.phase.name === "mythos" ? (s.phase.log ?? []).join("\n") : "");
const cardName = (id: string) => set.cards.find((c) => c.id === id)?.name;
const byakhee = { id: "eh01/monster/byakhee", instance: 0 };
const cthulhu = { id: "eh01/monster/cthulhu", instance: 0 };
/** The Encounter phase with one monster standing on `space`, taken out of the cup. */
const withMonster = (monster: { id: string; instance: number }, space: string): GameState => {
  const s = encounters();
  const token: MonsterOnBoard = { ...monster, space, health: 0 };
  return { ...s, monsters: [...s.monsters, token], monsterCup: s.monsterCup.filter((m) => m.id !== monster.id) };
};
const on = (s: GameState, id: string) => s.monsters.filter((m) => m.id === id).map((m) => m.space);

describe("card text is applied in the Encounter and Mythos phases", () => {
  it("logs in the Encounter phase", () => {
    expect(log(note(encounters(), "a line"))).toBe("a line");
  });
  it("logs the effect in rule words", () => {
    expect(log(gainClue(encounters(), content, leo))).toMatch(/Leo Anderson gains 1 clue/);
  });
  it("is refused in the Action phase", () => {
    expect(() => changeHealth(game(), content, leo, -1)).toThrow(/Encounter and Mythos/);
  });
  it("waits for the mythos card to be resolved", () => {
    const mythos = finishEncounter(finishEncounter(encounters(), content), content);
    expect(() => spendClue(mythos, content, leo)).toThrow(/resolved/);
    const s = changeSanity(resolveMythos(mythos, content), content, leo, -1);
    expect(who(s, leo).sanity).toBe(5);
    expect(log(s)).toMatch(/loses 1 sanity/);
  });
  it("is refused on a defeated investigator", () => {
    expect(() => changeHealth(patch(encounters(), leo, { defeated: "health" }), content, leo, 1)).toThrow(/defeated/);
  });
});

describe("health and sanity change by card text", () => {
  it("gains up to the sheet maximum", () => {
    expect(who(changeHealth(patch(encounters(), leo, { health: 5 }), content, leo, 2), leo).health).toBe(6);
  });
  it("defeats at 0 in the Mythos phase too", () => {
    const mythos = resolveMythos(finishEncounter(finishEncounter(encounters(), content), content), content);
    const s = changeHealth(patch(mythos, leo, { health: 1 }), content, leo, -1);
    expect(who(s, leo).defeated).toBe("health");
    expect(log(s)).toMatch(/Leo Anderson is defeated and lies on Buenos Aires/);
  });
  it("defeats at 0", () => {
    const s = changeSanity(patch(encounters(), lily, { sanity: 2 }), content, lily, -2);
    expect(who(s, lily).defeated).toBe("sanity");
    expect(s.doom).toBe(14);
  });
});

describe("clues are gained and spent", () => {
  it("takes the token on the space first", () => {
    const s = gainClue({ ...encounters(), clues: ["shanghai"] }, content, lily);
    expect(who(s, lily).clues).toBe(1);
    expect(s.clues).not.toContain("shanghai");
    expect(log(s)).toMatch(/Shanghai/);
  });
  it("takes the top of the pool otherwise", () => {
    const before = encounters();
    const s = gainClue(before, content, leo);
    expect(who(s, leo).clues).toBe(1);
    expect(s.cluePool).toEqual(before.cluePool.slice(1));
  });
  it("reshuffles the discard into an empty pool", () => {
    const s = gainClue({ ...encounters(), cluePool: [], clueDiscard: ["rome", "london"] }, content, leo);
    expect(s.cluePool).toHaveLength(1);
    expect(s.clueDiscard).toEqual([]);
  });
  it("is refused with no clue anywhere", () => {
    expect(() => gainClue({ ...encounters(), cluePool: [], clueDiscard: [] }, content, leo)).toThrow(/no clue can be gained/);
  });
  it("spends one and refuses with none", () => {
    expect(who(spendClue(patch(encounters(), leo, { clues: 1 }), content, leo), leo).clues).toBe(0);
    expect(() => spendClue(encounters(), content, leo)).toThrow(/holds no clue/);
  });
});

describe("card text delays an investigator", () => {
  it("marks the investigator delayed and logs it", () => {
    const s = delay(encounters(), content, leo);
    expect(who(s, leo).delayed).toBe(true);
    expect(log(s)).toMatch(/Leo Anderson is delayed/);
  });
  it("refuses an already delayed investigator", () => {
    expect(() => delay(delay(encounters(), content, leo), content, leo)).toThrow(/already delayed/);
  });
});

describe("a skill is improved by card text", () => {
  it("improves to +1 and logs it", () => {
    const s = improveSkill(encounters(), content, leo, "lore");
    expect(who(s, leo).improvements).toEqual({ lore: 1 });
    expect(log(s)).toMatch(/Leo Anderson improves Lore to \+1/);
  });
  it("flips to +2", () => {
    expect(who(improveSkill(patch(encounters(), leo, { improvements: { lore: 1 } }), content, leo, "lore"), leo).improvements).toEqual({ lore: 2 });
  });
  it("refuses a third improvement", () => {
    expect(() => improveSkill(patch(encounters(), leo, { improvements: { lore: 2 } }), content, leo, "lore")).toThrow(/at most twice/);
  });
  it("discards one step", () => {
    const s = discardImprovement(patch(encounters(), leo, { improvements: { lore: 2 } }), content, leo, "lore");
    expect(who(s, leo).improvements).toEqual({ lore: 1 });
    expect(who(discardImprovement(s, content, leo, "lore"), leo).improvements).toEqual({});
  });
  it("refuses to discard what is not there", () => {
    expect(() => discardImprovement(encounters(), content, leo, "lore")).toThrow(/Lore is not improved/);
  });
});

describe("an investigator is moved by card text", () => {
  it("refuses a Detained investigator", () => {
    expect(() => moveInvestigator(patch(encounters(), leo, { conditions: ["eh01/condition/detained-1"] }), content, leo, "arkham")).toThrow(/Detained investigator cannot move/);
  });
  it("moves to the named space", () => {
    const s = moveInvestigator(encounters(), content, leo, "arkham");
    expect(who(s, leo).space).toBe("arkham");
    expect(log(s)).toMatch(/Leo Anderson moves to Arkham/);
  });
  it("refuses an unknown space, naming it", () => {
    expect(() => moveInvestigator(encounters(), content, leo, "nope")).toThrow(/nope/);
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

describe("cards are gained and discarded", () => {
  it("draws a random spell from the bottom", () => {
    const before = encounters();
    const s = gainCard(before, content, leo, "spell");
    expect(who(s, leo).possessions).toContain(before.decks.spell.at(-1));
    expect(s.decks.spell).toEqual(before.decks.spell.slice(0, -1));
  });
  it("draws a random asset from the top", () => {
    const before = encounters();
    expect(who(gainCard(before, content, leo, "asset"), leo).possessions).toContain(before.decks.asset[0]);
  });
  it("gains a condition by name, held apart", () => {
    const before = encounters();
    const s = gainCard(before, content, lily, "condition", "Cursed");
    expect(who(s, lily).conditions.map(cardName)).toEqual(["Cursed"]);
    expect(who(s, lily).possessions).toEqual(who(before, lily).possessions);
    expect(s.decks.condition.filter((c) => cardName(c) === "Cursed")).toHaveLength(2);
  });
  it("refuses a duplicate spell or condition", () => {
    const cursed = gainCard(encounters(), content, lily, "condition", "Cursed");
    expect(() => gainCard(cursed, content, lily, "condition", "Cursed")).toThrow(/already has Cursed/);
  });
  it("rebuilds an empty artifact deck from its discard", () => {
    const before = encounters();
    const relic = before.decks.artifact[0]!;
    const s = gainCard({ ...before, decks: { ...before.decks, artifact: [] }, artifactDiscard: [relic] }, content, leo, "artifact");
    expect(who(s, leo).possessions).toContain(relic);
    expect(s.artifactDiscard).toEqual([]);
  });
  it("refuses an empty deck or an absent name", () => {
    expect(() => gainCard({ ...encounters(), decks: { ...encounters().decks, artifact: [] } }, content, leo, "artifact")).toThrow(/artifact deck is empty/);
    expect(() => gainCard(encounters(), content, leo, "condition", "Nope")).toThrow(/no Nope in the condition deck/);
  });
  it("shuffles a discarded spell back into its deck", () => {
    const before = encounters();
    const spell = before.decks.spell.at(-1)!;
    const s = discardCard(gainCard(before, content, leo, "spell"), content, leo, spell);
    expect(who(s, leo).possessions).not.toContain(spell);
    expect(s.decks.spell).toHaveLength(before.decks.spell.length);
    expect(s.decks.spell).toContain(spell);
  });
  it("discards an asset and an artifact to their piles", () => {
    const before = encounters();
    const asset = before.decks.asset[0]!;
    const artifact = before.decks.artifact[0]!;
    const s = discardCard(discardCard(gainCard(gainCard(before, content, leo, "asset"), content, leo, "artifact"), content, leo, asset), content, leo, artifact);
    expect(s.assetDiscard[0]).toBe(asset);
    expect(s.artifactDiscard[0]).toBe(artifact);
  });
  it("discards a held condition", () => {
    const cursed = gainCard(encounters(), content, lily, "condition", "Cursed");
    const s = discardCard(cursed, content, lily, who(cursed, lily).conditions[0]!);
    expect(who(s, lily).conditions).toEqual([]);
  });
  it("refuses a card not held", () => {
    expect(() => discardCard(encounters(), content, leo, "eh01/asset/nope")).toThrow(/does not hold/);
  });
});

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
  it("stays when already with an investigator", () => {
    const before = patch(withMonster(byakhee, "london"), leo, { space: "london" });
    const s = moveMonsterToward(before, content, byakhee);
    expect(s.monsters).toEqual(before.monsters);
    expect(log(s)).toMatch(/the Byakhee is already with Leo Anderson/);
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
    const s = discardMonster(withMonster(byakhee, "london"), content, byakhee);
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
