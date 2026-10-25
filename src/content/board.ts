import type { Board } from "./types";

/** Ids joined to `id` by any path. */
export function neighbors(board: Board, id: string): string[] {
  return board.paths.flatMap((p) => (p.from === id ? [p.to] : p.to === id ? [p.from] : []));
}

/** Spaces reachable from `start` through spaces in `active`. */
export function reachable(board: Board, active: Set<string>, start: string): Set<string> {
  const seen = new Set([start]);
  for (const cur of seen) {
    for (const next of neighbors(board, cur)) if (active.has(next)) seen.add(next);
  }
  return seen;
}

/** Number of paths on the shortest route; Infinity when unreachable. */
export function distance(board: Board, from: string, to: string): number {
  const dist = new Map([[from, 0]]);
  for (const [cur, d] of dist) {
    if (cur === to) return d;
    for (const next of neighbors(board, cur)) if (!dist.has(next)) dist.set(next, d + 1);
  }
  return Infinity;
}
