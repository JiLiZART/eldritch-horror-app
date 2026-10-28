import type { AncientOne, Board, Card, GameSet, Investigator, Monster, MythosColor, MythosStage } from "../content/types";
import { rng, shuffle, type Random } from "./rng";
import { spawnClue, spawnGate } from "./spawn";
import type { GameState, InvestigatorState, MonsterInstance, ReferenceCard, SetupOptions } from "./types";

export interface Content {
  board: Board;
  set: GameSet;
}

/** Printed reference cards: index by investigator count. manual_eng.pdf p.3; mod icon-reference-card-holder.js. */
const REFERENCE_CARDS: Record<number, ReferenceCard> = {
  1: { gates: 1, clues: 1, surge: 1 },
  2: { gates: 1, clues: 1, surge: 1 },
  3: { gates: 1, clues: 2, surge: 2 },
  4: { gates: 1, clues: 2, surge: 2 },
  5: { gates: 2, clues: 3, surge: 2 },
  6: { gates: 2, clues: 3, surge: 2 },
  7: { gates: 2, clues: 4, surge: 3 },
  8: { gates: 2, clues: 4, surge: 3 },
};

const COLORS: MythosColor[] = ["green", "yellow", "blue"];

/** Builds the start-of-game state following the printed setup order (manual_eng.pdf p.3). Throws on illegal options. */
export function setupGame({ board, set }: Content, options: SetupOptions): GameState {
  const difficulty = options.difficulty ?? "normal";
  const ancientOne = set.ancientOnes.find((a) => a.id === options.ancientOne);
  if (!ancientOne) throw new Error(`unknown Ancient One ${options.ancientOne}`);
  const chosen = options.investigators.map((id) => {
    const i = set.investigators.find((x) => x.id === id);
    if (!i) throw new Error(`unknown investigator ${id}`);
    return i;
  });
  if (chosen.length < 1 || chosen.length > 8) throw new Error(`1 to 8 investigators, got ${chosen.length}`);
  const dup = chosen.find((i, n) => chosen.indexOf(i) !== n);
  if (dup) throw new Error(`investigator ${dup.id} chosen twice`);
  const referenceCard = REFERENCE_CARDS[chosen.length]!;

  const random = rng(options.seed);
  const core = board.spaces.filter((s) => s.set === set.id);

  // 1. Gate stack and clue pool. Gate tokens exist for the cities that carry a gate colour.
  const gateStack = shuffle(core.filter((s) => s.gate !== undefined).map((s) => s.id), random);
  const cluePool = shuffle(core.map((s) => s.id), random);

  // Decks, shuffled.
  const deckOf = (deck: Card["deck"]) => shuffle(set.cards.filter((c) => c.deck === deck).map((c) => c.id), random);
  const decks: GameState["decks"] = {
    asset: deckOf("asset"),
    spell: deckOf("spell"),
    condition: deckOf("condition"),
    artifact: deckOf("artifact"),
    "unique-asset": deckOf("unique-asset"),
    mythos: buildMythosDeck(set, ancientOne, difficulty, random),
    mystery: shuffle(ancientOne.mysteries.map((c) => c.id), random),
    research: shuffle(ancientOne.research.map((c) => c.id), random),
    encounters: Object.fromEntries(set.encounterDecks.map((d) => [d.id, shuffle(d.cards.map((c) => c.id), random)])),
  };

  // 2. Investigators: starting space, full health and sanity, starting possessions.
  const investigators = chosen.map((i) => placeInvestigator(i, set.cards, decks, cluePool));

  // 3. Ancient One: doom, omen, set-aside monsters; 4. monster cup.
  const eldritchOnOmen: GameState["eldritchOnOmen"] = [ancientOne.setup?.eldritchTokensOnOmen ?? 0, 0, 0, 0];
  const { monsterCup, setAsideMonsters } = fillMonsterCup(set.monsters, ancientOne, random);

  // 7. Reserve, gates with monsters, expedition, clues, mystery.
  const reserve = decks.asset.splice(0, 4);
  const activeExpedition = expeditionSpace({ board, set }, decks.encounters.expedition ?? []);
  const currentMystery = decks.mystery.shift();
  if (!currentMystery) throw new Error(`${ancientOne.id} has no mystery cards`);

  let state: GameState = {
    seed: options.seed,
    rolls: 0,
    difficulty,
    ancientOne: ancientOne.id,
    doom: ancientOne.doom,
    omen: 0,
    eldritchOnOmen,
    rumors: [],
    eldritch: {},
    referenceCard,
    round: 1,
    journal: [],
    phase: { name: "action", active: investigators[0]!.id, taken: [] },
    leadInvestigator: investigators[0]!.id,
    investigators,
    gates: [],
    gateStack,
    gateDiscard: [],
    clues: [],
    cluePool,
    clueDiscard: [],
    monsters: [],
    monsterCup,
    setAsideMonsters,
    decks,
    reserve,
    assetDiscard: [],
    artifactDiscard: [],
    encounterDiscards: {},
    ongoingMythos: [],
    mythosDiscard: [],
    currentMystery,
    solvedMysteries: [],
    mysteryTokens: 0,
    activeExpedition,
  };
  const content = { board, set };
  for (let n = 0; n < referenceCard.gates; n++) state = spawnGate(state, content, random);
  for (let n = 0; n < referenceCard.clues; n++) state = spawnClue(state, content, random);
  return state;
}

/** Takes the printed starting cards out of their decks and starting clues out of the pool. */
export function placeInvestigator(i: Investigator, cards: Card[], decks: GameState["decks"], cluePool: string[]): InvestigatorState {
  const possessions: string[] = [];
  const conditions: string[] = [];
  const refs = [...(i.starting.assets ?? []), ...(i.starting.spells ?? []), ...(i.starting.uniqueAssets ?? []), ...(i.starting.conditions ?? [])];
  for (const ref of refs) {
    // A starting item names the card; copies carry a -N suffix and any copy still in the deck will do.
    const isCopy = (id: string) => id === ref || id.startsWith(`${ref}-`);
    const card = cards.find((c) => isCopy(c.id));
    if (!card) throw new Error(`${i.id} starts with unknown card ${ref}`);
    const deck = decks[card.deck];
    const at = deck.findIndex(isCopy);
    if (at < 0) throw new Error(`no copy of ${ref} left for ${i.id}`);
    (card.deck === "condition" ? conditions : possessions).push(...deck.splice(at, 1));
  }
  const clues = i.starting.clues ?? 0;
  cluePool.splice(0, clues);
  return { id: i.id, space: i.startingSpace, health: i.health, sanity: i.sanity, clues, possessions, conditions, tickets: [], improvements: {} };
}

/** Every non-epic token minus the sheet's set-aside monsters, shuffled. */
function fillMonsterCup(all: Monster[], ancientOne: AncientOne, random: Random) {
  const setAside = { ...(ancientOne.setup?.setAsideMonsters ?? {}) };
  const monsterCup: MonsterInstance[] = [];
  const setAsideMonsters: MonsterInstance[] = [];
  for (const m of all) {
    if (m.epic) continue;
    for (let instance = 1; instance <= (m.count ?? 1); instance++) {
      const token = { id: m.id, instance };
      if ((setAside[m.id] ?? 0) > 0) {
        setAside[m.id]! -= 1;
        setAsideMonsters.push(token);
      } else monsterCup.push(token);
    }
  }
  return { monsterCup: shuffle(monsterCup, random), setAsideMonsters };
}

/** Three stages from the sheet counts, stage I on top. Difficulty is the rulebook variant: easy drops hard cards, hard drops easy cards. */
function buildMythosDeck(set: GameSet, ancientOne: AncientOne, difficulty: GameState["difficulty"], random: Random): string[] {
  const excluded = difficulty === "easy" ? "hard" : difficulty === "hard" ? "easy" : undefined;
  const pools = Object.fromEntries(
    COLORS.map((color) => [color, shuffle(set.mythos.filter((m) => m.color === color && m.difficulty !== excluded).map((m) => m.id), random)]),
  ) as Record<MythosColor, string[]>;
  const stage = (counts: MythosStage) => {
    const cards: string[] = [];
    for (const color of COLORS) {
      if (pools[color].length < counts[color]) throw new Error(`not enough ${color} mythos cards for ${ancientOne.id} at ${difficulty} difficulty`);
      cards.push(...pools[color].splice(0, counts[color]));
    }
    return shuffle(cards, random);
  };
  const { stage1, stage2, stage3 } = ancientOne.mythos;
  return [...stage(stage1), ...stage(stage2), ...stage(stage3)];
}

/** The space of the top expedition card: the card is named after it ("Antarctica - 01"). */
export function expeditionSpace({ board, set }: Content, expedition: string[]): string {
  const top = set.encounterDecks.find((d) => d.id === "expedition")?.cards.find((c) => c.id === expedition[0]);
  if (!top) throw new Error("the set has no expedition cards");
  const name = top.name.replace(/ - \d+$/, "");
  const space = board.spaces.find((s) => s.set === set.id && s.name.en === name);
  if (!space) throw new Error(`no board space named ${name}`);
  return space.id;
}
