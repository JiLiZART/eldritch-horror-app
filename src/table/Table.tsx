import { Billboard, Html, Line, MapControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type ComponentRef, createContext, Suspense, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { SRGBColorSpace, type Texture, Vector3 } from "three";
import { activeGraph } from "../content/board";
import type { Board, BoardLabels, Skill, Space } from "../content/types";
import type { Ticket } from "../engine/types";
import { BoardText } from "./BoardText";
import { BOARD_WIDTH, HELD, SHEET, TABLEAU_ROWS, boardSize, boardToWorld, doomPosition, encounterPosition, heldPosition, omenPosition, reservePosition, sheetPosition, spreadOnCircle, tableExtent, tableauPosition } from "./geometry";
import type { Piece, PieceKind } from "./pieces";
import { badgeEvents } from "./badge";
import { PATH_COLORS } from "./sets";

/** A card face on the table: its image under public/ and the name its hover badge shows (card-hover D1). */
export interface CardFace {
  image: string;
  label: string;
  /** The printed back, when the card has one; a further click on the card brought up turns it over (card-flip D1). */
  back?: string;
}

/** The position of the card brought up to read, so that card alone answers a further click (card-flip D2). */
const FocusedAt = createContext<[number, number] | undefined>(undefined);

export interface TableProps {
  board: Board;
  labels: BoardLabels;
  /** Board strings of the chosen language. */
  strings: Record<string, string>;
  /** Pieces grouped by space id; empty when no game is in progress. */
  pieces: Map<string, Piece[]>;
  /** The doom value, the omen index and the eldritch tokens per omen space; undefined without a game (track-tokens D3). */
  tracks?: { doom: number; omen: number; eldritch: number[]; reserve: CardFace[]; labels: { doom: string; omen: string; eldritch: string[] } };
  /** The Ancient One's card faces beside the board: the sheet, the current mystery and the ongoing mythos cards (tableau D2). */
  tableau?: { sheet: CardFace; mystery?: CardFace; mythos: CardFace[]; tokens: number };
  /** The investigators' sheet faces in seat order, below the board, each with the cards held under it (held-cards D2). */
  sheets?: { sheet: CardFace; held: CardFace[]; health: number; sanity: number; improvements: Partial<Record<Skill, 1 | 2>>; tickets: Ticket[]; encounter?: CardFace }[];
  /** Changes each time the player asks for the whole table; the view glides out to it (fit-view D1). */
  fit?: number;
  /** The round, phase and active investigator, or the outcome, and the last journal line, shown in the table's corner (table-status-line D1, table-ticker D1). */
  status?: { line: string; last?: string; dice?: string };
  /** A keyboard pan (fractions of the view) and zoom factor, applied once per key (keyboard-pan-zoom D1). */
  nudge?: { dx: number; dy: number; zoom: number; key: number };
  /** A card named by its place on the table, brought up as a click on it would (panel-card-focus D1). */
  focus?: { place: "reserve" | "mystery" | "mythos" | "sheet" | "held" | "encounter"; index: number; seat?: number; key: number };
  enabled: Set<string>;
  selected: string | undefined;
  /** Spaces of the travel route being picked, highlighted in order. */
  route?: string[];
  onSelect: (id: string | undefined) => void;
  /** A double-click on empty table asks for the whole table (double-click-fit D1). */
  onFit: () => void;
  /** Told when a card is brought up by a click on the table, so Escape can put it down (escape-refits D1). */
  onCardUp: () => void;
  reducedMotion: boolean;
}

const srgb = (t: Texture | Texture[]) => {
  for (const tex of Array.isArray(t) ? t : [t]) {
    tex.colorSpace = SRGBColorSpace;
    tex.needsUpdate = true;
  }
};

export function Table(props: TableProps) {
  /** Set by a click that hit nothing, read by the double-click that follows it (double-click-fit D1). */
  const missed = useRef(false);
  return (
    <>
      {props.status && (
        <div className="table-status">
          {props.status.line}
          {props.status.last && <small>{props.status.last}</small>}
          {props.status.dice && <small>{props.status.dice}</small>}
        </div>
      )}
      <Canvas
        flat
        orthographic
        camera={{ position: [0, 0, 50], up: [0, 0, 1], near: 0.1, far: 100 }}
        onPointerMissed={() => {
          missed.current = true;
          props.onSelect(undefined);
        }}
        onDoubleClick={() => {
          if (missed.current) props.onFit();
          missed.current = false;
        }}
        onClick={() => {
          // A click that hit a piece or a card never set the flag; clear a stale one from an earlier miss.
          setTimeout(() => (missed.current = false), 400);
        }}
      >
      <color attach="background" args={["#1a1612"]} />
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
    </>
  );
}

function Scene({ board, labels, strings, pieces, tracks, tableau, sheets, fit, focus: asked, nudge, enabled, selected, route, onSelect, onCardUp, reducedMotion }: TableProps) {
  const graph = useMemo(() => activeGraph(board, enabled), [board, enabled]);
  const at = useMemo(() => new Map(board.spaces.map((s) => [s.id, boardToWorld(s, board)])), [board]);
  const active = useMemo(() => new Set(graph.spaces.map((s) => s.id)), [graph]);
  /** The card face last clicked, read until the selection changes (card-focus D1); `key` makes a repeated click glide again. */
  const [focus, setFocus] = useState<{ position: [number, number]; size: [number, number]; key: number; forSelected: string | undefined }>();
  const onFocus: FaceProps["onFocus"] = (position, size) => {
    setFocus((prev) => ({ position, size, key: (prev?.key ?? 0) + 1, forSelected: selected }));
    onCardUp();
  };
  const focused = focus?.forSelected === selected ? focus : undefined;
  // A card asked for from the panel resolves to the same focus a click on it makes (panel-card-focus D1).
  useEffect(() => {
    if (!asked) return;
    const mythosRow = (i: number): [number, number] => {
      const [mx, my] = tableauPosition(board, 2);
      const mw = TABLEAU_ROWS[2]![0];
      return [mx - TABLEAU_ROWS[0]![0] / 2 + mw / 2 + i * (mw + 0.1), my];
    };
    const reserveW = board.tracks.reserve.width * BOARD_WIDTH;
    const at: Record<typeof asked.place, () => [[number, number], [number, number]]> = {
      reserve: () => [reservePosition(board, asked.index), [reserveW, reserveW * CARD_ASPECT]],
      mystery: () => [tableauPosition(board, 1), TABLEAU_ROWS[1]!],
      mythos: () => [mythosRow(asked.index), TABLEAU_ROWS[2]!],
      sheet: () => [sheetPosition(board, asked.index), SHEET],
      held: () => [heldPosition(board, asked.seat ?? 0, asked.index), HELD],
      encounter: () => [encounterPosition(board, asked.seat ?? 0), HELD],
    };
    const [position, size] = at[asked.place]();
    onFocus(position, size);
  }, [asked?.key]);
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
      <CameraRig extent={extent} target={target} nudge={nudge} reducedMotion={reducedMotion} />
      <BoardPlane board={board} />
      <BoardText labels={labels} strings={strings} active={active} selected={selected} onSelect={onSelect} reducedMotion={reducedMotion} />
      {graph.paths.map((p) => (
        <Line key={`${p.from}-${p.to}`} points={[[...at.get(p.from)!, 0.01], [...at.get(p.to)!, 0.01]]} color={PATH_COLORS[p.type]} lineWidth={2} />
      ))}
      {graph.spaces.map((s) => (
        <Marker key={s.id} space={s} position={at.get(s.id)!} selected={s.id === selected} onRoute={route?.includes(s.id) ?? false} onSelect={onSelect} />
      ))}
      {pieces.size > 0 && <Pieces pieces={pieces} at={at} onSelect={onSelect} />}
      {tracks && <Tracks board={board} tracks={tracks} />}
      <FocusedAt.Provider value={fitting ? undefined : focused?.position}>
      {tracks && tracks.reserve.length > 0 && <Reserve board={board} cards={tracks.reserve} onFocus={onFocus} />}
      {tableau && <Tableau board={board} tableau={tableau} onFocus={onFocus} />}
      {sheets && sheets.length > 0 && <Sheets board={board} sheets={sheets} onFocus={onFocus} />}
      </FocusedAt.Provider>
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
function CameraRig({ extent, target, nudge, reducedMotion }: { extent: ReturnType<typeof tableExtent>; target: CameraTarget | undefined; nudge: TableProps["nudge"]; reducedMotion: boolean }) {
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
  // A keyboard pan or zoom is one instant step through the controls, clamped like a drag (keyboard-pan-zoom D2).
  useEffect(() => {
    const c = controls.current;
    if (!nudge || !c) return;
    gliding.current = false;
    const delta = new Vector3((nudge.dx * size.width) / camera.zoom, (nudge.dy * size.height) / camera.zoom, 0);
    c.target.add(delta);
    c.object.position.add(delta);
    camera.zoom = Math.min(Math.max(camera.zoom * nudge.zoom, minZoom), minZoom * 10);
    camera.updateProjectionMatrix();
    clamp();
    c.update();
  }, [nudge?.key]);
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

function Pieces({ pieces, at, onSelect }: { pieces: Map<string, Piece[]>; at: Map<string, [number, number]>; onSelect: (id: string) => void }) {
  const damageToken = (n: number) => `${TOKENS}/health/health-0${Math.min(9, n)}.webp`;
  const images = useMemo(() => [...new Set([...pieces.values()].flat().flatMap((p) => (p.damage ? [p.image, damageToken(p.damage)] : [p.image])))], [pieces]);
  const textures = useTexture(images.map((i) => `/${i}`), srgb);
  const textureOf = new Map(images.map((img, i) => [img, textures[i]]));
  /** The piece under the pointer, whose label floats beside it (piece-hover D1). */
  const [hovered, setHovered] = useState<string>();
  /** The badge rule for the piece under the pointer; `true` is set by the piece's own handler (touch-badges D1). */
  const badge = useMemo(() => badgeEvents((shown) => !shown && setHovered(undefined)), []);
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
              <mesh
                rotation={[0, 0, p.lying ? Math.PI / 2 : 0]}
                onPointerOver={(e) => {
                  setHovered(p.id);
                  badge.over(e.pointerType);
                }}
                onPointerOut={(e) => badge.out(e.pointerType)}
                onPointerDown={(e) => {
                  if (e.pointerType === "touch") setHovered(p.id);
                  badge.down(e.pointerType);
                }}
                // A still click selects the space the piece stands on; a drag that started here only pans (piece-click-selects D1).
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.delta <= 4) onSelect(space);
                }}
              >
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
  return (
    <>
      <TrackToken map={doom!} position={doomPosition(board, tracks.doom)} size={0.3} label={tracks.labels.doom} />
      <TrackToken map={omen!} position={omenPosition(board, tracks.omen)} size={0.3} z={0.07} label={tracks.labels.omen} />
      {tracks.eldritch.flatMap((count, i) => {
        const [x, y] = omenPosition(board, i);
        return spreadOnCircle(count, 0.14).map(([dx, dy], k) => <TrackToken key={`eldritch-${i}-${k}`} map={eldritch!} position={[x + dx, y + dy]} size={0.16} z={0.08 + k * 0.001} label={tracks.labels.eldritch[i] ?? ""} />);
      })}
    </>
  );
}

/** A token on a printed track, naming itself while the pointer rests on it (track-hover D2). */
function TrackToken({ map, position: [x, y], size, z = 0.06, label }: { map: Texture; position: [number, number]; size: number; z?: number; label: string }) {
  const [hovered, setHovered] = useState(false);
  const badge = useMemo(() => badgeEvents(setHovered), []);
  return (
    <Billboard position={[x, y, z]}>
      <mesh onPointerOver={(e) => badge.over(e.pointerType)} onPointerOut={(e) => badge.out(e.pointerType)} onPointerDown={(e) => badge.down(e.pointerType)}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial map={map} transparent alphaTest={0.5} />
      </mesh>
      {hovered && (
        <Html position={[0, size / 2 + 0.05, 0]} center style={{ pointerEvents: "none" }}>
          <span className="piece-label">{label}</span>
        </Html>
      )}
    </Billboard>
  );
}

/** Asset cards are portrait, 478 by 745. */
const CARD_ASPECT = 745 / 478;

/** The reserve cards' faces in the printed slots, in reserve order (reserve-slots D3). */
function Reserve({ board, cards, onFocus }: { board: Board; cards: CardFace[]; onFocus: FaceProps["onFocus"] }) {
  const images = [...new Set(cards.flatMap((c) => (c.back ? [c.image, c.back] : [c.image])))];
  const loaded = useTexture(images.map((i) => `/${i}`), srgb);
  const textureOf = new Map(images.map((img, i) => [img, loaded[i]!]));
  const textures = cards.map((c) => textureOf.get(c.image)!);
  const w = board.tracks.reserve.width * BOARD_WIDTH;
  return (
    <>
      {textures.map((map, i) => (
        <Face key={cards[i]!.image} map={map} backMap={cards[i]!.back ? textureOf.get(cards[i]!.back!) : undefined} label={cards[i]!.label} position={reservePosition(board, i)} size={[w, w * CARD_ASPECT]} onFocus={onFocus} />
      ))}
    </>
  );
}

interface FaceProps {
  map: Texture;
  /** The back's texture when the card has one (card-flip D1). */
  backMap?: Texture;
  /** The name shown beside the card while the pointer rests on it (card-hover D2). */
  label: string;
  position: [number, number];
  size: [number, number];
  /** A click brings the card up to read: its centre and size (card-focus D1). */
  onFocus: (position: [number, number], size: [number, number]) => void;
}

/** One card face lying flat on the table. */
function Face({ map, backMap, label, position, size, onFocus }: FaceProps) {
  const [hovered, setHovered] = useState(false);
  const badge = useMemo(() => badgeEvents(setHovered), []);
  const at = useContext(FocusedAt);
  const focused = at !== undefined && at[0] === position[0] && at[1] === position[1];
  const [turned, setTurned] = useState(false);
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // A drag that starts on the card ends with a click event too; only a still pointer brings the card up.
    if (e.delta > 4) return;
    // A further click on the card brought up turns it over when it has a back, and does nothing else (card-flip D2).
    if (focused) {
      if (backMap) setTurned((v) => !v);
      return;
    }
    onFocus(position, size);
  };
  const shown = focused && turned && backMap ? backMap : map;
  return (
    <Billboard position={[...position, 0.06]}>
      <mesh onClick={click} onPointerOver={(e) => badge.over(e.pointerType)} onPointerOut={(e) => badge.out(e.pointerType)} onPointerDown={(e) => badge.down(e.pointerType)}>
        <planeGeometry args={size} />
        <meshBasicMaterial map={shown} transparent alphaTest={0.5} />
      </mesh>
      {hovered && (
        <Html position={[0, size[1] / 2 + 0.05, 0]} center style={{ pointerEvents: "none" }}>
          <span className="piece-label">{label}</span>
        </Html>
      )}
    </Billboard>
  );
}

/** The Ancient One sheet, the current mystery and the ongoing mythos cards in a column right of the board (tableau D2). */
function Tableau({ board, tableau, onFocus }: { board: Board; tableau: NonNullable<TableProps["tableau"]>; onFocus: FaceProps["onFocus"] }) {
  const mysteryToken = `${TOKENS}/mystery-token.webp`;
  const images = [tableau.sheet.image, ...(tableau.mystery ? [tableau.mystery.image] : []), ...tableau.mythos.map((c) => c.image), mysteryToken];
  const textures = useTexture(images.map((i) => `/${i}`), srgb);
  const textureOf = new Map(images.map((img, i) => [img, textures[i]!]));
  const [mx, my] = tableauPosition(board, 2);
  const [mw] = TABLEAU_ROWS[2]!;
  const [cx, cy] = tableauPosition(board, 1);
  return (
    <>
      <Face map={textureOf.get(tableau.sheet.image)!} label={tableau.sheet.label} position={tableauPosition(board, 0)} size={TABLEAU_ROWS[0]!} onFocus={onFocus} />
      {tableau.mystery && <Face map={textureOf.get(tableau.mystery.image)!} label={tableau.mystery.label} position={tableauPosition(board, 1)} size={TABLEAU_ROWS[1]!} onFocus={onFocus} />}
      {tableau.mystery &&
        spreadOnCircle(tableau.tokens, 0.17).map(([dx, dy], n) => (
          // The tokens the mystery has collected, fanned on the art corner of its card so the text stays readable (mystery-card-tokens D1).
          <mesh key={`token#${n}`} position={[cx + 0.85 + dx, cy + 0.38 + dy, 0.07]}>
            <planeGeometry args={[0.26, 0.26]} />
            <meshBasicMaterial map={textureOf.get(mysteryToken)} transparent alphaTest={0.5} />
          </mesh>
        ))}
      {tableau.mythos.map((card, i) => (
        <Face key={`${card.image}#${i}`} map={textureOf.get(card.image)!} label={card.label} position={[mx - TABLEAU_ROWS[0]![0] / 2 + mw / 2 + i * (mw + 0.1), my]} size={TABLEAU_ROWS[2]!} onFocus={onFocus} />
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
  const images = [...new Set(sheets.flatMap((s) => [s.sheet.image, ...s.held.flatMap((c) => (c.back ? [c.image, c.back] : [c.image])), ...(s.encounter ? [s.encounter.image] : []), healthToken(s.health), sanityToken(s.sanity), ...Object.keys(s.improvements).map((k) => skillToken(k as Skill)), ...s.tickets.map(ticketToken)]))];
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
        <group key={`${s.sheet.image}#${seat}`}>
          <Face map={textureOf.get(s.sheet.image)!} label={s.sheet.label} position={sheetPosition(board, seat)} size={SHEET} onFocus={onFocus} />
          {token(seat, healthToken(s.health), 0.635, 0.575, STAMP)}
          {token(seat, sanityToken(s.sanity), 0.848, 0.575, STAMP)}
          {(Object.entries(s.improvements) as [Skill, 1 | 2][]).flatMap(([skill, level]) => Array.from({ length: level }, (_, n) => token(seat, skillToken(skill), SKILL_X[skill], 0.888, [0.3, 0.3], n * 0.1)))}
          {s.tickets.map((t, n) => token(seat, ticketToken(t), 0.93, 0.07 + n * 0.1, [0.26, (0.26 * 221) / 450], n * 0.001))}
          {s.encounter && <Face map={textureOf.get(s.encounter.image)!} label={s.encounter.label} position={encounterPosition(board, seat)} size={HELD} onFocus={onFocus} />}
          {s.held.map((card, i) => (
            <Face key={`${card.image}#${i}`} map={textureOf.get(card.image)!} backMap={card.back ? textureOf.get(card.back) : undefined} label={card.label} position={heldPosition(board, seat, i)} size={HELD} onFocus={onFocus} />
          ))}
        </group>
      ))}
    </>
  );
}
