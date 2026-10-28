import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board } from "../content/types";
import { endTurn } from "./actions";
import { changeDoom, solveFinalMystery, solveMystery } from "./ancientOne";
import { finishEncounter } from "./encounter";
import { OMEN_TRACK } from "./omen";
import { resolveMythos } from "./mythos";
import { setupGame } from "./setup";
import type { GameState } from "./types";

const root = join(import.meta.dirname, "../..");
const board: Board = JSON.parse(readFileSync(join(root, "content/board/board.json"), "utf8"));
const set = loadSet(join(root, "content/sets/eh01"))!;
const content = { board, set };
const leo = "eh01/investigator/leo-anderson";
const lily = "eh01/investigator/lily-chen";
/** Leo Anderson leads, Lily Chen second; Azathoth at doom 15, no monster on either space for seed 3. */
const game = () => setupGame(content, { ancientOne: "eh01/ancient-one/azathoth", investigators: [leo, lily], seed: 3 });
/** The Encounter phase of round 1 with Leo Anderson encountering. */
const encounters = () => endTurn(endTurn(game()));
const log = (s: GameState) => (s.phase.name === "encounter" || s.phase.name === "mythos" ? (s.phase.log ?? []).join("\n") : "");

describe("doom changes by card text", () => {
  it("advances doom and logs it", () => {
    const s = changeDoom(encounters(), content, -1);
    expect(s.doom).toBe(14);
    expect(log(s)).toMatch(/doom 14/);
  });
  it("refuses to retreat past the start of the track", () => {
    expect(() => changeDoom(encounters(), content, 1)).toThrow(/cannot retreat past the start/);
  });
  it("refuses to advance past 0", () => {
    expect(() => changeDoom({ ...encounters(), doom: 0, awakened: true }, content, -1)).toThrow(/cannot advance past 0/);
  });
});

describe("the Ancient One awakens at doom 0", () => {
  it("awakens on the omen", () => {
    const fake = { id: "eh01/mythos/test/omen", name: "Omen", color: "green" as const, difficulty: "easy" as const, trait: "event" as const, effects: ["advance-omen" as const], images: { front: "x.webp" } };
    let s: GameState = { ...game(), doom: 1, omen: OMEN_TRACK.indexOf("blue"), gates: ["arkham"], monsters: [] };
    s = { ...s, decks: { ...s.decks, mythos: [fake.id, ...s.decks.mythos] } };
    while (s.phase.name === "action" || s.phase.name === "encounter") s = s.phase.name === "action" ? endTurn(s) : finishEncounter(s, content);
    const woken = resolveMythos(s, { board, set: { ...set, mythos: [...set.mythos, fake] } });
    expect(woken.doom).toBe(0);
    expect(woken.awakened).toBe(true);
    expect(log(woken)).toMatch(/Azathoth awakens: .* left to the players/);
  });
  it("awakens on card text", () => {
    const s = changeDoom({ ...encounters(), doom: 1 }, content, -1);
    expect(s.awakened).toBe(true);
  });
  it("awakens once", () => {
    const s = changeDoom(changeDoom({ ...encounters(), doom: 0, awakened: true }, content, 1), content, -1);
    expect(s.awakened).toBe(true);
    expect(log(s)).not.toMatch(/awakens/);
  });
});

describe("a mystery is solved by card text", () => {
  it("joins the pile and draws the next", () => {
    const before = encounters();
    const s = solveMystery(before, content);
    expect(s.solvedMysteries).toEqual([before.currentMystery]);
    expect(s.currentMystery).toBe(before.decks.mystery[0]);
    expect(s.decks.mystery).toHaveLength(2);
    expect(log(s)).toMatch(/is solved/);
  });
  it("refuses the final mystery while the Ancient One sleeps", () => {
    expect(() => solveFinalMystery(encounters(), content)).toThrow(/after the awakening/);
  });
});

describe("the investigators win", () => {
  const thrice = (s: GameState) => solveMystery(solveMystery(solveMystery(s, content), content), content);
  it("wins with three mysteries", () => {
    const s = thrice(encounters());
    expect(s.phase).toEqual({ name: "won", reason: expect.stringMatching(/3 mysteries/) });
  });
  it("waits for the final mystery once awakened", () => {
    const s = thrice({ ...encounters(), doom: 0, awakened: true });
    expect(s.phase.name).toBe("encounter");
    const won = solveFinalMystery(s, content);
    expect(won.phase).toEqual({ name: "won", reason: expect.stringMatching(/3 mysteries and the final mystery/) });
  });
});
