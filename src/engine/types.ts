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
  /** Travel tickets held, at most 2. */
  tickets: Ticket[];
}

export type ActionName = "travel" | "rest" | "prepare-for-travel" | "trade";

/** The phase in progress; one member today, later phases extend the union. */
export interface ActionPhase {
  name: "action";
  /** Investigator id whose turn it is. */
  active: string;
  /** Actions the active investigator has performed this phase. */
  taken: ActionName[];
}

/** Printed on the reference card for the investigator count. */
export interface ReferenceCard {
  gates: number;
  clues: number;
  surge: number;
}

export interface GameState {
  seed: number;
  difficulty: Difficulty;
  ancientOne: string;
  doom: number;
  /** Index on the omen track; 0 is the green comet space. */
  omen: number;
  /** Eldritch tokens per omen track space. */
  eldritchOnOmen: [number, number, number, number];
  referenceCard: ReferenceCard;
  round: number;
  phase: ActionPhase;
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
  currentMystery: string;
  /** Space id of the active expedition token. */
  activeExpedition: string;
}
