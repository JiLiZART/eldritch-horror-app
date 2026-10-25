import type { SetId } from "../content/types";

/** Sets that add spaces to the board; the core set is always on. */
export const BOARD_SETS: { id: SetId; name: string }[] = [
  { id: "eh03", name: "Mountains of Madness" },
  { id: "eh05", name: "Under the Pyramids" },
  { id: "eh07", name: "The Dreamlands" },
];

export const PATH_COLORS = { train: "#e03030", ship: "#3070ff", uncharted: "#c89a30", local: "#30c050" } as const;
