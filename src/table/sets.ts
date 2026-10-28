import type { SetId } from "../content/types";

/** Sets that add spaces to the board; the core set is always on. */
export const BOARD_SETS: SetId[] = ["eh03", "eh05", "eh07"];

export const PATH_COLORS = { train: "#e03030", ship: "#3070ff", uncharted: "#c89a30", local: "#30c050" } as const;
