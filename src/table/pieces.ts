import type { Board, GameSet, MonsterCombat } from "../content/types";
import { OMEN_TRACK } from "../engine/omen";
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
  /** A monster's combat numbers for the hover badge (monster-hover-stats D1). */
  hint?: string;
}

const byId = <T extends { id: string }>(list: T[], id: string): T => {
  const found = list.find((x) => x.id === id);
  if (!found) throw new Error(`unknown content id ${id}`);
  return found;
};

/** Pieces grouped by space id, each space ordered gate, expedition, clue, rumor, eldritch, monsters, pawns, then the lead token. Empty without a game. */
/** A panel translator, bound to the chosen language (piece-labels-language D1). */
export type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function piecesOnSpace(state: GameState | undefined, board: Board, set: GameSet, t: Translate): Map<string, Piece[]> {
  const out = new Map<string, Piece[]>();
  if (!state) return out;
  const add = (space: string, piece: Piece) => out.set(space, [...(out.get(space) ?? []), piece]);
  const tokens = `cards/${set.id}/tokens`;
  for (const space of state.gates) {
    // The gate's printed colour and whether the omen sits on it now (gate-hover-colour D1).
    const colour = board.spaces.find((s) => s.id === space)?.gate;
    const hint = colour && `${t(`gate.${colour}`)}${colour === OMEN_TRACK[state.omen] ? `, ${t("piece.matchesOmen")}` : ""}`;
    add(space, { kind: "gate", id: `gate:${space}`, image: `${tokens}/gates/${space}.webp`, label: t("piece.gate"), ...(hint ? { hint } : {}) });
  }
  add(state.activeExpedition, { kind: "expedition", id: "expedition", image: `${tokens}/active-expedition-token.webp`, label: t("piece.expedition") });
  for (const space of state.clues) add(space, { kind: "clue", id: `clue:${space}`, image: `${tokens}/clues/clues-back.webp`, label: t("piece.clue") });
  state.rumors.forEach((space, n) => add(space, { kind: "rumor", id: `rumor:${space}#${n}`, image: `${tokens}/rumor-token.webp`, label: t("piece.rumor") }));
  for (const [space, count] of Object.entries(state.eldritch)) {
    for (let n = 0; n < count; n++) add(space, { kind: "eldritch", id: `eldritch:${space}#${n}`, image: `${tokens}/eldritch-token.webp`, label: t("piece.eldritch") });
  }
  const sheet = set.ancientOnes.find((a) => a.id === state.ancientOne);
  const signed = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
  /** The token's printed numbers, the cultist's from the Ancient One sheet (monster-hover-stats D1). */
  const hint = (combat: MonsterCombat): string =>
    [
      combat.will && t("piece.will", { modifier: signed(combat.will.modifier), horror: combat.will.horror }),
      combat.strength && t("piece.strength", { modifier: signed(combat.strength.modifier), damage: combat.strength.damage }),
      combat.toughness !== undefined && t("piece.toughness", { toughness: combat.toughness }),
    ]
      .filter((x): x is string => !!x)
      .join(" · ");
  for (const m of state.monsters) {
    const monster = byId(set.monsters, m.id);
    const combat = monster.combat.onAncientOneSheet && sheet ? sheet.cultists : monster.combat;
    add(m.space, { kind: "monster", id: `${m.id}#${m.instance}`, image: monster.images.front, label: m.health > 0 ? t("piece.monsterHurt", { name: monster.name, count: m.health }) : monster.name, ...(m.health > 0 ? { damage: m.health } : {}), hint: hint(combat) });
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
