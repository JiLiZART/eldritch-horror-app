import type { Content } from "./setup";
import { note, textPhase } from "./spawn";
import type { GameState } from "./types";

/** The Ancient One's end game (manual_eng.pdf p.4; EH_reference.pdf p.3, p.8, p.12): doom by card text, the awakening, mysteries and victory. */

const sheet = ({ set }: Content, state: GameState) => set.ancientOnes.find((a) => a.id === state.ancientOne)!;

/** At doom 0 the sheet flips once; its Awakens effects, reckoning, cultist row and losing condition are left to the players (manual p.4). */
export function awakenAt0(state: GameState, content: Content): GameState {
  if (state.doom > 0 || state.awakened) return state;
  return note({ ...state, awakened: true }, `${sheet(content, state).name} awakens: the Awakens effects, the reckoning and the losing condition on the sheet back are left to the players`);
}

/** Card text advances (negative) or retreats doom within the track. */
export function changeDoom(state: GameState, content: Content, delta: number): GameState {
  textPhase(state);
  const doom = state.doom + delta;
  if (doom < 0) throw new Error("doom cannot advance past 0");
  if (doom > sheet(content, state).doom) throw new Error("doom cannot retreat past the start of the track");
  return awakenAt0(note({ ...state, doom }, `doom ${doom}`), content);
}

/** 3 mysteries win, plus the final mystery once awakened (manual p.4). */
function checkWin(state: GameState): GameState {
  if (state.solvedMysteries.length < 3 || (state.awakened && !state.finalMysterySolved)) return state;
  return { ...state, phase: { name: "won", reason: `3 mysteries${state.awakened ? " and the final mystery" : ""} are solved` } };
}

/** The current mystery joins the solved pile and the next is drawn (EH_reference p.12). Deviation: tokens on the mystery are not tracked. */
export function solveMystery(state: GameState, content: Content): GameState {
  textPhase(state);
  const [next, ...mystery] = state.decks.mystery;
  if (next === undefined) throw new Error("the mystery deck is empty");
  const name = sheet(content, state).mysteries.find((m) => m.id === state.currentMystery)?.name ?? state.currentMystery;
  return checkWin(note({ ...state, solvedMysteries: [state.currentMystery, ...state.solvedMysteries], currentMystery: next, mysteryTokens: 0, decks: { ...state.decks, mystery } }, `${name} is solved`));
}

/** Card text places a token on the current mystery or removes one; the kind is the players' reading (manual p.4). */
export function changeMysteryTokens(state: GameState, delta: number): GameState {
  textPhase(state);
  const mysteryTokens = state.mysteryTokens + delta;
  if (mysteryTokens < 0) throw new Error("the mystery holds no token");
  return note({ ...state, mysteryTokens }, `a token is ${delta > 0 ? "placed on" : "removed from"} the mystery (${mysteryTokens})`);
}

/** The final mystery on the sheet back (manual p.4). */
export function solveFinalMystery(state: GameState, content: Content): GameState {
  textPhase(state);
  if (!state.awakened) throw new Error("the final mystery is solved after the awakening");
  if (state.finalMysterySolved) throw new Error("the final mystery is already solved");
  return checkWin(note({ ...state, finalMysterySolved: true }, `the final mystery of ${sheet(content, state).name} is solved`));
}
