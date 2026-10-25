import { Billboard, Line, MapControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type ComponentRef, Suspense, useEffect, useMemo, useRef } from "react";
import { SRGBColorSpace, type Texture, Vector3 } from "three";
import { activeGraph } from "../content/board";
import type { Board, Investigator, Space } from "../content/types";
import { boardSize, boardToWorld, spreadOnCircle } from "./geometry";
import { PATH_COLORS } from "./sets";

export interface TableProps {
  board: Board;
  investigators: Investigator[];
  enabled: Set<string>;
  selected: string | undefined;
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

function Scene({ board, investigators, enabled, selected, onSelect, reducedMotion }: TableProps) {
  const graph = useMemo(() => activeGraph(board, enabled), [board, enabled]);
  const at = useMemo(() => new Map(board.spaces.map((s) => [s.id, boardToWorld(s, board)])), [board]);
  return (
    <>
      <CameraRig board={board} target={selected ? at.get(selected) : undefined} reducedMotion={reducedMotion} />
      <BoardPlane board={board} />
      {graph.paths.map((p) => (
        <Line key={`${p.from}-${p.to}`} points={[[...at.get(p.from)!, 0.01], [...at.get(p.to)!, 0.01]]} color={PATH_COLORS[p.type]} lineWidth={2} />
      ))}
      {graph.spaces.map((s) => (
        <Marker key={s.id} space={s} position={at.get(s.id)!} selected={s.id === selected} onSelect={onSelect} />
      ))}
      <Pawns investigators={investigators} at={at} />
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

function Marker({ space, position, selected, onSelect }: { space: Space; position: [number, number]; selected: boolean; onSelect: (id: string) => void }) {
  return (
    <mesh
      position={[...position, 0.02]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(space.id);
      }}
    >
      <ringGeometry args={[selected ? 0.14 : 0.1, selected ? 0.2 : 0.14, 32]} />
      <meshBasicMaterial color={selected ? "#ffffff" : "#ff00ff"} />
    </mesh>
  );
}

const PAWN = { width: 0.26, height: 0.26 * (488 / 339) };

function Pawns({ investigators, at }: { investigators: Investigator[]; at: Map<string, [number, number]> }) {
  const textures = useTexture(investigators.map((i) => `/${i.pawn}`), srgb);
  const bySpace = new Map<string, number[]>();
  investigators.forEach((inv, i) => bySpace.set(inv.startingSpace, [...(bySpace.get(inv.startingSpace) ?? []), i]));
  return (
    <>
      {[...bySpace].flatMap(([space, idx]) => {
        const [x, y] = at.get(space)!;
        const offsets = spreadOnCircle(idx.length, 0.2);
        return idx.map((i, k) => (
          <Billboard key={investigators[i]!.id} position={[x + offsets[k]![0], y + offsets[k]![1] + PAWN.height / 2, 0.05]}>
            <mesh>
              <planeGeometry args={[PAWN.width, PAWN.height]} />
              <meshBasicMaterial map={textures[i]} transparent alphaTest={0.5} />
            </mesh>
          </Billboard>
        ));
      })}
    </>
  );
}
