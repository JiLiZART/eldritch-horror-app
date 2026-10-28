/** The content, the seeded game and the helpers the effect tests share (effects-test-split D1). */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadSet } from "../../content/load";
import type { Board } from "../../content/types";
import { endTurn } from "../actions";
import { setupGame } from "../setup";
import type { GameState, InvestigatorState, MonsterOnBoard } from "../types";

const root = join(import.meta.dirname, "../../..");
export const board: Board = JSON.parse(readFileSync(join(root, "content/board/board.json"), "utf8"));
export const set = loadSet(join(root, "content/sets/eh01"))!;
export const content = { board, set };
export const leo = "eh01/investigator/leo-anderson";
export const lily = "eh01/investigator/lily-chen";
/** Leo Anderson leads on Buenos Aires, Lily Chen second on Shanghai; Azathoth at doom 15, no monster on either space for seed 3. */
export const game = () => setupGame(content, { ancientOne: "eh01/ancient-one/azathoth", investigators: [leo, lily], seed: 3 });
export const who = (s: GameState, id: string) => s.investigators.find((i) => i.id === id)!;
export const patch = (s: GameState, id: string, fields: Partial<InvestigatorState>): GameState => ({ ...s, investigators: s.investigators.map((i) => (i.id === id ? { ...i, ...fields } : i)) });
/** The Encounter phase of round 1 with Leo Anderson encountering. */
export const encounters = () => endTurn(endTurn(game()));
export const log = (s: GameState) => (s.phase.name === "encounter" || s.phase.name === "mythos" ? (s.phase.log ?? []).join("\n") : "");
export const cardName = (id: string) => set.cards.find((c) => c.id === id)?.name;
export const encountersLog = (s: GameState) => s;
export const byakhee = { id: "eh01/monster/byakhee", instance: 0 };
export const cthulhu = { id: "eh01/monster/cthulhu", instance: 0 };
/** The Encounter phase with one monster standing on `space`, taken out of the cup. */
export const withMonster = (monster: { id: string; instance: number }, space: string): GameState => {
  const s = encounters();
  const token: MonsterOnBoard = { ...monster, space, health: 0 };
  return { ...s, monsters: [...s.monsters, token], monsterCup: s.monsterCup.filter((m) => m.id !== monster.id) };
};
export const on = (s: GameState, id: string) => s.monsters.filter((m) => m.id === id).map((m) => m.space);

