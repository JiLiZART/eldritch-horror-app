import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board } from "../content/types";
import { endTurn } from "../engine/actions";
import { setupGame } from "../engine/setup";
import { translate } from "./lang";
import { type Piece, piecesOnSpace } from "./pieces";

const root = join(import.meta.dirname, "../..");
const board: Board = JSON.parse(readFileSync(join(root, "content/board/board.json"), "utf8"));
const set = loadSet(join(root, "content/sets/eh01"))!;
const strings = (lang: string) => JSON.parse(readFileSync(join(root, `content/panel/i18n/${lang}.json`), "utf8")) as Record<string, string>;
const en = strings("en");
/** The panel's English translator, as the app binds it. */
const t = (key: string, vars?: Record<string, string | number>) => translate(en, key, vars);
const inv = (name: string) => `eh01/investigator/${name}`;
const state = setupGame(
  { board, set },
  { ancientOne: "eh01/ancient-one/cthulhu", investigators: [inv("akachi-onyele"), inv("charlie-kane"), inv("leo-anderson"), inv("lily-chen")], seed: 7 },
);
const ORDER = ["gate", "expedition", "clue", "rumor", "eldritch", "monster", "pawn", "lead"];

describe("piecesOnSpace", () => {
  const pieces = piecesOnSpace(state, board, set, t);
  const all = [...pieces.values()].flat();
  const ofKind = (kind: Piece["kind"]) => all.filter((p) => p.kind === kind);

  it("groups one gate, its monster, two clues, the expedition token and four pawns", () => {
    expect(ofKind("gate")).toHaveLength(1);
    expect(ofKind("monster")).toHaveLength(1);
    expect(ofKind("clue")).toHaveLength(2);
    expect(ofKind("expedition")).toHaveLength(1);
    expect(ofKind("pawn")).toHaveLength(4);
    expect(all).toHaveLength(10);
  });
  it("uses the gate token of the city and the clue back", () => {
    const [space] = state.gates;
    expect(pieces.get(space!)?.[0]).toEqual(expect.objectContaining({ kind: "gate", id: `gate:${space}`, image: `cards/eh01/tokens/gates/${space}.webp`, label: "Gate" }));
    expect(ofKind("clue")[0]?.image).toBe("cards/eh01/tokens/clues/clues-back.webp");
    expect(pieces.get(state.activeExpedition)?.some((p) => p.kind === "expedition" && p.image === "cards/eh01/tokens/active-expedition-token.webp")).toBe(true);
  });
  it("labels the pieces in the panel's language", () => {
    const ru = strings("ru");
    const labels = [...piecesOnSpace(state, board, set, (key, vars) => translate(ru, key, vars)).values()].flat().map((p) => p.label);
    expect(labels).toContain("Врата");
    expect(labels).toContain("Ведущий сыщик");
  });
  it("hints an investigator's health, sanity and clues", () => {
    const lily = inv("lily-chen");
    const s = { ...state, investigators: state.investigators.map((i) => (i.id === lily ? { ...i, health: 4, sanity: 6, clues: 1 } : i)) };
    const pawn = [...piecesOnSpace(s, board, set, t).values()].flat().find((p) => p.kind === "pawn" && p.id === lily);
    expect(pawn?.hint).toBe("4 health, 6 sanity, 1 clues");
  });
  it("hints a gate's colour and whether it matches the omen", () => {
    const hint = (omen: number) => [...piecesOnSpace({ ...state, gates: ["london"], omen }, board, set, t).values()].flat().find((p) => p.kind === "gate")?.hint;
    expect(hint(0)).toBe("blue gate");
    expect(hint(1)).toBe("blue gate, matches the omen");
  });
  it("hints a monster's combat numbers, the cultist's from the Ancient One sheet", () => {
    const [m] = state.monsters;
    const byakhee = { id: "eh01/monster/byakhee", instance: 0, space: "london", health: 0 };
    const cultist = { id: "eh01/monster/cultist", instance: 0, space: "rome", health: 0 };
    const hinted = piecesOnSpace({ ...state, monsters: [byakhee, cultist] }, board, set, t);
    const hint = (space: string) => hinted.get(space)?.find((p) => p.kind === "monster")?.hint;
    expect(hint("london")).toBe("Will +0, horror 1 · Strength +0, damage 2 · toughness 2");
    expect(hint("rome")).toBe("Strength +0, damage 1 · toughness 1");
    expect(m).toBeDefined();
  });
  it("marks a wounded monster's health lost and leaves an unhurt one unmarked", () => {
    const [m] = state.monsters;
    const wounded = piecesOnSpace({ ...state, monsters: [{ ...m!, health: 2 }] }, board, set, t);
    const [piece] = [...wounded.values()].flat().filter((p) => p.kind === "monster");
    expect(piece?.damage).toBe(2);
    expect(ofKind("monster")[0]?.damage).toBeUndefined();
  });
  it("names monsters and investigators after their content entries", () => {
    const [m] = state.monsters;
    const monster = set.monsters.find((x) => x.id === m!.id)!;
    expect(pieces.get(m!.space)).toContainEqual(expect.objectContaining({ kind: "monster", id: `${m!.id}#${m!.instance}`, image: monster.images.front, label: monster.name }));
    const akachi = set.investigators.find((i) => i.id === inv("akachi-onyele"))!;
    expect(pieces.get("space-15")).toContainEqual(expect.objectContaining({ kind: "pawn", id: akachi.id, image: akachi.pawn, label: akachi.name }));
  });
  it("lays a delayed or defeated pawn on its side", () => {
    const leo = inv("leo-anderson");
    const pawn = (s: typeof state) => [...piecesOnSpace(s, board, set, t).values()].flat().find((p) => p.kind === "pawn" && p.id === leo)!;
    expect(pawn(state).lying).toBeUndefined();
    expect(pawn({ ...state, investigators: state.investigators.map((i) => (i.id === leo ? { ...i, delayed: true as const } : i)) }).lying).toBe(true);
    expect(pawn({ ...state, investigators: state.investigators.map((i) => (i.id === leo ? { ...i, defeated: "sanity" as const } : i)) }).lying).toBe(true);
  });
  it("rings the pawn whose turn it is and none in the Mythos phase", () => {
    const active = (s: typeof state) => [...piecesOnSpace(s, board, set, t).values()].flat().filter((p) => p.kind === "pawn" && p.active).map((p) => p.id);
    expect(active(state)).toEqual([state.leadInvestigator]);
    const next = endTurn(state);
    expect(next.phase.name === "action" ? next.phase.active : undefined).not.toBe(state.leadInvestigator);
    expect(active(next)).toEqual([next.phase.name === "action" ? next.phase.active : undefined]);
    expect(active({ ...state, phase: { name: "mythos" } as typeof state.phase })).toEqual([]);
  });
  it("stands the lead token beside the lead's pawn and moves it with the lead", () => {
    const lead = (s: typeof state) => [...piecesOnSpace(s, board, set, t).entries()].find(([, ps]) => ps.some((p) => p.kind === "lead"))?.[0];
    expect(lead(state)).toBe(state.investigators[0]!.space);
    expect(piecesOnSpace(state, board, set, t).get(state.investigators[0]!.space)?.at(-1)).toEqual({ kind: "lead", id: "lead", image: "cards/eh01/tokens/lead-investigator.webp", label: "Lead investigator" });
    const lily = inv("lily-chen");
    expect(lead({ ...state, leadInvestigator: lily })).toBe(state.investigators.find((i) => i.id === lily)!.space);
  });
  it("draws no pawn for a devoured investigator", () => {
    const devoured = { ...state, investigators: state.investigators.map((i) => (i.id === inv("leo-anderson") ? { ...i, defeated: "devoured" as const } : i)) };
    const all = [...piecesOnSpace(devoured, board, set, t).values()].flat();
    expect(all.filter((p) => p.kind === "pawn")).toHaveLength(3);
  });
  it("draws no pawn for a removed investigator", () => {
    const removed = { ...state, investigators: state.investigators.map((i) => (i.id === inv("leo-anderson") ? { ...i, defeated: "health" as const, removed: true as const } : i)) };
    expect([...piecesOnSpace(removed, board, set, t).values()].flat().filter((p) => p.kind === "pawn")).toHaveLength(3);
  });
  it("shows a rumor token and each eldritch token on the space", () => {
    const london = piecesOnSpace({ ...state, rumors: ["london"], eldritch: { london: 2 } }, board, set, t).get("london") ?? [];
    expect(london.filter((p) => p.kind === "rumor")).toEqual([{ kind: "rumor", id: "rumor:london#0", image: "cards/eh01/tokens/rumor-token.webp", label: "Rumor" }]);
    expect(london.filter((p) => p.kind === "eldritch").map((p) => p.image)).toEqual(["cards/eh01/tokens/eldritch-token.webp", "cards/eh01/tokens/eldritch-token.webp"]);
    expect(london.filter((p) => p.kind === "eldritch").map((p) => p.label)).toEqual(["Eldritch token", "Eldritch token"]);
  });
  it("orders each space gate, expedition, clue, monsters, pawns", () => {
    for (const list of pieces.values()) {
      const ranks = list.map((p) => ORDER.indexOf(p.kind));
      expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    }
  });
  it("gives an empty map without a game", () => {
    expect(piecesOnSpace(undefined, board, set, t).size).toBe(0);
  });
});
