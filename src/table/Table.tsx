import { Billboard, Html, Line, MapControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type ComponentRef, Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { SRGBColorSpace, type Texture, Vector3 } from "three";
import { activeGraph } from "../content/board";
import type { Board, BoardLabels, Space } from "../content/types";
import { BoardText } from "./BoardText";
import { BOARD_WIDTH, TABLEAU_ROWS, boardSize, boardToWorld, doomPosition, omenPosition, reservePosition, spreadOnCircle, tableExtent, tableauPosition } from "./geometry";
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
  tableau?: { sheet: string; mystery?: string; mythos: string[] };
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

function Scene({ board, labels, strings, pieces, tracks, tableau, enabled, selected, route, onSelect, reducedMotion }: TableProps) {
  const graph = useMemo(() => activeGraph(board, enabled), [board, enabled]);
  const at = useMemo(() => new Map(board.spaces.map((s) => [s.id, boardToWorld(s, board)])), [board]);
  const active = useMemo(() => new Set(graph.spaces.map((s) => s.id)), [graph]);
  /** The card face last clicked, read until the selection changes (card-focus D1); `key` makes a repeated click glide again. */
  const [focus, setFocus] = useState<{ position: [number, number]; size: [number, number]; key: number; forSelected: string | undefined }>();
  const onFocus: FaceProps["onFocus"] = (position, size) => setFocus((prev) => ({ position, size, key: (prev?.key ?? 0) + 1, forSelected: selected }));
  const focused = focus?.forSelected === selected ? focus : undefined;
  const target = useMemo<CameraTarget | undefined>(() => (focused ? { position: focused.position, size: focused.size, key: focused.key } : selected && at.has(selected) ? { position: at.get(selected)! } : undefined), [focused, selected, at]);
  return (
    <>
      <CameraRig board={board} withTableau={tableau !== undefined} target={target} reducedMotion={reducedMotion} />
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
    </>
  );
}

/** Where the camera glides: a point, and for a card its height so the view zooms to read it (card-focus D2). */
interface CameraTarget {
  position: [number, number];
  /** A card's `[width, height]`; the view zooms until it fills most of the view. */
  size?: [number, number];
  key?: number;
}

/** Top-down orthographic view: zoom bounded so the whole table fits, pan kept within it, no rotation (pan-clamp D2). */
function CameraRig({ board, withTableau, target, reducedMotion }: { board: Board; withTableau: boolean; target: CameraTarget | undefined; reducedMotion: boolean }) {
  const { size, camera } = useThree();
  const controls = useRef<ComponentRef<typeof MapControls>>(null);
  const extent = useMemo(() => tableExtent(board, withTableau), [board, withTableau]);
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
  const zoomGoal = target?.size ? Math.min(Math.max(Math.min(size.width / (target.size[0] * 1.2), size.height / (target.size[1] * 1.2)), minZoom), minZoom * 10) : undefined;
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
  const images = useMemo(() => [...new Set([...pieces.values()].flat().map((p) => p.image))], [pieces]);
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
            <Billboard key={p.id} position={[x + dx, y + dy + (p.kind === "pawn" ? half : 0), 0.05 + k * 0.001]}>
              {/* A lying pawn turns a quarter turn in the billboard's plane, so the standee rests sideways on the board (design D2). */}
              <mesh rotation={[0, 0, p.lying ? Math.PI / 2 : 0]} onPointerOver={() => setHovered(p.id)} onPointerOut={() => setHovered((h) => (h === p.id ? undefined : h))}>
                <planeGeometry args={[w, h]} />
                <meshBasicMaterial map={textureOf.get(p.image)} transparent alphaTest={0.5} />
              </mesh>
              {hovered === p.id && (
                <Html position={[0, half + 0.05, 0]} center style={{ pointerEvents: "none" }}>
                  <span className="piece-label">{p.label}</span>
                </Html>
              )}
            </Billboard>
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
  const images = [tableau.sheet, ...(tableau.mystery ? [tableau.mystery] : []), ...tableau.mythos];
  const textures = useTexture(images.map((i) => `/${i}`), srgb);
  const textureOf = new Map(images.map((img, i) => [img, textures[i]!]));
  const [mx, my] = tableauPosition(board, 2);
  const [mw] = TABLEAU_ROWS[2]!;
  return (
    <>
      <Face map={textureOf.get(tableau.sheet)!} position={tableauPosition(board, 0)} size={TABLEAU_ROWS[0]!} onFocus={onFocus} />
      {tableau.mystery && <Face map={textureOf.get(tableau.mystery)!} position={tableauPosition(board, 1)} size={TABLEAU_ROWS[1]!} onFocus={onFocus} />}
      {tableau.mythos.map((img, i) => (
        <Face key={`${img}#${i}`} map={textureOf.get(img)!} position={[mx - TABLEAU_ROWS[0]![0] / 2 + mw / 2 + i * (mw + 0.1), my]} size={TABLEAU_ROWS[2]!} onFocus={onFocus} />
      ))}
    </>
  );
}
