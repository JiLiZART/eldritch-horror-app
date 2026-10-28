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

/** The candidate at the smallest distance from `from`, the first on a tie; `from` itself when it is a candidate (EH_reference p.2). */
export function nearest(board: Board, from: string, candidates: string[]): string | undefined {
  return candidates.reduce<string | undefined>((best, id) => (best === undefined || distance(board, from, id) < distance(board, from, best) ? id : best), undefined);
}

/** Spaces of the enabled sets and the paths whose both ends are among them. */
export function activeGraph(board: Board, enabled: Set<string>): Pick<Board, "spaces" | "paths"> {
  const spaces = board.spaces.filter((s) => enabled.has(s.set));
  const ids = new Set(spaces.map((s) => s.id));
  return { spaces, paths: board.paths.filter((p) => ids.has(p.from) && ids.has(p.to)) };
}
