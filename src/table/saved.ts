import { STATE_VERSION, type GameState } from "../engine/types";

/** Saved games in the browser (design D1): an index of slots and one key per game; the engine never touches storage. */

export type Slot = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export interface SlotInfo {
  id: string;
  name: string;
  /** The players' own name for the slot, shown instead of `name` while set (slot-rename D1). */
  title?: string;
  /** Milliseconds since the epoch of the last saved step. */
  savedAt: number;
}
export interface SlotIndex {
  /** The slot last played, resumed on load. */
  current?: string;
  slots: SlotInfo[];
}

const INDEX = "eldritch-horror.games";
/** The single-slot key from before slots existed; migrated into a slot on first load. */
const LEGACY = "eldritch-horror.game";
const key = (id: string) => `eldritch-horror.game.${id}`;
/** The states before the slot's last accepted steps, newest last (undo-across-reload D1). */
const historyKey = (id: string) => `eldritch-horror.history.${id}`;
const HISTORY = 10;

/** A saved game's text (a slot or a file), or a note saying why it was set aside. */
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

const read = (storage: Slot, k: string): string | null => {
  try {
    return storage.getItem(k);
  } catch {
    return null;
  }
};
const write = (storage: Slot, k: string, value: string): void => {
  try {
    storage.setItem(k, value);
  } catch {}
};
const remove = (storage: Slot, k: string): void => {
  try {
    storage.removeItem(k);
  } catch {}
};

export const newSlotId = () => `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;

/** The slot's name: the Ancient One, the seed and the round. */
export const slotName = (state: GameState, ancientOne: string) => `${ancientOne} · seed ${state.seed} · round ${state.round}`;

/** The slot index, moving a save from before slots existed into its own slot. */
export function loadSlots(storage: Slot): SlotIndex {
  const legacy = read(storage, LEGACY);
  if (legacy !== null) {
    const { state } = parseGame(legacy);
    remove(storage, LEGACY);
    if (state) saveGame(storage, newSlotId(), state, slotName(state, state.ancientOne.split("/").pop() ?? state.ancientOne));
  }
  try {
    const parsed = JSON.parse(read(storage, INDEX) ?? "null") as SlotIndex | null;
    return parsed && Array.isArray(parsed.slots) ? parsed : { slots: [] };
  } catch {
    return { slots: [] };
  }
}

/** The saved game of a slot with its undo history, or a note saying why it was set aside; neither for an empty slot. */
export function loadGame(storage: Slot, id: string): { state?: GameState; history?: GameState[]; note?: string } {
  const raw = read(storage, key(id));
  if (raw === null) return {};
  const { state, note } = parseGame(raw);
  if (!state) return { note };
  let history: GameState[] = [];
  try {
    const parsed = JSON.parse(read(storage, historyKey(id)) ?? "[]") as unknown;
    if (Array.isArray(parsed)) history = parsed as GameState[];
  } catch {}
  return { state, history };
}

/** Saves the game and the last ten states before its steps into its slot and makes it the current one. */
export function saveGame(storage: Slot, id: string, state: GameState, name: string, history: GameState[] = []): void {
  write(storage, key(id), JSON.stringify(state));
  write(storage, historyKey(id), JSON.stringify(history.slice(-HISTORY)));
  const index = loadSlots(storage);
  const title = index.slots.find((s) => s.id === id)?.title;
  const info: SlotInfo = { id, name, savedAt: Date.now(), ...(title ? { title } : {}) };
  write(storage, INDEX, JSON.stringify({ current: id, slots: [...index.slots.filter((s) => s.id !== id), info] }));
}

/** Sets the players' name for a slot; an empty name clears it (slot-rename D1). */
export function renameGame(storage: Slot, id: string, title: string): SlotIndex {
  const index = loadSlots(storage);
  const next: SlotIndex = {
    ...index,
    slots: index.slots.map((s) => {
      if (s.id !== id) return s;
      const { title: _, ...rest } = s;
      return title.trim() ? { ...rest, title: title.trim() } : rest;
    }),
  };
  write(storage, INDEX, JSON.stringify(next));
  return next;
}

/** Removes a slot; a removed current slot leaves none current. */
export function removeGame(storage: Slot, id: string): SlotIndex {
  remove(storage, key(id));
  remove(storage, historyKey(id));
  const index = loadSlots(storage);
  const next: SlotIndex = { ...(index.current === id ? {} : index.current ? { current: index.current } : {}), slots: index.slots.filter((s) => s.id !== id) };
  write(storage, INDEX, JSON.stringify(next));
  return next;
}

/** The download name: the seed and the round, so files sort and tell apart. */
export const fileName = (state: GameState) => `eldritch-horror-${state.seed}-round-${state.round}.json`;
