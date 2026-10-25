import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { assembleSet } from "./set-files";
import type { GameSet } from "./types";

export const readJson = <T>(path: string): T | undefined =>
  existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as T) : undefined;

/** A set directory holds set.json plus one JSON list per concern; a missing list is empty. */
export function loadSet(dir: string): GameSet | undefined {
  const meta = readJson<Pick<GameSet, "id" | "name">>(join(dir, "set.json"));
  return meta && assembleSet(meta, (file) => readJson<unknown[]>(join(dir, file)));
}
