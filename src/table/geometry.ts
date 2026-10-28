import type { Board } from "../content/types";

/** Board plane width in world units; height follows the texture aspect. */
export const BOARD_WIDTH = 10;

export function boardSize(board: Board): [width: number, height: number] {
  return [BOARD_WIDTH, (BOARD_WIDTH * board.source.height) / board.source.width];
}

/** Normalized texture coordinates (origin top-left) to plane coordinates (origin centre, y up). */
export function boardToWorld(point: { x: number; y: number }, board: Board): [x: number, y: number] {
  const [w, h] = boardSize(board);
  return [(point.x - 0.5) * w, (0.5 - point.y) * h];
}

/** Offsets for `n` pieces sharing one space: the centre alone, or evenly around a circle. */
export function spreadOnCircle(n: number, radius: number): [x: number, y: number][] {
  if (n === 1) return [[0, 0]];
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [radius * Math.cos(a), radius * Math.sin(a)];
  });
}

/** Where doom `value` lies on the printed track: the first space holds the highest number, the last holds 0 (design D2). */
export function doomPosition(board: Board, value: number): [x: number, y: number] {
  const { from, to, spaces } = board.tracks.doom;
  const n = Math.min(Math.max(value, 0), spaces - 1);
  const f = (spaces - 1 - n) / (spaces - 1);
  return boardToWorld({ x: from.x + (to.x - from.x) * f, y: from.y + (to.y - from.y) * f }, board);
}

/** Where omen space `index` lies on the printed circle: 0 on top, then clockwise (design D2). */
export function omenPosition(board: Board, index: number): [x: number, y: number] {
  const { center, radius } = board.tracks.omen;
  const [cx, cy] = boardToWorld(center, board);
  const r = radius * BOARD_WIDTH;
  const a = Math.PI / 2 - (index * Math.PI) / 2;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
