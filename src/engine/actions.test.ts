import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board } from "../content/types";
import { endTurn, prepareForTravel, rest, trade, travel } from "./actions";
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

describe("investigators act in seat order", () => {
  it("passes the turn to the next seat with 2 actions left", () => {
    const s = endTurn(rest(game(), set));
    expect(s.phase).toEqual({ name: "action", active: lily, taken: [] });
    expect(s.round).toBe(1);
  });
  it("starts the next round with the lead active after the last seat", () => {
    const s = nextRound(resolveMythos(endTurn(endTurn(game())), { board, set }));
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
    const s = { ...west(), monsters: [{ id: "eh01/monster/cultist", instance: 1, space: "san-francisco" }] };
    expect(who(travel(s, board, ["space-5"]), charlie).space).toBe("space-5");
  });
});

describe("rest recovers health and sanity", () => {
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
    const s = { ...solo(akachi), monsters: [{ id: "eh01/monster/cultist", instance: 1, space: "space-15" }] };
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
