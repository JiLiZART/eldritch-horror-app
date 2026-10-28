import type { Path, PathType, SetId } from "../content/types";

/** Sets that add spaces to the board; the core set is always on. */
export const BOARD_SETS: SetId[] = ["eh03", "eh05", "eh07"];

export const PATH_COLORS = { train: "#e03030", ship: "#3070ff", uncharted: "#c89a30", local: "#30c050" } as const;

/** The legend's types that occur among the paths, in legend order (legend-shown-paths D1). */
export function pathTypes(paths: Path[]): PathType[] {
  const present = new Set(paths.map((p) => p.type));
  return (Object.keys(PATH_COLORS) as PathType[]).filter((t) => present.has(t));
}
