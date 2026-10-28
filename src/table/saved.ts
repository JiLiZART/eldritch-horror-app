import type { GameState } from "../engine/types";

/** The one saved game per browser (design D1); the engine never touches storage. */

export type Slot = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const KEY = "eldritch-horror.game";

/** The saved game, or undefined when the slot is empty or unreadable. */
export function loadGame(storage: Slot): GameState | undefined {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(KEY) ?? "null");
    return parsed !== null && typeof parsed === "object" && "phase" in parsed ? (parsed as GameState) : undefined;
  } catch {
    return undefined;
  }
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
