/**
 * Hand-typed from the core monster token backs (public/cards/eh01/monster/<name>-back.webp):
 * the Will test modifier and horror, the Strength test modifier and damage, and the toughness.
 * A missing test is one the token does not print; a missing toughness is printed as a formula
 * (epic: investigators + N) or, for the Cultist, on the Ancient One sheet. Token text is not modelled.
 */
import type { MonsterCombat } from "../src/content/types";

const w = (modifier: number, horror: number) => ({ modifier, horror });
const s = (modifier: number, damage: number) => ({ modifier, damage });

export const monsterStats: Record<string, MonsterCombat> = {
  "eh01/monster/byakhee": { will: w(0, 1), strength: s(0, 2), toughness: 2 },
  "eh01/monster/color-out-of-space": { will: w(0, 2), toughness: 2 },
  "eh01/monster/cthonian": { will: w(-1, 2), strength: s(-2, 3), toughness: 4 },
  "eh01/monster/cthulhu": { will: w(-2, 5), strength: s(-2, 4) },
  "eh01/monster/cthylla": { will: w(-1, 4), strength: s(-2, 2) },
  "eh01/monster/cultist": { onAncientOneSheet: true },
  "eh01/monster/dark-young": { will: w(-1, 3), strength: s(-3, 3), toughness: 5 },
  "eh01/monster/deep-one": { will: w(0, 2), strength: s(-1, 1), toughness: 2 },
  "eh01/monster/dunwich-horror": { will: w(-1, 3), strength: s(-2, 3) },
  "eh01/monster/elder-thing": { will: w(0, 3), strength: s(-1, 2), toughness: 3 },
  "eh01/monster/ghost": { will: w(-1, 2), toughness: 2 },
  "eh01/monster/ghoul": { will: w(1, 1), strength: s(0, 2), toughness: 1 },
  "eh01/monster/gnoph-keh": { will: w(0, 1), strength: s(-2, 2), toughness: 3 },
  "eh01/monster/goat-spawn": { will: w(0, 1), strength: s(-2, 2), toughness: 2 },
  "eh01/monster/gug": { will: w(0, 2), strength: s(-2, 3), toughness: 4 },
  "eh01/monster/hound-of-tindalos": { will: w(0, 2), strength: s(-1, 3), toughness: 3 },
  "eh01/monster/lloigor": { will: w(0, 2), strength: s(-2, 3), toughness: 4 },
  "eh01/monster/maniac": { will: w(1, 1), strength: s(-1, 2), toughness: 1 },
  "eh01/monster/mi-go": { will: w(0, 1), strength: s(-2, 2), toughness: 3 },
  "eh01/monster/mummy": { will: w(0, 2), strength: s(-2, 2), toughness: 3 },
  "eh01/monster/nightgaunt": { will: w(0, 2), strength: s(-2, 1), toughness: 2 },
  "eh01/monster/nug": { will: w(-1, 2), strength: s(-2, 4) },
  "eh01/monster/riot": { strength: s(-3, 3), toughness: 3 },
  "eh01/monster/serpent-people": { will: w(0, 2), strength: s(-1, 3), toughness: 2 },
  "eh01/monster/shoggoth": { will: w(0, 3), strength: s(-2, 2), toughness: 4 },
  "eh01/monster/shub-niggurath": { will: w(-1, 4), strength: s(-3, 5) },
  "eh01/monster/skeleton": { will: w(0, 2), strength: s(-2, 1), toughness: 2 },
  "eh01/monster/spinner-of-webs": { will: w(0, 2), strength: s(-2, 2) },
  "eh01/monster/star-spawn": { will: w(-1, 3), strength: s(-3, 3), toughness: 5 },
  "eh01/monster/tick-tock-men": { strength: s(-2, 3) },
  "eh01/monster/vampire": { will: w(0, 1), strength: s(-2, 2), toughness: 3 },
  "eh01/monster/warlock": { will: w(0, 1), strength: s(-1, 1), toughness: 1 },
  "eh01/monster/wind-walker": { will: w(0, 2), strength: s(-2, 2) },
  "eh01/monster/witch": { will: w(-1, 0), strength: s(-1, 1), toughness: 1 },
  "eh01/monster/wraith": { will: w(-1, 2), strength: s(-1, 2), toughness: 3 },
  "eh01/monster/zombie": { will: w(0, 1), strength: s(-1, 2), toughness: 2 },
  "eh01/monster/zombie-horde": { will: w(0, 2), strength: s(-3, 3), toughness: 5 },
};

/** The Cultist row printed on each Ancient One sheet (public/cards/eh01/ancient-one/<name>/sheet.webp). */
export const cultists: Record<string, MonsterCombat> = {
  Azathoth: { will: w(0, 1), toughness: 1 },
  Cthulhu: { strength: s(0, 1), toughness: 1 },
  "Shub-Niggurath": { strength: s(-1, 1), toughness: 1 },
  "Yog-Sothoth": { strength: s(0, 1), toughness: 1 },
};
