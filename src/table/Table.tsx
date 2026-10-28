import { Billboard, Line, MapControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type ComponentRef, Suspense, useEffect, useMemo, useRef } from "react";
import { SRGBColorSpace, type Texture, Vector3 } from "three";
import { activeGraph } from "../content/board";
import type { Board, BoardLabels, Space } from "../content/types";
import { BoardText } from "./BoardText";
import { boardSize, boardToWorld, doomPosition, omenPosition, spreadOnCircle } from "./geometry";
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
  tracks?: { doom: number; omen: number; eldritch: number[] };
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

function Scene({ board, labels, strings, pieces, tracks, enabled, selected, route, onSelect, reducedMotion }: TableProps) {
  const graph = useMemo(() => activeGraph(board, enabled), [board, enabled]);
  const at = useMemo(() => new Map(board.spaces.map((s) => [s.id, boardToWorld(s, board)])), [board]);
  const active = useMemo(() => new Set(graph.spaces.map((s) => s.id)), [graph]);
  return (
    <>
      <CameraRig board={board} target={selected ? at.get(selected) : undefined} reducedMotion={reducedMotion} />
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
    </>
  );
}

/** Top-down orthographic view: zoom bounded so the whole board fits, pan only, no rotation. */
function CameraRig({ board, target, reducedMotion }: { board: Board; target: [number, number] | undefined; reducedMotion: boolean }) {
  const { size, camera } = useThree();
  const controls = useRef<ComponentRef<typeof MapControls>>(null);
  const [w, h] = boardSize(board);
  const minZoom = Math.min(size.width / w, size.height / h) * 0.95;
  // Start fully zoomed out; MapControls keeps user zoom within [minZoom, maxZoom] from then on.
  useEffect(() => {
    camera.zoom = minZoom;
    camera.updateProjectionMatrix();
  }, [camera, minZoom]);
  const goal = useMemo(() => (target ? new Vector3(target[0], target[1], 0) : undefined), [target]);
  useFrame((_, dt) => {
    const c = controls.current;
    if (!c || !goal || c.target.distanceTo(goal) < 0.001) return;
    const step = reducedMotion ? 1 : Math.min(1, dt * 6);
    const delta = goal.clone().sub(c.target).multiplyScalar(step);
    c.target.add(delta);
    c.object.position.add(delta);
    c.update();
  });
  return (
    <MapControls
      ref={controls}
      makeDefault
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
  return (
    <>
      {[...pieces].flatMap(([space, list]) => {
        const [x, y] = at.get(space)!;
        // Radius grows with the count so a crowded space stays readable.
        const offsets = spreadOnCircle(list.length, 0.15 + 0.03 * list.length);
        return list.map((p, k) => {
          const [w, h] = SIZE[p.kind];
          const [dx, dy] = offsets[k]!;
          return (
            <Billboard key={p.id} position={[x + dx, y + dy + (p.kind === "pawn" ? (p.lying ? w : h) / 2 : 0), 0.05 + k * 0.001]}>
              {/* A lying pawn turns a quarter turn in the billboard's plane, so the standee rests sideways on the board (design D2). */}
              <mesh rotation={[0, 0, p.lying ? Math.PI / 2 : 0]}>
                <planeGeometry args={[w, h]} />
                <meshBasicMaterial map={textureOf.get(p.image)} transparent alphaTest={0.5} />
              </mesh>
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
