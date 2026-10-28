import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board } from "../content/types";
import { acquireAssets, componentAction, endTurn, prepareForTravel, rest, takeAssets, takeBankLoan, trade, travel } from "./actions";
import { rerollDie } from "./test";
import { finishEncounter } from "./encounter";
import { nextRound, resolveMythos } from "./mythos";
import { setupGame } from "./setup";
import type { GameState, InvestigatorState } from "./types";

const root = join(import.meta.dirname, "../..");
const board: Board = JSON.parse(readFileSync(join(root, "content/board/board.json"), "utf8"));
const set = loadSet(join(root, "content/sets/eh01"))!;

const inv = (name: string) => `eh01/investigator/${name}`;
const leo = inv("leo-anderson");
const lily = inv("lily-chen");
const charlie = inv("charlie-kane");
const jacqueline = inv("jacqueline-fine");
const akachi = inv("akachi-onyele");
const norman = inv("norman-withers");
/** A one-seat game led by `id` on that investigator's starting space. */
const solo = (id: string) => setupGame({ board, set }, { ancientOne: "eh01/ancient-one/azathoth", investigators: [id], seed: 3 });
/** Leo Anderson leads, Lily Chen second; Azathoth, no monster on either starting space for seed 3. */
const game = () => setupGame({ board, set }, { ancientOne: "eh01/ancient-one/azathoth", investigators: [leo, lily], seed: 3 });
/** Charlie Kane leads on San Francisco, Jacqueline Fine on space 5. */
const west = () => setupGame({ board, set }, { ancientOne: "eh01/ancient-one/azathoth", investigators: [charlie, jacqueline], seed: 3 });
const who = (s: GameState, id: string) => s.investigators.find((i) => i.id === id)!;
/** Overrides one investigator's fields; tests set up positions and holdings directly. */
const patch = (s: GameState, id: string, fields: Partial<InvestigatorState>): GameState => ({
  ...s,
  investigators: s.investigators.map((i) => (i.id === id ? { ...i, ...fields } : i)),
});

describe("a delayed investigator stands up instead of acting", () => {
  it("refuses every action", () => {
    expect(() => rest(patch(game(), leo, { delayed: true }), set)).toThrow(/delayed investigator cannot perform actions/);
  });
  it("stands up when the turn ends", () => {
    const s = endTurn(patch(game(), leo, { delayed: true }));
    expect(who(s, leo).delayed).toBeUndefined();
    expect(s.phase).toEqual({ name: "action", active: lily, taken: [] });
  });
});

describe("investigators act in seat order", () => {
  it("passes the turn to the next seat with 2 actions left", () => {
    const s = endTurn(rest(game(), set));
    expect(s.phase).toEqual({ name: "action", active: lily, taken: [] });
    expect(s.round).toBe(1);
  });
  it("starts the next round with the lead active after the last seat", () => {
    const s = nextRound(resolveMythos(finishEncounter(finishEncounter(endTurn(endTurn(game())), { board, set }), { board, set }), { board, set }), set);
    expect(s.round).toBe(2);
    expect(s.phase).toEqual({ name: "action", active: leo, taken: [] });
  });
  it("refuses actions outside the Action phase", () => {
    const s = endTurn(endTurn(game()));
    expect(() => rest(s, set)).toThrow(/Action phase/);
  });
  it("refuses the same action twice naming the once-per-phase rule", () => {
    const s = rest(game(), set);
    expect(() => rest(s, set)).toThrow(/once per phase/);
  });
  it("refuses a third action naming the 2-action limit", () => {
    const s = { ...game(), phase: { name: "action" as const, active: leo, taken: ["travel" as const, "prepare-for-travel" as const] } };
    expect(() => rest(s, set)).toThrow(/2 actions/);
    expect(who(s, leo).health).toBe(who(game(), leo).health);
  });
});

describe("a Detained investigator cannot move", () => {
  const jailed = () => patch(west(), charlie, { conditions: ["eh01/condition/detained-1"] });
  it("refuses travel", () => {
    expect(() => travel(jailed(), board, ["space-5"])).toThrow(/Detained investigator cannot move/);
  });
  it("still rests", () => {
    const s = rest(patch(jailed(), charlie, { health: 1 }), set);
    expect(who(s, charlie).health).toBe(2);
  });
});

describe("a component action is performed once per component per round", () => {
  const muscle = () => who(game(), leo).possessions.find((c) => c.startsWith("eh01/asset/hired-muscle"))!;
  it("spends one action and marks the component used", () => {
    const s = componentAction(game(), set, muscle());
    expect(s.phase).toMatchObject({ taken: [`component:${muscle()}`] });
    expect(s.usedComponents).toEqual([muscle()]);
    expect(s.journal.at(-1)).toEqual({ round: 1, phase: "action", who: leo, text: `component:${muscle()}` });
  });
  it("refuses a second use this round, even by another seat", () => {
    const once = componentAction(game(), set, muscle());
    expect(() => componentAction(once, set, muscle())).toThrow(/was used this round/);
    const lilyTurn = endTurn(once);
    expect(() => componentAction(patch(lilyTurn, lily, { space: "buenos-aires" }), set, muscle())).toThrow(/was used this round/);
  });
  it("allows a local action on a same-space possession and the own sheet, refuses out of reach", () => {
    const lilyTurn = endTurn(game());
    expect(componentAction(patch(lilyTurn, lily, { space: "buenos-aires" }), set, muscle()).usedComponents).toEqual([muscle()]);
    expect(() => componentAction(lilyTurn, set, muscle())).toThrow(/not within reach/);
    expect(componentAction(game(), set, leo).usedComponents).toEqual([leo]);
  });
  it("clears the used components at the next round", () => {
    const s = componentAction(game(), set, muscle());
    expect(s.usedComponents).toHaveLength(1);
    expect(game().usedComponents).toEqual([]);
  });
});

describe("travel moves along paths", () => {
  it("moves to an adjacent space and spends Travel for the phase", () => {
    const s = travel(west(), board, ["space-5"]);
    expect(who(s, charlie).space).toBe("space-5");
    expect(s.phase).toMatchObject({ taken: ["travel"] });
  });
  it("goes one space further per matching ticket and spends it", () => {
    const s = travel(patch(west(), charlie, { tickets: ["train"] }), board, ["space-5", "arkham"]);
    expect(who(s, charlie)).toMatchObject({ space: "arkham", tickets: [] });
  });
  it("refuses a first step that is not adjacent", () => {
    expect(() => travel(west(), board, ["arkham"])).toThrow(/not adjacent/);
  });
  it("refuses a second step without a ticket", () => {
    expect(() => travel(west(), board, ["space-5", "arkham"])).toThrow(/ticket/);
  });
  it("refuses a ship ticket on a train path", () => {
    const s = patch(west(), charlie, { tickets: ["ship"] });
    expect(() => travel(s, board, ["space-5", "arkham"])).toThrow(/ship ticket only pays for a ship path/);
  });
  it("refuses an empty route", () => {
    expect(() => travel(west(), board, [])).toThrow();
  });
  it("is not blocked by a monster on the space", () => {
    const s = { ...west(), monsters: [{ id: "eh01/monster/cultist", instance: 1, space: "san-francisco", health: 0 }] };
    expect(who(travel(s, board, ["space-5"]), charlie).space).toBe("space-5");
  });
});

describe("rest recovers health and sanity", () => {
  it("writes the action to the journal, a refusal nothing", () => {
    const s = rest(solo(akachi), set);
    expect(s.journal).toEqual([{ round: 1, phase: "action", who: akachi, text: "rest" }]);
    expect(() => rest(s, set)).toThrow();
    expect(s.journal).toHaveLength(1);
  });
  it("gives Akachi Onyele at 4/6 one health and one sanity", () => {
    const s = rest(patch(solo(akachi), akachi, { health: 4, sanity: 6 }), set);
    expect(who(s, akachi)).toMatchObject({ health: 5, sanity: 7 });
  });
  it("never exceeds the sheet maximums and still spends Rest", () => {
    const s = rest(solo(akachi), set);
    expect(who(s, akachi)).toMatchObject({ health: 5, sanity: 7 });
    expect(s.phase).toMatchObject({ taken: ["rest"] });
  });
  it("is refused on a space with a monster", () => {
    const s = { ...solo(akachi), monsters: [{ id: "eh01/monster/cultist", instance: 1, space: "space-15", health: 0 }] };
    expect(() => rest(s, set)).toThrow(/monster/);
  });
});

describe("prepare for travel gains a ticket", () => {
  it("gives Norman Withers on Arkham a train ticket", () => {
    expect(who(prepareForTravel(solo(norman), board, "train"), norman).tickets).toEqual(["train"]);
  });
  it("is refused off a city", () => {
    const s = patch(solo(jacqueline), jacqueline, { space: "tunguska" });
    expect(() => prepareForTravel(s, board, "train")).toThrow(/city spaces only/);
  });
  it("is refused when no path of that type leaves the city", () => {
    const s = patch(solo(norman), norman, { space: "istanbul" });
    expect(() => prepareForTravel(s, board, "ship")).toThrow(/no ship path/);
  });
  it("replaces the named ticket when holding 2", () => {
    const s = patch(solo(norman), norman, { tickets: ["train", "train"] });
    expect(who(prepareForTravel(s, board, "ship", "train"), norman).tickets).toEqual(["train", "ship"]);
  });
  it("needs a ticket named to give up when holding 2", () => {
    const s = patch(solo(norman), norman, { tickets: ["train", "train"] });
    expect(() => prepareForTravel(s, board, "ship")).toThrow(/2 tickets/);
    expect(() => prepareForTravel(s, board, "ship", "ship")).toThrow(/no ship ticket/);
  });
});

describe("trade exchanges possessions on a shared space", () => {
  const assistant = "eh01/asset/personal-assistant";
  /** Jacqueline Fine joins Charlie Kane on San Francisco with 1 clue. */
  const together = () => patch(west(), jacqueline, { space: "san-francisco", clues: 1 });
  it("swaps a card for a clue in one action", () => {
    const s = trade(together(), { partner: jacqueline, give: { possessions: [assistant] }, receive: { clues: 1 } });
    expect(who(s, jacqueline).possessions).toContain(assistant);
    expect(who(s, jacqueline).clues).toBe(0);
    expect(who(s, charlie).possessions).not.toContain(assistant);
    expect(who(s, charlie).clues).toBe(1);
    expect(s.phase).toMatchObject({ taken: ["trade"] });
  });
  it("is refused with a partner on another space", () => {
    expect(() => trade(west(), { partner: jacqueline, give: {}, receive: {} })).toThrow(/same space/);
  });
  it("is refused when the giver lacks the card, naming it", () => {
    expect(() => trade(together(), { partner: jacqueline, give: { possessions: ["eh01/asset/nope"] }, receive: {} })).toThrow(/nope/);
  });
  it("is refused when a condition is given", () => {
    const s = patch(together(), charlie, { conditions: ["eh01/condition/cursed-1"] });
    expect(() => trade(s, { partner: jacqueline, give: { possessions: ["eh01/condition/cursed-1"] }, receive: {} })).toThrow(/not possessions/);
  });
  it("is refused when more clues are asked than held", () => {
    expect(() => trade(together(), { partner: jacqueline, give: {}, receive: { clues: 2 } })).toThrow(/clue/);
  });
  it("moves tickets both ways", () => {
    const s = patch(patch(together(), charlie, { tickets: ["train"] }), jacqueline, { tickets: ["ship"] });
    const t = trade(s, { partner: jacqueline, give: { tickets: ["train"] }, receive: { tickets: ["ship"] } });
    expect(who(t, charlie).tickets).toEqual(["ship"]);
    expect(who(t, jacqueline).tickets).toEqual(["train"]);
  });
});

describe("Acquire Assets", () => {
  const asset = (name: string) => `eh01/asset/${name}`;
  const [revolver, automatic, tome, bandages] = ["38-revolver", "45-automatic", "arcane-tome", "bandages"].map(asset) as [string, string, string, string];
  /** Charlie Kane on San Francisco, no monster, a reserve of known values: 1, 2, 3, 1. */
  const shop = (): GameState => ({ ...west(), monsters: [], reserve: [revolver, automatic, tome, bandages] });
  /** The Influence test already rolled with `successes`. */
  const rolled = (successes: number, s = shop()): GameState => ({
    ...s,
    phase: { name: "action", active: charlie, taken: [], acquiring: { investigator: charlie, dice: Array(successes).fill(5), successes } },
  });

  it("tests Influence and waits for the choice", () => {
    const s = acquireAssets(shop(), board, set);
    expect(s.phase).toMatchObject({ taken: [] });
    const { acquiring } = s.phase as { acquiring: { dice: number[]; successes: number } };
    expect(acquiring.dice).toHaveLength(4);
    expect(acquiring.successes).toBe(acquiring.dice.filter((d) => d >= 5).length);
    expect(s.rolls).toBe(shop().rolls + 1);
    expect(s.reserve).toEqual(shop().reserve);
  });
  it("takes the Bank Loan: 2 more successes for a Debt condition", () => {
    const s = takeBankLoan(rolled(1), set);
    expect(who(s, charlie).conditions.map((c) => set.cards.find((x) => x.id === c)?.name)).toEqual(["Debt"]);
    expect(who(takeAssets(s, set, [tome]), charlie).possessions).toContain(tome);
    expect(() => takeAssets(s, set, [tome, revolver])).toThrow(/total value 4.*result 3/);
  });
  it("refuses the loan with Debt held or taken twice", () => {
    const debt = set.cards.find((c) => c.name === "Debt")!.id;
    expect(() => takeBankLoan(patch(rolled(1), charlie, { conditions: [debt] }), set)).toThrow(/already has Debt/);
    expect(() => takeBankLoan(takeBankLoan(rolled(1), set), set)).toThrow(/already taken/);
  });
  it("keeps the loan through a reroll", () => {
    const s = rerollDie(patch(takeBankLoan(rolled(1), set), charlie, { clues: 1 }), set, 0);
    const result = s.phase.name === "action" ? s.phase.acquiring!.successes : -1;
    expect(() => takeAssets(s, set, [tome, revolver, automatic])).toThrow(new RegExp(`result ${result + 2}`));
  });
  it("measures the cards against the rerolled result", () => {
    for (let seed = 0; seed < 50; seed++) {
      const s = rerollDie(patch({ ...rolled(3), seed }, charlie, { clues: 1 }), set, 0);
      if (s.phase.name === "action" && s.phase.acquiring!.successes === 2) {
        expect(() => takeAssets(s, set, [tome])).toThrow(/total value 3.*result 2/);
        return;
      }
    }
    throw new Error("no seed rerolled below 5");
  });
  it("gains cards within the result and refills the reserve", () => {
    const s = takeAssets(rolled(3), set, [revolver, automatic]);
    expect(who(s, charlie).possessions).toEqual(expect.arrayContaining([revolver, automatic]));
    expect(s.reserve).toHaveLength(4);
    expect(s.reserve).toEqual(expect.arrayContaining([tome, bandages]));
    expect(s.decks.asset).toHaveLength(shop().decks.asset.length - 2);
    expect(s.phase).toEqual({ name: "action", active: charlie, taken: ["acquire-assets"] });
  });
  it("refuses cards worth more than the result and keeps the reserve", () => {
    const s = rolled(2);
    expect(() => takeAssets(s, set, [tome])).toThrow(/total value 3.*result 2/);
    expect(s.reserve).toEqual(shop().reserve);
  });
  it("discards 1 reserve card when nothing is gained", () => {
    const s = takeAssets(rolled(0), set, [], tome);
    expect(s.assetDiscard).toEqual([tome]);
    expect(s.reserve).toHaveLength(4);
    expect(s.reserve).not.toContain(tome);
    expect(s.phase).toMatchObject({ taken: ["acquire-assets"] });
  });
  it("refuses a discard alongside a gain", () => {
    expect(() => takeAssets(rolled(3), set, [revolver], tome)).toThrow(/only when no card is gained/);
  });
  it("refuses a card that is not in the reserve", () => {
    expect(() => takeAssets(rolled(3), set, [asset("axe")])).toThrow(/not in the reserve/);
  });
  it("refuses a space that is not a city", () => {
    expect(() => acquireAssets(patch(shop(), charlie, { space: "space-2" }), board, set)).toThrow(/city/);
  });
  it("refuses a space with a monster, naming it", () => {
    const s = { ...shop(), monsters: [{ id: "eh01/monster/cultist", instance: 1, space: "san-francisco", health: 0 }] };
    expect(() => acquireAssets(s, board, set)).toThrow(/eh01\/monster\/cultist/);
  });
  it("refuses ending the turn or another action before the choice", () => {
    expect(() => endTurn(rolled(1))).toThrow(/finish Acquire Assets first/);
    expect(() => rest(rolled(1), set)).toThrow(/finish Acquire Assets first/);
  });
  it("shuffles the asset discard into an empty deck to refill", () => {
    const base = rolled(1);
    const s = takeAssets({ ...base, decks: { ...base.decks, asset: [] }, assetDiscard: [asset("axe"), asset("whiskey")] }, set, [revolver]);
    expect(s.reserve).toHaveLength(4);
    expect(s.assetDiscard).toEqual([]);
    expect(s.decks.asset).toHaveLength(1);
  });
});
