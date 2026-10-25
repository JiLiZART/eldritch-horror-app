import { describe, expect, it } from "vitest";
import type { Board } from "../content/types";
import { BOARD_WIDTH, boardSize, boardToWorld, spreadOnCircle } from "./geometry";

const board = { source: { file: "x", width: 2000, height: 1000 }, texture: "t", spaces: [], paths: [] } as Board;

describe("boardToWorld", () => {
  it("keeps the source aspect", () => {
    expect(boardSize(board)).toEqual([BOARD_WIDTH, BOARD_WIDTH / 2]);
  });
  it("maps the top-left corner to the top-left of the plane", () => {
    expect(boardToWorld({ x: 0, y: 0 }, board)).toEqual([-BOARD_WIDTH / 2, BOARD_WIDTH / 4]);
  });
  it("maps the bottom-right corner to the bottom-right of the plane", () => {
    expect(boardToWorld({ x: 1, y: 1 }, board)).toEqual([BOARD_WIDTH / 2, -BOARD_WIDTH / 4]);
  });
  it("maps the centre to the origin", () => {
    expect(boardToWorld({ x: 0.5, y: 0.5 }, board)).toEqual([0, 0]);
  });
});

describe("spreadOnCircle", () => {
  it("returns the centre for one item", () => {
    expect(spreadOnCircle(1, 0.3)).toEqual([[0, 0]]);
  });
  it("returns distinct points on the circle for several items", () => {
    const pts = spreadOnCircle(3, 0.3);
    expect(pts).toHaveLength(3);
    for (const [x, y] of pts) expect(Math.hypot(x, y)).toBeCloseTo(0.3);
    expect(new Set(pts.map((p) => p.join())).size).toBe(3);
  });
});
