import type { MythosCard, MythosEffect } from "../content/types";
import { awakenAt0 } from "./ancientOne";
import { OMEN_TRACK } from "./omen";
import { rng, type Random } from "./rng";
import type { Content } from "./setup";
import { note, spawnClue, spawnGate, spawnMonster, spaceName } from "./spawn";
import type { GameState, MythosPhase } from "./types";

/** Mythos phase (manual_eng.pdf p.3–4; EH_reference.pdf p.6): draw, resolve the icons left to right, then the next round. */

/** Moves the top mythos card into the phase; an empty deck loses the game (manual p.4). */
export function drawMythos(state: GameState): GameState {
  const [card, ...deck] = state.decks.mythos;
  if (card === undefined) return { ...state, phase: { name: "lost", reason: "the mythos deck is empty: no card can be drawn, so the investigators lose" } };
  return { ...state, decks: { ...state.decks, mythos: deck }, phase: { name: "mythos", card } };
}

function mythosPhase(state: GameState): MythosPhase {
  if (state.phase.name !== "mythos") throw new Error("the card is resolved in the Mythos phase only");
  return state.phase;
}

/** Steps whose rules are not modelled; the players resolve them by hand. */
const LEFT_TO_PLAYERS: Partial<Record<MythosEffect, string>> = {
  reckoning: "reckoning effects are left to the players",
  "place-rumor": "the rumor token is left to the players",
  "place-eldritch-tokens": "the eldritch tokens are left to the players",
  "resolve-text": "the card text is left to the players",
};

/** Applies the card's icon row in printed order and fills the log; refuses a second resolution. */
export function resolveMythos(state: GameState, content: Content): GameState {
  const phase = mythosPhase(state);
  if (phase.log) throw new Error("this card is already resolved");
  const card = content.set.mythos.find((m) => m.id === phase.card);
  if (!card) throw new Error(`unknown mythos card ${phase.card}`);
  const random = rng(state.seed * 31 + state.round);
  let s: GameState = { ...state, phase: { ...phase, log: [] } };
  for (const effect of card.effects) {
    const line = LEFT_TO_PLAYERS[effect];
    if (line) s = note(s, line);
    else if (effect === "advance-omen") s = advanceOmen(s, content);
    else if (effect === "spawn-gates") for (let n = 0; n < s.referenceCard.gates; n++) s = spawnGate(s, content, random);
    else if (effect === "monster-surge") s = surge(s, content, random);
    else if (effect === "spawn-clues") for (let n = 0; n < s.referenceCard.clues; n++) s = spawnClue(s, content, random);
  }
  if (!card.effects.includes("resolve-text")) s = note(s, LEFT_TO_PLAYERS["resolve-text"]!);
  return leavePlay(s, card);
}

/** 1 space clockwise, then doom by 1 per gate on a city of the new colour (manual p.3). */
function advanceOmen(state: GameState, content: Content): GameState {
  const omen = (state.omen + 1) % OMEN_TRACK.length;
  const matching = gatesMatching({ ...state, omen }, content);
  const doom = state.doom - matching.length;
  return awakenAt0(note({ ...state, omen, doom }, `the omen moves to ${OMEN_TRACK[omen]}; ${matching.length} matching gate${matching.length === 1 ? "" : "s"}, doom ${doom}`), content);
}

function gatesMatching(state: GameState, { board }: Content): string[] {
  const colour = OMEN_TRACK[state.omen];
  return state.gates.filter((id) => board.spaces.find((s) => s.id === id)?.gate === colour);
}

/** The reference card's monsters at each gate matching the omen, or 1 gate when none matches (EH_reference p.6). */
function surge(state: GameState, content: Content, random: Random): GameState {
  const matching = gatesMatching(state, content);
  if (matching.length === 0) return spawnGate(note(state, "monster surge: no gate matches the omen, so 1 gate is spawned"), content, random);
  let s = state;
  for (const space of matching) {
    s = note(s, `monster surge on ${spaceName(content, space)}`);
    for (let n = 0; n < s.referenceCard.surge; n++) s = spawnMonster(s, content, space);
  }
  return s;
}

/** Event cards go to the discard; ongoing cards stay in play (manual p.4). */
function leavePlay(state: GameState, card: MythosCard): GameState {
  return card.trait === "event"
    ? note({ ...state, mythosDiscard: [card.id, ...state.mythosDiscard] }, `${card.name} is discarded`)
    : note({ ...state, ongoingMythos: [...state.ongoingMythos, card.id] }, `${card.name} stays in play`);
}

/** Ends the Mythos phase: the lead may pass the token, then the next round's Action phase starts with the lead (manual p.3). */
export function nextRound(state: GameState, lead = state.leadInvestigator): GameState {
  if (!mythosPhase(state).log) throw new Error("resolve the mythos card before the next round");
  const chosen = state.investigators.find((i) => i.id === lead);
  if (!chosen) throw new Error(`no investigator ${lead} to take the lead`);
  if (chosen.defeated) throw new Error(`${lead} is defeated and cannot take the lead`);
  return { ...state, round: state.round + 1, leadInvestigator: lead, phase: { name: "action", active: lead, taken: [] } };
}
