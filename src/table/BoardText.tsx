import { Text, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { type Group, SRGBColorSpace, type Texture } from "three";
import type { BoardLabels, LabelSlot, LocationArt, Skill } from "../content/types";
import { BOARD_WIDTH } from "./geometry";
import { fitScale, iconGaps } from "./labels";

const FONT = { regular: "/fonts/PT_Serif-Web-Regular.ttf", bold: "/fonts/PT_Serif-Web-Bold.ttf" };
const INK = "#2a1d12";
const SKILLS: Skill[] = ["lore", "influence", "observation", "strength", "will"];
/** Scale of a hovered or selected cut-out. */
const GROW = 1.08;

const srgb = (t: Texture | Texture[]) => {
  for (const tex of Array.isArray(t) ? t : [t]) tex.colorSpace = SRGBColorSpace;
};

export interface BoardTextProps {
  labels: BoardLabels;
  /** Strings of the chosen language. */
  strings: Record<string, string>;
  /** Spaces whose cut-out reacts to the pointer (enabled sets). */
  active: Set<string>;
  selected: string | undefined;
  onSelect: (id: string) => void;
  reducedMotion: boolean;
}

/** Printed board text over the textless board, and the location cut-outs that carry their own text. */
export function BoardText({ labels, strings, active, selected, onSelect, reducedMotion }: BoardTextProps) {
  const k = BOARD_WIDTH / labels.width;
  const icons = useTexture(SKILLS.map((s) => `/icons/${s}.png`), srgb);
  const icon = Object.fromEntries(SKILLS.map((s, i) => [s, icons[i]!])) as Record<Skill, Texture>;
  const at = (x: number, y: number): [number, number] => [(x - labels.width / 2) * k, (labels.height / 2 - y) * k];
  return (
    <>
      {labels.slots.map((s) => {
        const text = strings[s.key];
        if (!text) return null;
        return s.arc ? (
          <ArcLabel key={s.key} slot={s} text={text} k={k} centre={at(s.x, s.y)} />
        ) : (
          <group key={`${s.key}@${s.x}`} position={[...at(s.x + s.w / 2, s.y + s.h / 2), 0.005]}>
            <Label slot={s} text={text} k={k} icon={icon} />
          </group>
        );
      })}
      {labels.locations.map((l) => (
        <Cutout
          key={l.space}
          art={l}
          strings={strings}
          k={k}
          icon={icon}
          position={at(l.x + l.w / 2, l.y + l.h / 2)}
          active={active.has(l.space)}
          selected={l.space === selected}
          onSelect={onSelect}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  );
}

interface LabelProps {
  slot: LabelSlot;
  text: string;
  /** World units per board pixel. */
  k: number;
  icon: Record<Skill, Texture>;
}

/** One string centred on the group origin (the slot centre), wrapped and shrunk to stay inside its slot. */
function Label({ slot, text, k, icon }: LabelProps) {
  const [layout, setLayout] = useState<{ scale: number; icons: { skill: Skill; x: number; y: number }[] }>({ scale: 1, icons: [] });
  const gaps = iconGaps(text);
  const align = slot.align ?? "center";
  const wraps = slot.size !== undefined || (slot.lines ?? 1) > 1;
  const fontSize = (slot.size ?? slot.h / (slot.lines ?? 1)) * k;
  const w = slot.w * k;
  const edge = align === "left" ? -w / 2 : align === "right" ? w / 2 : 0;
  return (
    <group scale={layout.scale} position={[edge, 0, 0]}>
      <Text
        font={slot.bold ? FONT.bold : FONT.regular}
        fontSize={fontSize}
        color={INK}
        anchorX={align}
        anchorY="middle"
        textAlign={align}
        lineHeight={1.15}
        maxWidth={wraps ? w : undefined}
        whiteSpace={wraps ? "normal" : "nowrap"}
        onSync={(mesh) => {
          const info = mesh.textRenderInfo;
          const caret = info.caretPositions as Float32Array;
          // The group scales around the anchor edge, so a block no wider than the slot stays inside it.
          setLayout({
            scale: fitScale(info.blockBounds, w, slot.h * k),
            icons: gaps.icons.map((g) => ({ skill: g.skill, x: (caret[g.index * 4]! + caret[g.index * 4 + 1]!) / 2, y: (caret[g.index * 4 + 2]! + caret[g.index * 4 + 3]!) / 2 })),
          });
        }}
      >
        {gaps.text}
      </Text>
      {layout.icons.map((g, i) => (
        <mesh key={i} position={[g.x, g.y, 0.0005]}>
          <planeGeometry args={[fontSize * 0.95, fontSize * 0.95]} />
          <meshBasicMaterial map={icon[g.skill]} transparent depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Text along a circle, tops facing the centre: a hidden copy measures each glyph, then every glyph is
 * placed at its own angle. Troika's curveRadius bends text into depth, not in the plane.
 */
function ArcLabel({ slot, text, k, centre }: { slot: LabelSlot; text: string; k: number; centre: [number, number] }) {
  const [glyphs, setGlyphs] = useState<{ ch: string; x: number }[]>([]);
  const { radius, angle } = slot.arc!;
  const font = slot.bold ? FONT.bold : FONT.regular;
  const fontSize = slot.h * k;
  return (
    <group position={[...centre, 0.005]}>
      <Text
        visible={false}
        font={font}
        fontSize={fontSize}
        anchorX="center"
        whiteSpace="nowrap"
        onSync={(mesh) => {
          const caret = mesh.textRenderInfo.caretPositions as Float32Array;
          setGlyphs([...text].map((ch, i) => ({ ch, x: (caret[i * 4]! + caret[i * 4 + 1]!) / 2 })));
        }}
      >
        {text}
      </Text>
      {glyphs.map(({ ch, x }, i) => {
        // Image angles run clockwise with y down; moving right along the bottom of the circle lowers the angle.
        const a = (angle * Math.PI) / 180 - x / (radius * k);
        return (
          <Text
            key={i}
            font={font}
            fontSize={fontSize}
            color={INK}
            anchorX="center"
            anchorY="middle"
            position={[Math.cos(a) * radius * k, -Math.sin(a) * radius * k, 0]}
            rotation={[0, 0, Math.PI / 2 - a]}
          >
            {ch}
          </Text>
        );
      })}
    </group>
  );
}

interface CutoutProps {
  art: LocationArt;
  strings: Record<string, string>;
  k: number;
  icon: Record<Skill, Texture>;
  position: [number, number];
  active: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
  reducedMotion: boolean;
}

/** A location's art and text, growing from its centre while hovered or selected. */
function Cutout({ art, strings, k, icon, position, active, selected, onSelect, reducedMotion }: CutoutProps) {
  const texture = useTexture(`/${art.image}`, srgb);
  const group = useRef<Group>(null);
  const [hover, setHover] = useState(false);
  const big = active && (hover || selected);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const goal = big ? GROW : 1;
    const s = reducedMotion ? goal : g.scale.x + (goal - g.scale.x) * Math.min(1, dt * 12);
    g.scale.setScalar(s);
  });
  const handlers = active && {
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHover(true);
    },
    onPointerOut: () => setHover(false),
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onSelect(art.space);
    },
  };
  return (
    // A grown cut-out lifts above its neighbours.
    <group ref={group} position={[...position, big ? 0.006 : 0.004]}>
      <mesh {...handlers}>
        <planeGeometry args={[art.w * k, art.h * k]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} />
      </mesh>
      {art.slots.map((s) => {
        const text = strings[s.key];
        if (!text) return null;
        return (
          <group key={s.key} position={[(s.x + s.w / 2 - art.w / 2) * k, (art.h / 2 - s.y - s.h / 2) * k, 0.001]}>
            <Label slot={s} text={text} k={k} icon={icon} />
          </group>
        );
      })}
    </group>
  );
}
