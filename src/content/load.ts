import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { GameSet } from "./types";

export const readJson = <T>(path: string): T | undefined =>
  existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as T) : undefined;

/** A set directory holds set.json plus one JSON list per concern; a missing list is empty. */
export function loadSet(dir: string): GameSet | undefined {
  const meta = readJson<Pick<GameSet, "id" | "name">>(join(dir, "set.json"));
  if (!meta) return undefined;
  const list = <T>(file: string): T[] => readJson<T[]>(join(dir, file)) ?? [];
  return {
    ...meta,
    investigators: list("investigators.json"),
    ancientOnes: list("ancient-ones.json"),
    cards: list("cards.json"),
    monsters: list("monsters.json"),
    encounterDecks: list("encounters.json"),
    mythos: list("mythos.json"),
    preludes: list("preludes.json"),
  };
}
