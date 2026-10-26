/** Static game content. Nothing here is runtime state. */

export type SetId = "eh01" | "eh02" | "eh03" | "eh04" | "eh05" | "eh06" | "eh07" | "eh08" | "eh09";

export interface Localized {
  en: string;
  ru: string;
}

export type SpaceKind = "city" | "wilderness" | "sea";
export type Region = "america" | "europe" | "asia";
export type PathType = "train" | "ship" | "uncharted" | "local";
/** Omen track colours; the green and red spaces are the comet and the ring. */
export type OmenColor = "green" | "blue" | "red";

export interface Space {
  id: string;
  name: Localized;
  kind: SpaceKind;
  /** Encounter region for cities and wilderness; absent on seas and side-board spaces. */
  region?: Region;
  /** Printed number for numbered spaces. */
  number?: number;
  /** The set that activates this space. Core spaces are "eh01". */
  set: SetId;
  /** Omen colour printed on the city's gate token; only these cities enter the gate stack. */
  gate?: OmenColor;
  /** Normalized coordinates on the board texture, 0..1 from the top-left corner. */
  x: number;
  y: number;
}

export interface Path {
  from: string;
  to: string;
  type: PathType;
}

export interface Board {
  source: { file: string; width: number; height: number };
  /** Path under public/. */
  texture: string;
  spaces: Space[];
  paths: Path[];
}

export type Skill = "lore" | "influence" | "observation" | "strength" | "will";
export type Skills = Record<Skill, number>;

export interface Images {
  /** Paths under public/. */
  front: string;
  back?: string;
}

export interface Investigator {
  id: string;
  name: string;
  health: number;
  sanity: number;
  skills: Skills;
  startingSpace: string;
  starting: {
    clues?: number;
    focus?: number;
    resources?: number;
    /** Card ids. */
    assets?: string[];
    spells?: string[];
    uniqueAssets?: string[];
    conditions?: string[];
  };
  personalStory: string;
  images: Images;
  pawn: string;
}

export type MythosColor = "green" | "yellow" | "blue";
export type MythosStage = Record<MythosColor, number>;

export interface NamedCard {
  id: string;
  name: string;
  images: Images;
}

export interface AncientOne {
  id: string;
  name: string;
  doom: number;
  images: Images;
  mysteries: NamedCard[];
  research: NamedCard[];
  special?: NamedCard[];
  mythos: { stage1: MythosStage; stage2: MythosStage; stage3: MythosStage };
  /** Printed sheet setup. Text effects are not modelled. */
  setup?: {
    /** Monster id -> tokens removed from the cup at setup. */
    setAsideMonsters?: Record<string, number>;
    /** Eldritch tokens placed on the green omen space at setup. */
    eldritchTokensOnOmen?: number;
  };
}

export type Deck = "asset" | "spell" | "condition" | "artifact" | "unique-asset";

export interface Card {
  id: string;
  name: string;
  deck: Deck;
  images: Images;
  traits?: string[];
}

export interface Monster {
  id: string;
  name: string;
  epic?: boolean;
  /** Identical tokens in the set; 1 when absent. */
  count?: number;
  /** Space id the token back moves the monster to when spawned. */
  spawnMoveTo?: string;
  images: Images;
}

export type EncounterKind = "location" | "general" | "other-world" | "expedition";

export interface EncounterDeck {
  id: string;
  kind: EncounterKind;
  region?: Region;
  cards: NamedCard[];
}

export type MythosTrait = "event" | "ongoing";
/** Icon ids from content/rules/enums.json mythosEffects, in printed order. */
export type MythosEffect = "advance-omen" | "reckoning" | "spawn-gates" | "monster-surge" | "spawn-clues" | "place-rumor" | "place-eldritch-tokens" | "resolve-text";

export interface MythosCard {
  id: string;
  name: string;
  color: MythosColor;
  difficulty: "easy" | "medium" | "hard";
  trait: MythosTrait;
  effects: MythosEffect[];
  images: Images;
}

export interface GameSet {
  id: SetId;
  name: string;
  investigators: Investigator[];
  ancientOnes: AncientOne[];
  cards: Card[];
  monsters: Monster[];
  encounterDecks: EncounterDeck[];
  mythos: MythosCard[];
  preludes: NamedCard[];
}

export interface IconEntry {
  file: string;
  width: number;
  height: number;
  source: string;
  page: number;
}

export interface IconManifest {
  icons: Record<string, IconEntry>;
  dice: { file: string; source: string };
}
