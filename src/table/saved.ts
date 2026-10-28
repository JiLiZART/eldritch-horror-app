import { STATE_VERSION, type GameState } from "../engine/types";

/** The one saved game per browser (design D1); the engine never touches storage. */

export type Slot = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const KEY = "eldritch-horror.game";

/** A saved game's text (the slot or a file), or a note saying why it was set aside. */
export function parseGame(text: string): { state?: GameState; note?: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { note: "the saved game could not be read" };
  }
  if (parsed === null || typeof parsed !== "object" || !("phase" in parsed)) return { note: "the saved game could not be read" };
  if ((parsed as { version?: number }).version !== STATE_VERSION) return { note: "the saved game was written by an older version and was set aside" };
  return { state: parsed as GameState };
}

/** The saved game, or a note saying why the slot was set aside; neither for an empty slot. */
export function loadGame(storage: Slot): { state?: GameState; note?: string } {
  let raw: string | null = null;
  try {
    raw = storage.getItem(KEY);
  } catch {
    return { note: "the saved game could not be read" };
  }
  return raw === null ? {} : parseGame(raw);
}

/** The download name: the seed and the round, so files sort and tell apart. */
export const fileName = (state: GameState) => `eldritch-horror-${state.seed}-round-${state.round}.json`;

export function saveGame(storage: Slot, state: GameState): void {
  try {
    storage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

export function clearGame(storage: Slot): void {
  try {
    storage.removeItem(KEY);
  } catch {}
}
