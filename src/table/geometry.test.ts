import { describe, expect, it } from "vitest";
import type { Board } from "../content/types";
import { BOARD_WIDTH, HELD, SHEET, TABLEAU_ROWS, boardSize, boardToWorld, doomPosition, heldPosition, omenPosition, reservePosition, sheetPosition, spreadOnCircle, tableExtent, tableauPosition } from "./geometry";

const board = { source: { file: "x", width: 2000, height: 1000 }, texture: "t", spaces: [], paths: [], tracks: { doom: { from: { x: 0.1, y: 0.1 }, to: { x: 0.9, y: 0.1 }, spaces: 21 }, omen: { center: { x: 0.9, y: 0.3 }, radius: 0.05 }, reserve: { from: { x: 0.1, y: 0.9 }, to: { x: 0.4, y: 0.9 }, slots: 4, width: 0.05 }, }, } as Board;

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

describe("reserve slots", () => {
  it("puts the first slot at the strip's start and the last at its end", () => {
    expect(reservePosition(board, 0)).toEqual(boardToWorld({ x: 0.1, y: 0.9 }, board));
    expect(reservePosition(board, 3)).toEqual(boardToWorld({ x: 0.4, y: 0.9 }, board));
    expect(reservePosition(board, 1)[0]).toBeCloseTo(boardToWorld({ x: 0.2, y: 0.9 }, board)[0]);
  });
});

describe("track positions", () => {
  it("puts doom 20 at the track's start, 0 at its end and 10 halfway", () => {
    expect(doomPosition(board, 20)).toEqual(boardToWorld({ x: 0.1, y: 0.1 }, board));
    expect(doomPosition(board, 0)).toEqual(boardToWorld({ x: 0.9, y: 0.1 }, board));
    expect(doomPosition(board, 10)[0]).toBeCloseTo(boardToWorld({ x: 0.5, y: 0.1 }, board)[0]);
  });
  it("puts omen 0 above the centre and 1 to its right, at the radius scaled by the width", () => {
    const [cx, cy] = boardToWorld({ x: 0.9, y: 0.3 }, board);
    const r = 0.05 * BOARD_WIDTH;
    expect(omenPosition(board, 0)[0]).toBeCloseTo(cx);
    expect(omenPosition(board, 0)[1]).toBeCloseTo(cy + r);
    expect(omenPosition(board, 1)[0]).toBeCloseTo(cx + r);
    expect(omenPosition(board, 1)[1]).toBeCloseTo(cy);
  });
});

describe("tableau", () => {
  it("puts the sheet wholly right of the board's edge, its top at the board's top", () => {
    const [x, y] = tableauPosition(board, 0);
    const [w, h] = TABLEAU_ROWS[0]!;
    expect(x - w / 2).toBeGreaterThan(BOARD_WIDTH / 2);
    expect(y + h / 2).toBeCloseTo(boardSize(board)[1] / 2);
  });
  it("stacks the rows downward without overlap", () => {
    for (let row = 1; row < TABLEAU_ROWS.length; row++) {
      const above = tableauPosition(board, row - 1)[1] - TABLEAU_ROWS[row - 1]![1] / 2;
      const top = tableauPosition(board, row)[1] + TABLEAU_ROWS[row]![1] / 2;
      expect(top).toBeLessThan(above);
      expect(tableauPosition(board, row)[0]).toBe(tableauPosition(board, 0)[0]);
    }
  });
});

describe("table extent", () => {
  it("is the board's rectangle without the tableau", () => {
    expect(tableExtent(board, { tableau: false, sheets: 0, heldRows: 0 })).toEqual({ minX: -BOARD_WIDTH / 2, maxX: BOARD_WIDTH / 2, minY: -BOARD_WIDTH / 4, maxY: BOARD_WIDTH / 4 });
  });
  it("reaches the tableau column's right edge with it", () => {
    const [x] = tableauPosition(board, 0);
    expect(tableExtent(board, { tableau: true, sheets: 0, heldRows: 0 })).toEqual({ minX: -BOARD_WIDTH / 2, maxX: x + TABLEAU_ROWS[0]![0] / 2, minY: -BOARD_WIDTH / 4, maxY: BOARD_WIDTH / 4 });
  });
});

describe("investigator sheets", () => {
  it("puts the first sheet below the board from its left edge and the second to its right", () => {
    const [x0, y0] = sheetPosition(board, 0);
    const [x1, y1] = sheetPosition(board, 1);
    expect(x0 - SHEET[0] / 2).toBeCloseTo(-BOARD_WIDTH / 2);
    expect(y0 + SHEET[1] / 2).toBeLessThan(-boardSize(board)[1] / 2);
    expect(y1).toBe(y0);
    expect(x1 - SHEET[0] / 2).toBeGreaterThan(x0 + SHEET[0] / 2);
  });
  it("drops the extent to the row's bottom and widens it for a large group", () => {
    const two = tableExtent(board, { tableau: true, sheets: 2, heldRows: 0 });
    expect(two.minY).toBeCloseTo(sheetPosition(board, 0)[1] - SHEET[1] / 2);
    expect(two.maxX).toBe(tableExtent(board, { tableau: true, sheets: 0, heldRows: 0 }).maxX);
    const eight = tableExtent(board, { tableau: true, sheets: 8, heldRows: 0 });
    expect(eight.maxX).toBeCloseTo(sheetPosition(board, 7)[0] + SHEET[0] / 2);
  });
});

describe("held cards", () => {
  it("lays three cards in a row under the sheet from its left edge and wraps the fourth", () => {
    const [sx, sy] = sheetPosition(board, 1);
    const [x0, y0] = heldPosition(board, 1, 0);
    const [x2, y2] = heldPosition(board, 1, 2);
    const [x3, y3] = heldPosition(board, 1, 3);
    expect(x0 - HELD[0] / 2).toBeCloseTo(sx - SHEET[0] / 2);
    expect(y0 + HELD[1] / 2).toBeLessThan(sy - SHEET[1] / 2);
    expect(y2).toBe(y0);
    expect(x2 + HELD[0] / 2).toBeLessThanOrEqual(sx + SHEET[0] / 2 + 0.01);
    expect(x3).toBe(x0);
    expect(y3 + HELD[1] / 2).toBeLessThan(y0 - HELD[1] / 2);
  });
  it("drops the extent below the deepest held row", () => {
    const two = tableExtent(board, { tableau: true, sheets: 1, heldRows: 2 });
    expect(two.minY).toBeCloseTo(heldPosition(board, 0, 3)[1] - HELD[1] / 2);
  });
});
