import type { GameSet } from "./types";

type Lists = Omit<GameSet, "id" | "name">;

/** JSON list per concern inside a set directory; shared by the Node loader and the browser client. */
export const SET_FILES: Record<keyof Lists, string> = {
  investigators: "investigators.json",
  ancientOnes: "ancient-ones.json",
  cards: "cards.json",
  monsters: "monsters.json",
  encounterDecks: "encounters.json",
  mythos: "mythos.json",
  preludes: "preludes.json",
};

/** Builds a set from set.json and one reader per list file; a missing list is empty. */
export function assembleSet(meta: Pick<GameSet, "id" | "name">, list: (file: string) => unknown[] | undefined): GameSet {
  const lists = Object.fromEntries(Object.entries(SET_FILES).map(([key, file]) => [key, list(file) ?? []]));
  return { ...meta, ...lists } as GameSet;
}
