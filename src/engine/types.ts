import type { Skill } from "../content/types";
/** Game state: plain JSON data, index 0 of every deck is the top card. View state lives elsewhere. */

/** Shape of `GameState` as saved; bump it whenever a field is added, removed or renamed, so an older save is set aside instead of breaking later. */
export const STATE_VERSION = 2;

export type Difficulty = "normal" | "easy" | "hard";

export interface SetupOptions {
  ancientOne: string;
  /** Investigator ids in seat order; seat 0 holds the lead investigator token. */
  investigators: string[];
  difficulty?: Difficulty;
  seed: number;
}

/** Dice that landed and wait for rerolls before the result counts (manual p.3, p.8). */
export interface Roll {
  /** Investigator id who rolled and may spend clues. */
  investigator: string;
  /** Faces rolled, 1 to 6. */
  dice: number[];
  /** Dice showing 5 or 6; the test passes with at least 1. */
  successes: number;
}

/** One physical monster token; `instance` tells identical tokens apart. */
export interface MonsterInstance {
  id: string;
  instance: number;
}

export interface MonsterOnBoard extends MonsterInstance {
  space: string;
  /** Health lost in combat; defeated at the token's toughness. */
  health: number;
  /** Drawn for an ambush, not spawned: back to the cup once the fight ends (manual p.3). */
  ambush?: true;
}

export type Ticket = "train" | "ship";

export interface InvestigatorState {
  id: string;
  space: string;
  health: number;
  sanity: number;
  clues: number;
  /** Card ids. */
  possessions: string[];
  /** Condition card ids; not possessions, never traded. */
  conditions: string[];
  /** Travel tickets held, at most 2. */
  tickets: Ticket[];
  /** Improvement tokens by skill, +1 or +2; absent means none (manual p.9). */
  improvements: Partial<Record<Skill, 1 | 2>>;
  /** Set at 0 health or sanity, or when devoured; the investigator's turns are skipped from then on. */
  defeated?: "health" | "sanity" | "devoured";
  /** The investigator who took this fallen seat at the end of a Mythos phase (manual p.4). */
  replacedBy?: string;
  /** Token on its side: no actions until the next Action turn stands it up. */
  delayed?: true;
}

/** Holds a Detained condition (manual p.4): ids follow `<set>/condition/detained-<n>` as content-schema fixes. */
export const isDetained = (me: InvestigatorState): boolean => me.conditions.some((c) => /\/condition\/detained-\d+$/.test(c));

export type ActionName = "travel" | "rest" | "prepare-for-travel" | "trade" | "acquire-assets";

export interface ActionPhase {
  name: "action";
  /** Investigator id whose turn it is. */
  active: string;
  /** Actions the active investigator has performed this phase. */
  taken: ActionName[];
  /** Acquire Assets rolled and waiting for rerolls and the cards to be chosen; `loan` once the Bank Loan added 2 successes (manual p.3). */
  acquiring?: Roll & { loan?: true };
}

export interface EncounterPhase {
  name: "encounter";
  /** Investigator id whose encounter it is. */
  active: string;
  /** Fights and draws in rule words. */
  log: string[];
  /** Monsters fought this encounter, as `id#instance`. */
  fought: string[];
  /** The encounter card drawn, until the player finishes. */
  card?: { deck: string; id: string };
  /** A fight waiting on its Will or Strength dice for rerolls before the losses are taken. */
  combat?: { monster: MonsterInstance; step: "will" | "strength"; roll: Roll };
}

export interface MythosPhase {
  name: "mythos";
  /** Mythos card id drawn this round. */
  card: string;
  /** Resolution steps in rule words; present once the card is resolved. */
  log?: string[];
}

export interface LostPhase {
  name: "lost";
  reason: string;
}

export interface WonPhase {
  name: "won";
  reason: string;
}

/** One kept line of the game's record (design D1): a phase log line or an action name. */
export interface JournalEntry {
  round: number;
  phase: "action" | "encounter" | "mythos";
  /** Investigator id the line is about; absent for Mythos lines. */
  who?: string;
  text: string;
}

/** The phase in progress. */
export type Phase = ActionPhase | EncounterPhase | MythosPhase | LostPhase | WonPhase;

/** Printed on the reference card for the investigator count. */
export interface ReferenceCard {
  gates: number;
  clues: number;
  surge: number;
}

export interface GameState {
  /** `STATE_VERSION` at the time of setup. */
  version: number;
  seed: number;
  /** Tests rolled so far; seeds the next test's dice. */
  rolls: number;
  difficulty: Difficulty;
  ancientOne: string;
  doom: number;
  /** Index on the omen track; 0 is the green comet space. */
  omen: number;
  /** Eldritch tokens per omen track space. */
  eldritchOnOmen: [number, number, number, number];
  /** Space ids holding a rumor token, one entry per token (manual p.3). */
  rumors: string[];
  /** Eldritch tokens per space id; absent means none (manual p.4). */
  eldritch: Record<string, number>;
  referenceCard: ReferenceCard;
  round: number;
  phase: Phase;
  /** Every phase's log lines once the phase or seat passed, and every action performed, oldest first. */
  journal: JournalEntry[];
  leadInvestigator: string;
  investigators: InvestigatorState[];
  /** Space ids with an open gate. */
  gates: string[];
  gateStack: string[];
  gateDiscard: string[];
  /** Space ids with a facedown clue token. */
  clues: string[];
  cluePool: string[];
  clueDiscard: string[];
  /** Clue token ids held by investigators, out of the pool and off the board; spent ones go to the discard (manual p.4). */
  heldClues: string[];
  monsters: MonsterOnBoard[];
  monsterCup: MonsterInstance[];
  setAsideMonsters: MonsterInstance[];
  decks: {
    asset: string[];
    spell: string[];
    condition: string[];
    artifact: string[];
    "unique-asset": string[];
    mythos: string[];
    mystery: string[];
    research: string[];
    /** Keyed by encounter deck id (america, europe, asia, general, other-world, expedition). */
    encounters: Record<string, string[]>;
  };
  reserve: string[];
  /** Keyed by encounter deck id, research included; index 0 is the last discard. */
  encounterDiscards: Record<string, string[]>;
  /** Asset cards discarded from the reserve, reshuffled into the asset deck when it runs out. */
  assetDiscard: string[];
  artifactDiscard: string[];
  /** Ongoing mythos cards in play, oldest first. */
  ongoingMythos: string[];
  mythosDiscard: string[];
  currentMystery: string;
  /** Solved mystery ids, newest first. */
  solvedMysteries: string[];
  /** Tokens of any kind on the current mystery, discarded when it is solved (manual p.4). */
  mysteryTokens: number;
  /** The final mystery on the sheet back, solvable once awakened. */
  finalMysterySolved?: true;
  /** Doom reached 0: the sheet back is in play (manual p.4). */
  awakened?: true;
  /** Space id of the active expedition token. */
  activeExpedition: string;
}
