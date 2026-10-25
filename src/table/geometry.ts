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
