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

/** The storage key of the slot index; other windows watch it to follow the list (window-sync-slots D1). */
export const INDEX_KEY = "eldritch-horror.games";
const INDEX = INDEX_KEY;
/** The single-slot key from before slots existed; migrated into a slot on first load. */
const LEGACY = "eldritch-horror.game";
/** The storage key of a slot's game; other windows watch it to follow the game (window-sync D1). */
export const gameKey = (id: string) => `eldritch-horror.game.${id}`;
const key = gameKey;
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
  // The history goes first: another window following the game key must find the history already there (window-sync D1).
  write(storage, historyKey(id), JSON.stringify(history.slice(-HISTORY)));
  write(storage, key(id), JSON.stringify(state));
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

/** Copies a slot's game, history and name into a new current slot, for branching a line of play; returns the new id (slot-duplicate D1). */
export function duplicateGame(storage: Slot, id: string): string {
  const { state, history } = loadGame(storage, id);
  const info = loadSlots(storage).slots.find((s) => s.id === id);
  const copy = newSlotId();
  if (state) saveGame(storage, copy, state, info?.name ?? "", history ?? []);
  if (info?.title) renameGame(storage, copy, `${info.title} (copy)`);
  return copy;
}

/** Every slot with its name, history and time as one JSON document, for a backup (backup-all D1). */
export function exportAll(storage: Slot): string {
  const slots = loadSlots(storage).slots.flatMap((info) => {
    const { state, history } = loadGame(storage, info.id);
    return state ? [{ name: info.name, ...(info.title ? { title: info.title } : {}), savedAt: info.savedAt, state, history: history ?? [] }] : [];
  });
  return JSON.stringify({ backup: 1, slots });
}

/** Adds a backup's slots beside the ones present under fresh ids; a state of another shape is skipped; a file that is not a backup is refused. */
export function importAll(storage: Slot, text: string): { added: number; skipped: number } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("the file is not a backup");
  }
  const backup = parsed as { backup?: number; slots?: unknown[] };
  if (!backup || backup.backup !== 1 || !Array.isArray(backup.slots)) throw new Error("the file is not a backup");
  let added = 0;
  let skipped = 0;
  for (const entry of backup.slots as { name?: string; title?: string; savedAt?: number; state?: unknown; history?: unknown }[]) {
    const { state } = parseGame(JSON.stringify(entry.state ?? null));
    if (!state) {
      skipped++;
      continue;
    }
    const id = newSlotId();
    saveGame(storage, id, state, entry.name ?? "", Array.isArray(entry.history) ? (entry.history as GameState[]) : []);
    if (entry.title) renameGame(storage, id, entry.title);
    if (typeof entry.savedAt === "number") {
      const index = loadSlots(storage);
      write(storage, INDEX, JSON.stringify({ ...index, slots: index.slots.map((s) => (s.id === id ? { ...s, savedAt: entry.savedAt as number } : s)) }));
    }
    added++;
  }
  return { added, skipped };
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

/** The download name: the slot's own name when the players gave one, with characters a file system refuses turned to dashes; else the seed and the round, so files sort and tell apart (file-name-title D1). */
export function fileName(state: GameState, title?: string): string {
  const safe = title
    ?.replace(/[^\p{L}\p{N} .-]+/gu, "-")
    .replace(/\s+/g, " ")
    .replace(/^[\s.-]+|[\s.-]+$/g, "")
    .trim();
  return safe ? `${safe}.json` : `eldritch-horror-${state.seed}-round-${state.round}.json`;
}
