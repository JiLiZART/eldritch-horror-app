import type { Skill } from "../content/types";

const SKILLS = new Set<string>(["lore", "influence", "observation", "strength", "will"]);
/** Em space: one glyph-wide gap an icon is drawn into. */
const GAP = "\u2003";

/** Uniform scale (at most 1) that brings a laid-out text block of `[minX, minY, maxX, maxY]` inside `w` x `h`. */
export function fitScale([minX, minY, maxX, maxY]: readonly [number, number, number, number], w: number, h: number): number {
  return Math.min(1, w / (maxX - minX), h / (maxY - minY));
}

/** Replaces `{skill}` placeholders with a gap character and reports where each icon goes. */
export function iconGaps(source: string): { text: string; icons: { skill: Skill; index: number }[] } {
  const icons: { skill: Skill; index: number }[] = [];
  let text = "";
  for (const part of source.split(/(\{[a-z]+\})/)) {
    const skill = part.slice(1, -1);
    if (part.startsWith("{") && SKILLS.has(skill)) {
      icons.push({ skill: skill as Skill, index: text.length });
      text += GAP;
    } else text += part;
  }
  return { text, icons };
}
