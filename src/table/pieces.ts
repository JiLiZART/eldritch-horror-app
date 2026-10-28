import type { GameSet } from "../content/types";
import type { GameState } from "../engine/types";

export type PieceKind = "gate" | "expedition" | "clue" | "rumor" | "eldritch" | "monster" | "pawn";

/** One token on the board: `image` is a path under public/, `label` the name shown in the panel. */
export interface Piece {
  kind: PieceKind;
  id: string;
  image: string;
  label: string;
}

const byId = <T extends { id: string }>(list: T[], id: string): T => {
  const found = list.find((x) => x.id === id);
  if (!found) throw new Error(`unknown content id ${id}`);
  return found;
};

/** Pieces grouped by space id, each space ordered gate, expedition, clue, rumor, eldritch, monsters, pawns. Empty without a game. */
export function piecesOnSpace(state: GameState | undefined, set: GameSet): Map<string, Piece[]> {
  const out = new Map<string, Piece[]>();
  if (!state) return out;
  const add = (space: string, piece: Piece) => out.set(space, [...(out.get(space) ?? []), piece]);
  const tokens = `cards/${set.id}/tokens`;
  for (const space of state.gates) add(space, { kind: "gate", id: `gate:${space}`, image: `${tokens}/gates/${space}.webp`, label: "Gate" });
  add(state.activeExpedition, { kind: "expedition", id: "expedition", image: `${tokens}/active-expedition-token.webp`, label: "Active expedition" });
  for (const space of state.clues) add(space, { kind: "clue", id: `clue:${space}`, image: `${tokens}/clues/clues-back.webp`, label: "Clue" });
  state.rumors.forEach((space, n) => add(space, { kind: "rumor", id: `rumor:${space}#${n}`, image: "icons/rumor-token.png", label: "Rumor" }));
  for (const [space, count] of Object.entries(state.eldritch)) {
    for (let n = 0; n < count; n++) add(space, { kind: "eldritch", id: `eldritch:${space}#${n}`, image: "icons/eldritch.png", label: "Eldritch token" });
  }
  for (const m of state.monsters) {
    const monster = byId(set.monsters, m.id);
    add(m.space, { kind: "monster", id: `${m.id}#${m.instance}`, image: monster.images.front, label: m.health > 0 ? `${monster.name} (${m.health} health lost)` : monster.name });
  }
  for (const i of state.investigators) {
    if (i.defeated === "devoured" || i.removed) continue;
    const investigator = byId(set.investigators, i.id);
    add(i.space, { kind: "pawn", id: i.id, image: investigator.pawn, label: i.defeated ? `${investigator.name} (defeated)` : i.delayed ? `${investigator.name} (delayed)` : investigator.name });
  }
  return out;
}
