import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { failRobot, formationTargets } from "../lib/swarm";
import { prefersReducedMotion } from "../lib/motion";

const RADIUS = 2.2;
const LINK_DIST = 1.3;
const POINTER_REACH = 1.7;
const PICK_PX = 44;

const GOLD = new THREE.Color("#e6bf5a");
const FAULT = new THREE.Color("#e8603f");
const LINK = new THREE.Color("#b49a4c");

type Status = { online: number; total: number };

type SwarmProps = { count: number; reducedMotion: boolean; kicks: number; onStatus: (s: Status) => void };

function Swarm({ count, reducedMotion, kicks, onStatus }: SwarmProps) {
  const [alive, setAlive] = useState(() => Array<boolean>(count).fill(true));
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const targets = useMemo(() => formationTargets(alive, RADIUS), [alive]);

  // Per-robot simulation state lives outside React: no re-render per frame.
  const sim = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    formationTargets(Array(count).fill(true), RADIUS).forEach((t, i) => pos.set(t!, i * 3));
    return { pos, vel, scale: new Float32Array(count).fill(1) };
  }, [count]);

  const maxSegments = count * 8;
  const linePositions = useMemo(() => new Float32Array(maxSegments * 6), [maxSegments]);

  // Hex chassis: six sides, short and wide, rotated so its face points outward.
  const chassis = useMemo(() => new THREE.CylinderGeometry(0.15, 0.15, 0.08, 6).rotateX(Math.PI / 2), []);
  useEffect(() => () => chassis.dispose(), [chassis]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const getState = useThree((s) => s.get);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    alive.forEach((a, i) => mesh.setColorAt(i, a ? GOLD : FAULT));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    onStatus({ online: alive.filter(Boolean).length, total: count });
  }, [alive, count, onStatus]);

  // Keyboard-accessible alternative to clicking: fail a random healthy robot.
  useEffect(() => {
    if (kicks === 0) return;
    setAlive((prev) => {
      const healthy = prev.flatMap((a, i) => (a ? [i] : []));
      return failRobot(prev, healthy[Math.floor(Math.random() * healthy.length)]);
    });
  }, [kicks]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const lines = linesRef.current;
    if (!mesh || !lines) return;
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const spin = reducedMotion ? 0.35 : t * 0.12;
    const cos = Math.cos(spin);
    const sin = Math.sin(spin);
    const { pos, vel, scale } = sim;

    // Pointer on the z=0 plane, in world units.
    const px = (state.pointer.x * state.viewport.width) / 2;
    const py = (state.pointer.y * state.viewport.height) / 2;

    for (let i = 0; i < count; i++) {
      const o = i * 3;
      const target = targets[i];
      let tx: number, ty: number, tz: number;
      if (target) {
        // Rotate the formation around Y; bob slightly so it feels alive.
        tx = target[0] * cos - target[2] * sin;
        tz = target[0] * sin + target[2] * cos;
        ty = target[1] + (reducedMotion ? 0 : Math.sin(t * 1.3 + i) * 0.04);
        // Robots near the cursor lean toward it, like they've been given an order.
        const dx = px - tx;
        const dy = py - ty;
        const d = Math.hypot(dx, dy);
        if (!reducedMotion && d < POINTER_REACH) {
          const pull = (1 - d / POINTER_REACH) * 0.45;
          tx += dx * pull;
          ty += dy * pull;
        }
      } else {
        // A failed robot drops out of formation and sinks.
        tx = pos[o] * 1.002;
        ty = pos[o + 1] - 0.6 * dt;
        tz = pos[o + 2];
      }

      if (reducedMotion) {
        pos[o] = tx;
        pos[o + 1] = ty;
        pos[o + 2] = tz;
      } else {
        // Critically-damped-ish spring toward the target.
        for (let k = 0; k < 3; k++) {
          const goal = k === 0 ? tx : k === 1 ? ty : tz;
          vel[o + k] += (goal - pos[o + k]) * 9 * dt;
          vel[o + k] *= 1 - 5 * dt;
          pos[o + k] += vel[o + k] * dt * 4;
        }
      }

      const targetScale = target ? 1 : 0.55;
      scale[i] += (targetScale - scale[i]) * Math.min(1, 6 * dt);

      dummy.position.set(pos[o], pos[o + 1], pos[o + 2]);
      // Each chassis faces outward from the swarm's centre.
      tmp.set(pos[o] * 2, pos[o + 1] * 2, pos[o + 2] * 2);
      dummy.lookAt(tmp);
      dummy.scale.setScalar(scale[i]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // Network links between nearby healthy robots, plus links to the cursor.
    let seg = 0;
    const push = (ax: number, ay: number, az: number, bx: number, by: number, bz: number) => {
      if (seg >= maxSegments) return;
      const o = seg++ * 6;
      linePositions[o] = ax;
      linePositions[o + 1] = ay;
      linePositions[o + 2] = az;
      linePositions[o + 3] = bx;
      linePositions[o + 4] = by;
      linePositions[o + 5] = bz;
    };
    for (let i = 0; i < count; i++) {
      if (!alive[i]) continue;
      const a = i * 3;
      for (let j = i + 1; j < count; j++) {
        if (!alive[j]) continue;
        const b = j * 3;
        const d = Math.hypot(pos[a] - pos[b], pos[a + 1] - pos[b + 1], pos[a + 2] - pos[b + 2]);
        if (d < LINK_DIST) push(pos[a], pos[a + 1], pos[a + 2], pos[b], pos[b + 1], pos[b + 2]);
      }
      if (!reducedMotion && Math.hypot(px - pos[a], py - pos[a + 1]) < POINTER_REACH * 0.7 && pos[a + 2] > 0) {
        push(px, py, 0.5, pos[a], pos[a + 1], pos[a + 2]);
      }
    }
    const geom = lines.geometry;
    (geom.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    geom.setDrawRange(0, seg * 2);
  });

  /**
   * Robots are ~15px wide and always moving, so exact raycasts are frustrating.
   * Instead, pick the nearest healthy robot within PICK_PX of the pointer on screen.
   */
  const pickRobot = () => {
    const { camera, size, pointer } = getState();
    let best = -1;
    let bestDist = PICK_PX;
    for (let i = 0; i < count; i++) {
      if (!alive[i]) continue;
      tmp.fromArray(sim.pos, i * 3).project(camera);
      const d = Math.hypot(((tmp.x - pointer.x) * size.width) / 2, ((tmp.y - pointer.y) * size.height) / 2);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    const i = pickRobot();
    if (i < 0) return;
    e.stopPropagation();
    setAlive((prev) => failRobot(prev, i));
  };

  const handleMove = () => {
    document.body.style.cursor = pickRobot() >= 0 ? "pointer" : "";
  };

  return (
    <>
      {/* Invisible hit hull: catches pointer events for the whole swarm. */}
      <mesh onClick={handleClick} onPointerMove={handleMove} onPointerOut={() => (document.body.style.cursor = "")}>
        <sphereGeometry args={[RADIUS + 0.8, 24, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
      <instancedMesh ref={meshRef} args={[chassis, undefined, count]} frustumCulled={false}>
        <meshStandardMaterial metalness={0.7} roughness={0.32} />
      </instancedMesh>
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} usage={THREE.DynamicDrawUsage} />
        </bufferGeometry>
        <lineBasicMaterial color={LINK} transparent opacity={0.45} />
      </lineSegments>
    </>
  );
}

/** Back the camera off on narrow canvases so the whole formation stays in frame. */
function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  useEffect(() => {
    const aspect = size.width / size.height;
    const halfFovTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fitWidth = (RADIUS * 2 + 1) / (2 * halfFovTan * aspect);
    camera.position.z = Math.max(7.2, fitWidth);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

type SceneProps = { active: boolean; kicks: number; onStatus: (s: Status) => void };

export default function SwarmScene({ active, kicks, onStatus }: SceneProps) {
  const [{ count, reducedMotion }] = useState(() => ({
    count: window.innerWidth < 768 ? 36 : 60,
    reducedMotion: prefersReducedMotion(),
  }));

  useEffect(() => () => void (document.body.style.cursor = ""), []);

  return (
    <Canvas
      className="fade-in"
      flat
      dpr={[1, 1.75]}
      frameloop={!active ? "never" : reducedMotion ? "demand" : "always"}
      camera={{ position: [0, 0, 7.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-label="Interactive swarm of robots. Click a robot to make it fail; the rest re-form."
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#7fd1a8" />
      <CameraRig />
      <Swarm count={count} reducedMotion={reducedMotion} kicks={kicks} onStatus={onStatus} />
    </Canvas>
  );
}
