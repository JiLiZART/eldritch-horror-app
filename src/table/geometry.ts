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

/** Where reserve slot `index` lies on the printed strip, the first at `from` and the last at `to` (reserve-slots D2). */
export function reservePosition(board: Board, index: number): [x: number, y: number] {
  const { from, to, slots } = board.tracks.reserve;
  const f = slots > 1 ? Math.min(Math.max(index, 0), slots - 1) / (slots - 1) : 0;
  return boardToWorld({ x: from.x + (to.x - from.x) * f, y: from.y + (to.y - from.y) * f }, board);
}

/** The tableau's rows right of the board, top down: the Ancient One sheet, the mystery card, the ongoing mythos cards; `[width, height]` of one face (tableau D1). */
export const TABLEAU_ROWS: [width: number, height: number][] = [
  [2.4, 3.0],
  [2.4, 1.5],
  [1.1, 1.7],
];
const TABLEAU_GAP = 0.3;

/** The centre of tableau row `row`: a column 2.4 wide beside the board's right edge, rows stacked down from its top edge (tableau D1). */
export function tableauPosition(board: Board, row: number): [x: number, y: number] {
  const [w, h] = boardSize(board);
  const x = w / 2 + TABLEAU_GAP + TABLEAU_ROWS[0]![0] / 2;
  let top = h / 2;
  for (let r = 0; r < row; r++) top -= TABLEAU_ROWS[r]![1] + TABLEAU_GAP;
  return [x, top - TABLEAU_ROWS[row]![1] / 2];
}

/** An investigator sheet's face, `[width, height]`: landscape, 1600 by 1268 (investigator-sheets D1). */
export const SHEET: [width: number, height: number] = [2.4, (2.4 * 1268) / 1600];
const SHEET_GAP = 0.2;

/** The centre of sheet `index` in the row below the board, from its left edge, in seat order (investigator-sheets D1). */
export function sheetPosition(board: Board, index: number): [x: number, y: number] {
  const [w, h] = boardSize(board);
  return [-w / 2 + SHEET[0] / 2 + index * (SHEET[0] + SHEET_GAP), -h / 2 - TABLEAU_GAP - SHEET[1] / 2];
}

/** A held card's face, `[width, height]`: portrait, 478 by 745, three to a row under a sheet (held-cards D1). */
export const HELD: [width: number, height: number] = [0.7, (0.7 * 745) / 478];
const HELD_GAP = 0.15;
const HELD_PER_ROW = 3;
/** Felt around the outermost cards, so one at the edge can be centred when read (table-margin D1). */
export const TABLE_MARGIN = 0.3;

/** The centre of held card `index` under sheet `seat`: rows of three from the sheet's left edge (held-cards D1). */
export function heldPosition(board: Board, seat: number, index: number): [x: number, y: number] {
  const [sx, sy] = sheetPosition(board, seat);
  const col = index % HELD_PER_ROW;
  const row = Math.floor(index / HELD_PER_ROW);
  return [sx - SHEET[0] / 2 + HELD[0] / 2 + col * (HELD[0] + HELD_GAP), sy - SHEET[1] / 2 - SHEET_GAP - HELD[1] / 2 - row * (HELD[1] + HELD_GAP)];
}

/** The table the view stays within: the board's rectangle, reaching the tableau column, the sheet row and the deepest held row during a game (pan-clamp D1). */
export function tableExtent(board: Board, { tableau, sheets, heldRows }: { tableau: boolean; sheets: number; heldRows: number }): { minX: number; maxX: number; minY: number; maxY: number } {
  const [w, h] = boardSize(board);
  const tableauX = tableau ? tableauPosition(board, 0)[0] + TABLEAU_ROWS[0]![0] / 2 : w / 2;
  const sheetsX = sheets > 0 ? sheetPosition(board, sheets - 1)[0] + SHEET[0] / 2 : w / 2;
  const minY = heldRows > 0 ? heldPosition(board, 0, (heldRows - 1) * HELD_PER_ROW)[1] - HELD[1] / 2 : sheets > 0 ? sheetPosition(board, 0)[1] - SHEET[1] / 2 : -h / 2;
  return { minX: -w / 2 - TABLE_MARGIN, maxX: Math.max(tableauX, sheetsX) + TABLE_MARGIN, minY: minY - TABLE_MARGIN, maxY: h / 2 + TABLE_MARGIN };
}
