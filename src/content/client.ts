import type { Board, Investigator } from "./types";

export interface Content {
  board: Board;
  investigators: Investigator[];
}

const json = async <T>(path: string): Promise<T> => {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json() as Promise<T>;
};

/** Static content served next to the app; fetched once per page load. */
export const content: Promise<Content> = Promise.all([
  json<Board>("/content/board/board.json"),
  json<Investigator[]>("/content/sets/eh01/investigators.json"),
]).then(([board, investigators]) => ({ board, investigators }));
