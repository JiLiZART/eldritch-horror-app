import type { GameSet } from "../content/types";
import type { GameState } from "../engine/types";

export type PieceKind = "gate" | "expedition" | "clue" | "rumor" | "eldritch" | "monster" | "pawn" | "lead";

/** One token on the board: `image` is a path under public/, `label` the name shown in the panel. */
export interface Piece {
  kind: PieceKind;
  id: string;
  image: string;
  label: string;
  /** A pawn laid on its side: the investigator is delayed or defeated (manual p.4). */
  lying?: true;
  /** A monster's health lost, marked with a health token on it (manual p.3; monster-damage D1). */
  damage?: number;
}

const byId = <T extends { id: string }>(list: T[], id: string): T => {
  const found = list.find((x) => x.id === id);
  if (!found) throw new Error(`unknown content id ${id}`);
  return found;
};

/** Pieces grouped by space id, each space ordered gate, expedition, clue, rumor, eldritch, monsters, pawns, then the lead token. Empty without a game. */
/** A panel translator, bound to the chosen language (piece-labels-language D1). */
export type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function piecesOnSpace(state: GameState | undefined, set: GameSet, t: Translate): Map<string, Piece[]> {
  const out = new Map<string, Piece[]>();
  if (!state) return out;
  const add = (space: string, piece: Piece) => out.set(space, [...(out.get(space) ?? []), piece]);
  const tokens = `cards/${set.id}/tokens`;
  for (const space of state.gates) add(space, { kind: "gate", id: `gate:${space}`, image: `${tokens}/gates/${space}.webp`, label: t("piece.gate") });
  add(state.activeExpedition, { kind: "expedition", id: "expedition", image: `${tokens}/active-expedition-token.webp`, label: t("piece.expedition") });
  for (const space of state.clues) add(space, { kind: "clue", id: `clue:${space}`, image: `${tokens}/clues/clues-back.webp`, label: t("piece.clue") });
  state.rumors.forEach((space, n) => add(space, { kind: "rumor", id: `rumor:${space}#${n}`, image: `${tokens}/rumor-token.webp`, label: t("piece.rumor") }));
  for (const [space, count] of Object.entries(state.eldritch)) {
    for (let n = 0; n < count; n++) add(space, { kind: "eldritch", id: `eldritch:${space}#${n}`, image: `${tokens}/eldritch-token.webp`, label: t("piece.eldritch") });
  }
  for (const m of state.monsters) {
    const monster = byId(set.monsters, m.id);
    add(m.space, { kind: "monster", id: `${m.id}#${m.instance}`, image: monster.images.front, label: m.health > 0 ? t("piece.monsterHurt", { name: monster.name, count: m.health }) : monster.name, ...(m.health > 0 ? { damage: m.health } : {}) });
  }
  for (const i of state.investigators) {
    if (i.defeated === "devoured" || i.removed) continue;
    const investigator = byId(set.investigators, i.id);
    const label = i.defeated ? t("piece.defeated", { name: investigator.name }) : i.delayed ? t("piece.delayed", { name: investigator.name }) : investigator.name;
    add(i.space, { kind: "pawn", id: i.id, image: investigator.pawn, label, ...(i.defeated || i.delayed ? { lying: true as const } : {}) });
  }
  // The lead investigator token beside the lead's pawn (manual p.3); the engine keeps the lead on a standing investigator.
  const lead = state.investigators.find((i) => i.id === state.leadInvestigator);
  if (lead && !lead.defeated) add(lead.space, { kind: "lead", id: "lead", image: `${tokens}/lead-investigator.webp`, label: t("piece.lead") });
  return out;
}
