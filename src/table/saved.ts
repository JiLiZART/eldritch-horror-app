import { STATE_VERSION, type GameState } from "../engine/types";

/** The one saved game per browser (design D1); the engine never touches storage. */

export type Slot = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const KEY = "eldritch-horror.game";

/** The saved game, or a note saying why the slot was set aside; neither for an empty slot. */
export function loadGame(storage: Slot): { state?: GameState; note?: string } {
  let parsed: unknown;
  try {
    const raw = storage.getItem(KEY);
    if (raw === null) return {};
    parsed = JSON.parse(raw);
  } catch {
    return { note: "the saved game could not be read" };
  }
  if (parsed === null || typeof parsed !== "object" || !("phase" in parsed)) return { note: "the saved game could not be read" };
  if ((parsed as { version?: number }).version !== STATE_VERSION) return { note: "the saved game was written by an older version and was set aside" };
  return { state: parsed as GameState };
}

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
