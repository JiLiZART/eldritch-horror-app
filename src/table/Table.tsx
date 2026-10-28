import { Billboard, Html, Line, MapControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type ComponentRef, Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { SRGBColorSpace, type Texture, Vector3 } from "three";
import { activeGraph } from "../content/board";
import type { Board, BoardLabels, Skill, Space } from "../content/types";
import type { Ticket } from "../engine/types";
import { BoardText } from "./BoardText";
import { BOARD_WIDTH, HELD, SHEET, TABLEAU_ROWS, boardSize, boardToWorld, doomPosition, heldPosition, omenPosition, reservePosition, sheetPosition, spreadOnCircle, tableExtent, tableauPosition } from "./geometry";
import type { Piece, PieceKind } from "./pieces";
import { PATH_COLORS } from "./sets";

export interface TableProps {
  board: Board;
  labels: BoardLabels;
  /** Board strings of the chosen language. */
  strings: Record<string, string>;
  /** Pieces grouped by space id; empty when no game is in progress. */
  pieces: Map<string, Piece[]>;
  /** The doom value, the omen index and the eldritch tokens per omen space; undefined without a game (track-tokens D3). */
  tracks?: { doom: number; omen: number; eldritch: number[]; reserve: string[] };
  /** The Ancient One's card faces beside the board: the sheet, the current mystery and the ongoing mythos cards (tableau D2). */
  tableau?: { sheet: string; mystery?: string; mythos: string[]; tokens: number };
  /** The investigators' sheet faces in seat order, below the board, each with the cards held under it (held-cards D2). */
  sheets?: { image: string; held: string[]; health: number; sanity: number; improvements: Partial<Record<Skill, 1 | 2>>; tickets: Ticket[] }[];
  /** Changes each time the player asks for the whole table; the view glides out to it (fit-view D1). */
  fit?: number;
  enabled: Set<string>;
  selected: string | undefined;
  /** Spaces of the travel route being picked, highlighted in order. */
  route?: string[];
  onSelect: (id: string | undefined) => void;
  reducedMotion: boolean;
}

const srgb = (t: Texture | Texture[]) => {
  for (const tex of Array.isArray(t) ? t : [t]) {
    tex.colorSpace = SRGBColorSpace;
    tex.needsUpdate = true;
  }
};

export function Table(props: TableProps) {
  return (
    <Canvas flat orthographic camera={{ position: [0, 0, 50], up: [0, 0, 1], near: 0.1, far: 100 }} onPointerMissed={() => props.onSelect(undefined)}>
      <color attach="background" args={["#1a1612"]} />
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
  );
}

function Scene({ board, labels, strings, pieces, tracks, tableau, sheets, fit, enabled, selected, route, onSelect, reducedMotion }: TableProps) {
  const graph = useMemo(() => activeGraph(board, enabled), [board, enabled]);
  const at = useMemo(() => new Map(board.spaces.map((s) => [s.id, boardToWorld(s, board)])), [board]);
  const active = useMemo(() => new Set(graph.spaces.map((s) => s.id)), [graph]);
  /** The card face last clicked, read until the selection changes (card-focus D1); `key` makes a repeated click glide again. */
  const [focus, setFocus] = useState<{ position: [number, number]; size: [number, number]; key: number; forSelected: string | undefined }>();
  const onFocus: FaceProps["onFocus"] = (position, size) => setFocus((prev) => ({ position, size, key: (prev?.key ?? 0) + 1, forSelected: selected }));
  const focused = focus?.forSelected === selected ? focus : undefined;
  const extent = useMemo(() => tableExtent(board, { tableau: tableau !== undefined, sheets: sheets?.length ?? 0, heldRows: Math.max(0, ...(sheets ?? []).map((s) => Math.ceil(s.held.length / 3))) }), [board, tableau, sheets]);
  // A fit request outranks the focus and the selection until either changes (fit-view D1).
  const fitSeen = useRef<{ key: number; selected: string | undefined; focusKey: number | undefined }>(undefined);
  if (fit && fitSeen.current?.key !== fit) fitSeen.current = { key: fit, selected, focusKey: focus?.key };
  const fitting = !!fit && fitSeen.current?.selected === selected && fitSeen.current?.focusKey === focus?.key;
  const target = useMemo<CameraTarget | undefined>(
    () =>
      fitting
        ? { position: [(extent.minX + extent.maxX) / 2, (extent.minY + extent.maxY) / 2], fit: true, key: fit }
        : focused
          ? { position: focused.position, size: focused.size, key: focused.key }
          : selected && at.has(selected)
            ? { position: at.get(selected)! }
            : undefined,
    [fitting, fit, extent, focused, selected, at],
  );
  return (
    <>
      <CameraRig extent={extent} target={target} reducedMotion={reducedMotion} />
      <BoardPlane board={board} />
      <BoardText labels={labels} strings={strings} active={active} selected={selected} onSelect={onSelect} reducedMotion={reducedMotion} />
      {graph.paths.map((p) => (
        <Line key={`${p.from}-${p.to}`} points={[[...at.get(p.from)!, 0.01], [...at.get(p.to)!, 0.01]]} color={PATH_COLORS[p.type]} lineWidth={2} />
      ))}
      {graph.spaces.map((s) => (
        <Marker key={s.id} space={s} position={at.get(s.id)!} selected={s.id === selected} onRoute={route?.includes(s.id) ?? false} onSelect={onSelect} />
      ))}
      {pieces.size > 0 && <Pieces pieces={pieces} at={at} />}
      {tracks && <Tracks board={board} tracks={tracks} />}
      {tracks && tracks.reserve.length > 0 && <Reserve board={board} images={tracks.reserve} onFocus={onFocus} />}
      {tableau && <Tableau board={board} tableau={tableau} onFocus={onFocus} />}
      {sheets && sheets.length > 0 && <Sheets board={board} sheets={sheets} onFocus={onFocus} />}
    </>
  );
}

/** Where the camera glides: a point, and for a card its height so the view zooms to read it (card-focus D2). */
interface CameraTarget {
  position: [number, number];
  /** A card's `[width, height]`; the view zooms until it fills most of the view. */
  size?: [number, number];
  /** The whole table: the view zooms out to the limit (fit-view D1). */
  fit?: true;
  key?: number;
}

/** Top-down orthographic view: zoom bounded so the whole table fits, pan kept within it, no rotation (pan-clamp D2). */
function CameraRig({ extent, target, reducedMotion }: { extent: ReturnType<typeof tableExtent>; target: CameraTarget | undefined; reducedMotion: boolean }) {
  const { size, camera } = useThree();
  const controls = useRef<ComponentRef<typeof MapControls>>(null);
  const minZoom = Math.min(size.width / (extent.maxX - extent.minX), size.height / (extent.maxY - extent.minY)) * 0.95;
  /** Keeps the view inside the table: the half view stays within the extent, or sits at its centre when wider. */
  const clamp = () => {
    const c = controls.current;
    if (!c) return;
    const halfW = size.width / (2 * camera.zoom);
    const halfH = size.height / (2 * camera.zoom);
    const within = (v: number, lo: number, hi: number) => (lo > hi ? (lo + hi) / 2 : Math.min(Math.max(v, lo), hi));
    const delta = new Vector3(within(c.target.x, extent.minX + halfW, extent.maxX - halfW) - c.target.x, within(c.target.y, extent.minY + halfH, extent.maxY - halfH) - c.target.y, 0);
    if (delta.lengthSq() === 0) return;
    c.target.add(delta);
    c.object.position.add(delta);
  };
  // Start fully zoomed out; MapControls keeps user zoom within [minZoom, maxZoom] from then on.
  useEffect(() => {
    camera.zoom = minZoom;
    camera.updateProjectionMatrix();
  }, [camera, minZoom]);
  const goal = useMemo(() => (target ? new Vector3(target.position[0], target.position[1], 0) : undefined), [target]);
  const zoomGoal = target?.fit ? minZoom : target?.size ? Math.min(Math.max(Math.min(size.width / (target.size[0] * 1.2), size.height / (target.size[1] * 1.2)), minZoom), minZoom * 10) : undefined;
  // One glide per new target; a drag ends it, so the player's panning holds afterwards (camera-release D1).
  const gliding = useRef(false);
  useEffect(() => {
    gliding.current = goal !== undefined;
  }, [goal]);
  useFrame((_, dt) => {
    const c = controls.current;
    if (!c || !goal || !gliding.current) return;
    const step = reducedMotion ? 1 : Math.min(1, dt * 6);
    const before = c.target.clone();
    const delta = goal.clone().sub(c.target).multiplyScalar(step);
    c.target.add(delta);
    c.object.position.add(delta);
    if (zoomGoal !== undefined) {
      camera.zoom += (zoomGoal - camera.zoom) * step;
      camera.updateProjectionMatrix();
    }
    clamp();
    c.update();
    // Settled once neither the view nor the zoom moves any more; the clamp may stop the glide short of the goal.
    const zoomLeft = zoomGoal === undefined ? 0 : Math.abs(camera.zoom - zoomGoal) / zoomGoal;
    if (c.target.distanceTo(before) < 0.0001 && zoomLeft < 0.001) gliding.current = false;
  });
  return (
    <MapControls
      ref={controls}
      makeDefault
      onStart={() => {
        gliding.current = false;
      }}
      onChange={clamp}
      enableRotate={false}
      enableDamping={!reducedMotion}
      screenSpacePanning
      zoomToCursor
      minZoom={minZoom}
      maxZoom={minZoom * 10}
      minPolarAngle={0}
      maxPolarAngle={0}
    />
  );
}

function BoardPlane({ board }: { board: Board }) {
  const texture = useTexture(`/${board.texture}`, srgb);
  texture.anisotropy = 8;
  return (
    <mesh>
      <planeGeometry args={boardSize(board)} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

interface MarkerProps {
  space: Space;
  position: [number, number];
  selected: boolean;
  /** Part of the travel route being picked. */
  onRoute: boolean;
  onSelect: (id: string) => void;
}

function Marker({ space, position, selected, onRoute, onSelect }: MarkerProps) {
  const big = selected || onRoute;
  return (
    <mesh
      position={[...position, 0.02]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(space.id);
      }}
    >
      <ringGeometry args={[big ? 0.14 : 0.1, big ? 0.2 : 0.14, 32]} />
      <meshBasicMaterial color={onRoute ? "#ffd400" : selected ? "#ffffff" : "#ff00ff"} />
    </mesh>
  );
}

/** Plane size per piece kind in world units; tokens are square, pawns keep the standee aspect. */
const SIZE: Record<PieceKind, [width: number, height: number]> = {
  gate: [0.3, 0.3],
  expedition: [0.3, 0.3],
  clue: [0.22, 0.22],
  rumor: [0.22, 0.22],
  eldritch: [0.22, 0.22],
  monster: [0.3, 0.3],
  pawn: [0.26, 0.26 * (488 / 339)],
  lead: [0.22, 0.22],
};

function Pieces({ pieces, at }: { pieces: Map<string, Piece[]>; at: Map<string, [number, number]> }) {
  const damageToken = (n: number) => `${TOKENS}/health/health-0${Math.min(9, n)}.webp`;
  const images = useMemo(() => [...new Set([...pieces.values()].flat().flatMap((p) => (p.damage ? [p.image, damageToken(p.damage)] : [p.image])))], [pieces]);
  const textures = useTexture(images.map((i) => `/${i}`), srgb);
  const textureOf = new Map(images.map((img, i) => [img, textures[i]]));
  /** The piece under the pointer, whose label floats beside it (piece-hover D1). */
  const [hovered, setHovered] = useState<string>();
  return (
    <>
      {[...pieces].flatMap(([space, list]) => {
        const [x, y] = at.get(space)!;
        // Radius grows with the count so a crowded space stays readable.
        const offsets = spreadOnCircle(list.length, 0.15 + 0.03 * list.length);
        return list.map((p, k) => {
          const [w, h] = SIZE[p.kind];
          const [dx, dy] = offsets[k]!;
          /** Half the piece's standing height: a pawn's foot rests on the space, the label floats above the top. */
          const half = (p.lying ? w : h) / 2;
          return (
            <group key={p.id}>
              {/* A flat ring on the table under the pawn whose turn it is (active-pawn-ring D2). */}
              {p.active && (
                <mesh position={[x + dx, y + dy, 0.02]}>
                  <ringGeometry args={[0.14, 0.2, 32]} />
                  <meshBasicMaterial color="#e8c872" />
                </mesh>
              )}
              <Billboard position={[x + dx, y + dy + (p.kind === "pawn" ? half : 0), 0.05 + k * 0.001]}>
              {/* A lying pawn turns a quarter turn in the billboard's plane, so the standee rests sideways on the board (design D2). */}
              <mesh rotation={[0, 0, p.lying ? Math.PI / 2 : 0]} onPointerOver={() => setHovered(p.id)} onPointerOut={() => setHovered((h) => (h === p.id ? undefined : h))}>
                <planeGeometry args={[w, h]} />
                <meshBasicMaterial map={textureOf.get(p.image)} transparent alphaTest={0.5} />
              </mesh>
              {p.damage && (
                <mesh position={[0.08, -0.08, 0.002]}>
                  <planeGeometry args={[0.14, (0.14 * 386) / 365]} />
                  <meshBasicMaterial map={textureOf.get(damageToken(p.damage))} transparent alphaTest={0.5} />
                </mesh>
              )}
              {hovered === p.id && (
                <Html position={[0, half + 0.05, 0]} center style={{ pointerEvents: "none" }}>
                  <span className="piece-label">
                    {p.label}
                    {p.hint && <small>{p.hint}</small>}
                  </span>
                </Html>
              )}
            </Billboard>
            </group>
          );
        });
      })}
    </>
  );
}

const TOKENS = "cards/eh01/tokens";

/** The doom and omen tokens on their printed tracks, with the eldritch tokens fanned beside their omen space (design D3). */
function Tracks({ board, tracks }: { board: Board; tracks: NonNullable<TableProps["tracks"]> }) {
  const [doom, omen, eldritch] = useTexture([`/${TOKENS}/doom-token.webp`, `/${TOKENS}/omen-token.webp`, `/${TOKENS}/eldritch-token.webp`], srgb);
  const token = (map: Texture, [x, y]: [number, number], size: number, key: string, z = 0.06) => (
    <Billboard key={key} position={[x, y, z]}>
      <mesh>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial map={map} transparent alphaTest={0.5} />
      </mesh>
    </Billboard>
  );
  return (
    <>
      {token(doom!, doomPosition(board, tracks.doom), 0.3, "doom")}
      {token(omen!, omenPosition(board, tracks.omen), 0.3, "omen", 0.07)}
      {tracks.eldritch.flatMap((count, i) => {
        const [x, y] = omenPosition(board, i);
        return spreadOnCircle(count, 0.14).map(([dx, dy], k) => token(eldritch!, [x + dx, y + dy], 0.16, `eldritch-${i}-${k}`, 0.08 + k * 0.001));
      })}
    </>
  );
}

/** Asset cards are portrait, 478 by 745. */
const CARD_ASPECT = 745 / 478;

/** The reserve cards' faces in the printed slots, in reserve order (reserve-slots D3). */
function Reserve({ board, images, onFocus }: { board: Board; images: string[]; onFocus: FaceProps["onFocus"] }) {
  const textures = useTexture(images.map((i) => `/${i}`), srgb);
  const w = board.tracks.reserve.width * BOARD_WIDTH;
  return (
    <>
      {textures.map((map, i) => (
        <Face key={images[i]} map={map} position={reservePosition(board, i)} size={[w, w * CARD_ASPECT]} onFocus={onFocus} />
      ))}
    </>
  );
}

interface FaceProps {
  map: Texture;
  position: [number, number];
  size: [number, number];
  /** A click brings the card up to read: its centre and size (card-focus D1). */
  onFocus: (position: [number, number], size: [number, number]) => void;
}

/** One card face lying flat on the table. */
function Face({ map, position, size, onFocus }: FaceProps) {
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // A drag that starts on the card ends with a click event too; only a still pointer brings the card up.
    if (e.delta <= 4) onFocus(position, size);
  };
  return (
    <Billboard position={[...position, 0.06]}>
      <mesh onClick={click}>
        <planeGeometry args={size} />
        <meshBasicMaterial map={map} transparent alphaTest={0.5} />
      </mesh>
    </Billboard>
  );
}

/** The Ancient One sheet, the current mystery and the ongoing mythos cards in a column right of the board (tableau D2). */
function Tableau({ board, tableau, onFocus }: { board: Board; tableau: NonNullable<TableProps["tableau"]>; onFocus: FaceProps["onFocus"] }) {
  const mysteryToken = `${TOKENS}/mystery-token.webp`;
  const images = [tableau.sheet, ...(tableau.mystery ? [tableau.mystery] : []), ...tableau.mythos, mysteryToken];
  const textures = useTexture(images.map((i) => `/${i}`), srgb);
  const textureOf = new Map(images.map((img, i) => [img, textures[i]!]));
  const [mx, my] = tableauPosition(board, 2);
  const [mw] = TABLEAU_ROWS[2]!;
  const [cx, cy] = tableauPosition(board, 1);
  return (
    <>
      <Face map={textureOf.get(tableau.sheet)!} position={tableauPosition(board, 0)} size={TABLEAU_ROWS[0]!} onFocus={onFocus} />
      {tableau.mystery && <Face map={textureOf.get(tableau.mystery)!} position={tableauPosition(board, 1)} size={TABLEAU_ROWS[1]!} onFocus={onFocus} />}
      {tableau.mystery &&
        spreadOnCircle(tableau.tokens, 0.17).map(([dx, dy], n) => (
          // The tokens the mystery has collected, fanned on the art corner of its card so the text stays readable (mystery-card-tokens D1).
          <mesh key={`token#${n}`} position={[cx + 0.85 + dx, cy + 0.38 + dy, 0.07]}>
            <planeGeometry args={[0.26, 0.26]} />
            <meshBasicMaterial map={textureOf.get(mysteryToken)} transparent alphaTest={0.5} />
          </mesh>
        ))}
      {tableau.mythos.map((img, i) => (
        <Face key={`${img}#${i}`} map={textureOf.get(img)!} position={[mx - TABLEAU_ROWS[0]![0] / 2 + mw / 2 + i * (mw + 0.1), my]} size={TABLEAU_ROWS[2]!} onFocus={onFocus} />
      ))}
    </>
  );
}

/** The investigators' sheets in a row below the board, in seat order, each with its held cards under it (investigator-sheets D2, held-cards D2). */
function Sheets({ board, sheets, onFocus }: { board: Board; sheets: NonNullable<TableProps["sheets"]>; onFocus: FaceProps["onFocus"] }) {
  const healthToken = (n: number) => `${TOKENS}/health/health-0${Math.min(9, Math.max(0, n))}.webp`;
  const sanityToken = (n: number) => `${TOKENS}/sanity/sanity-0${Math.min(9, Math.max(0, n))}.webp`;
  const skillToken = (skill: Skill) => `${TOKENS}/improvements/${skill}.webp`;
  const ticketToken = (ticket: Ticket) => `${TOKENS}/travel/${ticket}.webp`;
  const images = [...new Set(sheets.flatMap((s) => [s.image, ...s.held, healthToken(s.health), sanityToken(s.sanity), ...Object.keys(s.improvements).map((k) => skillToken(k as Skill)), ...s.tickets.map(ticketToken)]))];
  const textures = useTexture(images.map((i) => `/${i}`), srgb);
  const textureOf = new Map(images.map((img, i) => [img, textures[i]!]));
  /** A token on the sheet at `(fx, fy)` of the sheet from its top-left, `size` wide and high, `lift` above the sheet (sheet-tokens D1, skill-and-ticket-tokens D1). */
  const token = (seat: number, image: string, fx: number, fy: number, size: [number, number], lift = 0) => {
    const [x, y] = sheetPosition(board, seat);
    return (
      <mesh key={`${image}@${fx},${fy},${lift}`} position={[x - SHEET[0] / 2 + fx * SHEET[0] + lift, y + SHEET[1] / 2 - fy * SHEET[1] + lift, 0.07 + lift]}>
        <planeGeometry args={size} />
        <meshBasicMaterial map={textureOf.get(image)} transparent alphaTest={0.5} />
      </mesh>
    );
  };
  const STAMP: [number, number] = [0.38, (0.38 * 386) / 365];
  const SKILL_X: Record<Skill, number> = { lore: 0.123, influence: 0.29, observation: 0.458, strength: 0.626, will: 0.793 };
  return (
    <>
      {sheets.map((s, seat) => (
        <group key={`${s.image}#${seat}`}>
          <Face map={textureOf.get(s.image)!} position={sheetPosition(board, seat)} size={SHEET} onFocus={onFocus} />
          {token(seat, healthToken(s.health), 0.635, 0.575, STAMP)}
          {token(seat, sanityToken(s.sanity), 0.848, 0.575, STAMP)}
          {(Object.entries(s.improvements) as [Skill, 1 | 2][]).flatMap(([skill, level]) => Array.from({ length: level }, (_, n) => token(seat, skillToken(skill), SKILL_X[skill], 0.888, [0.3, 0.3], n * 0.1)))}
          {s.tickets.map((t, n) => token(seat, ticketToken(t), 0.93, 0.07 + n * 0.1, [0.26, (0.26 * 221) / 450], n * 0.001))}
          {s.held.map((img, i) => (
            <Face key={`${img}#${i}`} map={textureOf.get(img)!} position={heldPosition(board, seat, i)} size={HELD} onFocus={onFocus} />
          ))}
        </group>
      ))}
    </>
  );
}
