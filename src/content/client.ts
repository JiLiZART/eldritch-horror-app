import { assembleSet, SET_FILES } from "./set-files";
import type { Board, BoardLabels, BoardStrings, GameSet } from "./types";

/** Fetches JSON; a 404 is `undefined` (optional set lists), any other failure throws. */
const json = async <T>(path: string): Promise<T | undefined> => {
  const res = await fetch(path);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json() as Promise<T>;
};

const required = async <T>(path: string): Promise<T> => {
  const data = await json<T>(path);
  if (data === undefined) throw new Error(`${path}: 404`);
  return data;
};

async function fetchSet(id: string): Promise<GameSet> {
  const dir = `/content/sets/${id}`;
  const files = Object.values(SET_FILES);
  const [meta, ...lists] = await Promise.all([required<Pick<GameSet, "id" | "name">>(`${dir}/set.json`), ...files.map((f) => json<unknown[]>(`${dir}/${f}`))]);
  const byFile = new Map(files.map((f, i) => [f, lists[i]]));
  return assembleSet(meta, (file) => byFile.get(file));
}

/** Static content served next to the app; fetched once per page load. */
export const content: Promise<{ board: Board; set: GameSet; labels: BoardLabels; strings: BoardStrings }> = Promise.all([
  required<Board>("/content/board/board.json"),
  fetchSet("eh01"),
  required<BoardLabels>("/content/board/labels.json"),
  required<Record<string, string>>("/content/board/i18n/en.json"),
  required<Record<string, string>>("/content/board/i18n/ru.json"),
]).then(([board, set, labels, en, ru]) => ({ board, set, labels, strings: { en, ru } }));
