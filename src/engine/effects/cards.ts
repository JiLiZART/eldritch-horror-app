import type { Deck } from "../../content/types";
import { reshuffle } from "../rng";
import type { Content } from "../setup";
import { note, spaceName, textPhase } from "../spawn";
import type { GameState } from "../types";
import { name, replace, subject } from "./shared";

/** Card text on cards (manual_eng.pdf p.4): gaining, discarding, the fallen one's possessions, ongoing mythos cards. */

const DOUBLE_SIDED: Deck[] = ["spell", "condition", "unique-asset"];

/** An empty asset or artifact deck takes its shuffled discard at once (manual p.4). */
function replenish(state: GameState, deck: Deck): GameState {
  const pile = deck === "asset" ? "assetDiscard" : deck === "artifact" ? "artifactDiscard" : undefined;
  if (pile === undefined || state.decks[deck].length > 0 || state[pile].length === 0) return state;
  const { items, rolls } = reshuffle(state, state[pile]);
  return { ...state, rolls, decks: { ...state.decks, [deck]: items }, [pile]: [] };
}


/** By name when given; else the top card, or the bottom of a double-sided deck (manual p.4). Spells and conditions are never duplicated. */
export function gainCard(start: GameState, content: Content, id: string, deck: Deck, cardName?: string): GameState {
  const me = subject(start, id);
  const state = replenish(start, deck);
  const cards = state.decks[deck];
  const title = (cardId: string) => content.set.cards.find((c) => c.id === cardId)?.name;
  const at = cardName === undefined ? (DOUBLE_SIDED.includes(deck) ? cards.length - 1 : 0) : cards.findIndex((c) => title(c) === cardName);
  const card = cards[at];
  if (card === undefined) throw new Error(cardName === undefined ? `the ${deck} deck is empty` : `no ${cardName} in the ${deck} deck`);
  const gained = title(card)!;
  if (DOUBLE_SIDED.includes(deck) && [...me.possessions, ...me.conditions].some((c) => title(c) === gained)) throw new Error(`${name(content, id)} already has ${gained}`);
  const held = deck === "condition" ? { ...me, conditions: [...me.conditions, card] } : { ...me, possessions: [...me.possessions, card] };
  return note({ ...replace(state, held), decks: { ...state.decks, [deck]: cards.filter((_, n) => n !== at) } }, `${name(content, id)} gains ${gained}`);
}


/** Assets and artifacts go to their discard; a double-sided card is shuffled back into its deck at once (manual p.4). */
export function discardCard(state: GameState, content: Content, id: string, cardId: string): GameState {
  const me = subject(state, id);
  const card = content.set.cards.find((c) => c.id === cardId);
  if (!card || !(me.possessions.includes(cardId) || me.conditions.includes(cardId))) throw new Error(`${name(content, id)} does not hold ${cardId}`);
  let s = replace(state, { ...me, possessions: me.possessions.filter((c) => c !== cardId), conditions: me.conditions.filter((c) => c !== cardId) });
  if (card.deck === "asset") s = { ...s, assetDiscard: [cardId, ...s.assetDiscard] };
  else if (card.deck === "artifact") s = { ...s, artifactDiscard: [cardId, ...s.artifactDiscard] };
  else {
    const { items, rolls } = reshuffle(s, [...s.decks[card.deck], cardId]);
    s = { ...s, decks: { ...s.decks, [card.deck]: items }, rolls };
  }
  return note(s, `${name(content, id)} discards ${card.name}`);
}


/** A comrade on the fallen one's city collects the possessions set aside with the sheet (manual p.4); whether the back grants them is the players' reading. */
export function takePossessions(state: GameState, content: Content, to: string, from: string): GameState {
  const me = subject(state, to);
  const other = state.investigators.find((i) => i.id === from);
  if (!other || !other.defeated || other.defeated === "devoured" || other.space !== me.space) throw new Error(`no defeated investigator's sheet lies on ${spaceName(content, me.space)}`);
  if (other.possessions.length === 0) throw new Error(`nothing is left with ${name(content, from)}'s sheet`);
  const investigators = state.investigators.map((i) => (i.id === to ? { ...i, possessions: [...i.possessions, ...other.possessions] } : i.id === from ? { ...i, possessions: [] } : i));
  return note({ ...state, investigators }, `${name(content, to)} takes ${name(content, from)}'s possessions`);
}

/** Card text discards an ongoing mythos card, a solved or failed rumor among them (manual p.4); its tokens are the players' to remove. */
export function discardOngoing(state: GameState, content: Content, cardId: string): GameState {
  textPhase(state);
  const card = content.set.mythos.find((m) => m.id === cardId);
  if (!state.ongoingMythos.includes(cardId)) throw new Error(`${card?.name ?? cardId} is not in play`);
  return note({ ...state, ongoingMythos: state.ongoingMythos.filter((c) => c !== cardId), mythosDiscard: [cardId, ...state.mythosDiscard] }, `${card?.name ?? cardId} is discarded from play`);
}

