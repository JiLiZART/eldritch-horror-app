import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board } from "../content/types";
import { setupGame } from "../engine/setup";
import { type Piece, piecesOnSpace } from "./pieces";

const root = join(import.meta.dirname, "../..");
const board: Board = JSON.parse(readFileSync(join(root, "content/board/board.json"), "utf8"));
const set = loadSet(join(root, "content/sets/eh01"))!;
const inv = (name: string) => `eh01/investigator/${name}`;
const state = setupGame(
  { board, set },
  { ancientOne: "eh01/ancient-one/cthulhu", investigators: [inv("akachi-onyele"), inv("charlie-kane"), inv("leo-anderson"), inv("lily-chen")], seed: 7 },
);
const ORDER = ["gate", "expedition", "clue", "rumor", "eldritch", "monster", "pawn", "lead"];

describe("piecesOnSpace", () => {
  const pieces = piecesOnSpace(state, set);
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
    expect(pieces.get(space!)?.[0]).toEqual({ kind: "gate", id: `gate:${space}`, image: `cards/eh01/tokens/gates/${space}.webp`, label: "Gate" });
    expect(ofKind("clue")[0]?.image).toBe("cards/eh01/tokens/clues/clues-back.webp");
    expect(pieces.get(state.activeExpedition)?.some((p) => p.kind === "expedition" && p.image === "cards/eh01/tokens/active-expedition-token.webp")).toBe(true);
  });
  it("marks a wounded monster's health lost and leaves an unhurt one unmarked", () => {
    const [m] = state.monsters;
    const wounded = piecesOnSpace({ ...state, monsters: [{ ...m!, health: 2 }] }, set);
    const [piece] = [...wounded.values()].flat().filter((p) => p.kind === "monster");
    expect(piece?.damage).toBe(2);
    expect(ofKind("monster")[0]?.damage).toBeUndefined();
  });
  it("names monsters and investigators after their content entries", () => {
    const [m] = state.monsters;
    const monster = set.monsters.find((x) => x.id === m!.id)!;
    expect(pieces.get(m!.space)).toContainEqual({ kind: "monster", id: `${m!.id}#${m!.instance}`, image: monster.images.front, label: monster.name });
    const akachi = set.investigators.find((i) => i.id === inv("akachi-onyele"))!;
    expect(pieces.get("space-15")).toContainEqual({ kind: "pawn", id: akachi.id, image: akachi.pawn, label: akachi.name });
  });
  it("lays a delayed or defeated pawn on its side", () => {
    const leo = inv("leo-anderson");
    const pawn = (s: typeof state) => [...piecesOnSpace(s, set).values()].flat().find((p) => p.kind === "pawn" && p.id === leo)!;
    expect(pawn(state).lying).toBeUndefined();
    expect(pawn({ ...state, investigators: state.investigators.map((i) => (i.id === leo ? { ...i, delayed: true as const } : i)) }).lying).toBe(true);
    expect(pawn({ ...state, investigators: state.investigators.map((i) => (i.id === leo ? { ...i, defeated: "sanity" as const } : i)) }).lying).toBe(true);
  });
  it("stands the lead token beside the lead's pawn and moves it with the lead", () => {
    const lead = (s: typeof state) => [...piecesOnSpace(s, set).entries()].find(([, ps]) => ps.some((p) => p.kind === "lead"))?.[0];
    expect(lead(state)).toBe(state.investigators[0]!.space);
    expect(piecesOnSpace(state, set).get(state.investigators[0]!.space)?.at(-1)).toEqual({ kind: "lead", id: "lead", image: "cards/eh01/tokens/lead-investigator.webp", label: "Lead investigator" });
    const lily = inv("lily-chen");
    expect(lead({ ...state, leadInvestigator: lily })).toBe(state.investigators.find((i) => i.id === lily)!.space);
  });
  it("draws no pawn for a devoured investigator", () => {
    const devoured = { ...state, investigators: state.investigators.map((i) => (i.id === inv("leo-anderson") ? { ...i, defeated: "devoured" as const } : i)) };
    const all = [...piecesOnSpace(devoured, set).values()].flat();
    expect(all.filter((p) => p.kind === "pawn")).toHaveLength(3);
  });
  it("draws no pawn for a removed investigator", () => {
    const removed = { ...state, investigators: state.investigators.map((i) => (i.id === inv("leo-anderson") ? { ...i, defeated: "health" as const, removed: true as const } : i)) };
    expect([...piecesOnSpace(removed, set).values()].flat().filter((p) => p.kind === "pawn")).toHaveLength(3);
  });
  it("shows a rumor token and each eldritch token on the space", () => {
    const london = piecesOnSpace({ ...state, rumors: ["london"], eldritch: { london: 2 } }, set).get("london") ?? [];
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
    expect(piecesOnSpace(undefined, set).size).toBe(0);
  });
});
