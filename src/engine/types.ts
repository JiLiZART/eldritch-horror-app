/** Game state: plain JSON data, index 0 of every deck is the top card. View state lives elsewhere. */

export type Difficulty = "normal" | "easy" | "hard";

export interface SetupOptions {
  ancientOne: string;
  /** Investigator ids in seat order; seat 0 holds the lead investigator token. */
  investigators: string[];
  difficulty?: Difficulty;
  seed: number;
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
  /** Set at 0 health or sanity; the investigator's turns are skipped from then on. */
  defeated?: "health" | "sanity";
  /** Token on its side: no actions until the next Action turn stands it up. */
  delayed?: true;
}

export type ActionName = "travel" | "rest" | "prepare-for-travel" | "trade" | "acquire-assets";

export interface ActionPhase {
  name: "action";
  /** Investigator id whose turn it is. */
  active: string;
  /** Actions the active investigator has performed this phase. */
  taken: ActionName[];
  /** Acquire Assets rolled and waiting for the cards to be chosen. */
  acquiring?: { dice: number[]; successes: number };
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

/** The phase in progress. */
export type Phase = ActionPhase | EncounterPhase | MythosPhase | LostPhase | WonPhase;

/** Printed on the reference card for the investigator count. */
export interface ReferenceCard {
  gates: number;
  clues: number;
  surge: number;
}

export interface GameState {
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
  referenceCard: ReferenceCard;
  round: number;
  phase: Phase;
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
  /** The final mystery on the sheet back, solvable once awakened. */
  finalMysterySolved?: true;
  /** Doom reached 0: the sheet back is in play (manual p.4). */
  awakened?: true;
  /** Space id of the active expedition token. */
  activeExpedition: string;
}
