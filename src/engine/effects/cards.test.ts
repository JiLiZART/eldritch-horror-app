import { describe, expect, it } from "vitest";
import { defeat } from "../encounter";
import { discardCard, gainCard, discardOngoing, takePossessions } from "../effects";
import { set, content, leo, lily, who, patch, encounters, log, cardName } from "./fixture";

describe("an ongoing mythos card is discarded by card text", () => {
  it("moves the card to the mythos discard", () => {
    const rumor = set.mythos.find((m) => m.trait === "ongoing")!;
    const s = discardOngoing({ ...encounters(), ongoingMythos: [rumor.id] }, content, rumor.id);
    expect(s.ongoingMythos).toEqual([]);
    expect(s.mythosDiscard[0]).toBe(rumor.id);
    expect(log(s)).toMatch(new RegExp(`${rumor.name} is discarded from play`));
    expect(() => discardOngoing(s, content, rumor.id)).toThrow(/is not in play/);
  });
});

describe("a defeated investigator's possessions are collected", () => {
  it("moves them all once", () => {
    const s = patch(defeat(encounters(), content, leo, "health"), lily, { space: "buenos-aires" });
    const taken = takePossessions(s, content, lily, leo);
    expect(who(taken, lily).possessions.map(cardName)).toContain("Hired Muscle");
    expect(who(taken, leo).possessions).toEqual([]);
    expect(log(taken)).toMatch(/Lily Chen takes Leo Anderson's possessions/);
    expect(() => takePossessions(taken, content, lily, leo)).toThrow(/nothing is left/);
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
