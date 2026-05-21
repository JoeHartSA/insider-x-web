"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { PostFx } from "./PostFx";

/* ------------------------------------------------------------------
   Lightweight background — a vertical aurora gradient drawn as a
   full-screen plane, no ray-march, no fbm. ~3% of the cost of the
   old HeroIgnition background.
   ------------------------------------------------------------------ */
const bgVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const bgFrag = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uMouse;

  vec3 palette(float t) {
    vec3 a = vec3(0.04, 0.0, 0.08);
    vec3 b = vec3(0.18, 0.05, 0.42);   // deep purple
    vec3 c = vec3(0.36, 0.91, 1.00);   // cyan
    vec3 d = vec3(1.00, 0.29, 0.78);   // magenta
    vec3 col = mix(a, b, smoothstep(0.0, 0.55, t));
    col      = mix(col, c, smoothstep(0.55, 0.78, t) * 0.55);
    col      = mix(col, d, smoothstep(0.78, 1.0, t) * 0.35);
    return col;
  }

  void main() {
    vec2 p = vUv - 0.5;
    p.x += (uMouse.x - 0.5) * 0.06;
    p.y += (uMouse.y - 0.5) * 0.04;

    // soft horizontal aurora ribbon
    float band = exp(-pow((p.y + 0.05) * 4.5, 2.0));
    float wob  = sin(p.x * 6.0 + uTime * 0.4) * 0.04
               + sin(p.x * 3.0 - uTime * 0.18) * 0.07;
    band       = exp(-pow((p.y + 0.05 + wob) * 5.0, 2.0));

    float t = clamp(0.42 + band * 0.55, 0.0, 1.0);
    vec3 col = palette(t);

    // radial vignette
    float vig = smoothstep(0.95, 0.25, length(p));
    col *= mix(0.5, 1.0, vig);

    // cheap deterministic dither (no random)
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (g - 0.5) * 0.022;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function TerminalBackground() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [],
  );

  useFrame(({ clock, pointer }, delta) => {
    if (!mat.current) return;
    uniforms.uTime.value = clock.getElapsedTime();
    const tx = pointer.x * 0.5 + 0.5;
    const ty = pointer.y * 0.5 + 0.5;
    mouse.current.x += (tx - mouse.current.x) * Math.min(1, delta * 4);
    mouse.current.y += (ty - mouse.current.y) * Math.min(1, delta * 4);
    uniforms.uMouse.value.copy(mouse.current);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={bgVert}
        fragmentShader={bgFrag}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        transparent={false}
      />
      {/* keep size referenced so DPR changes recompute uniforms */}
      <group visible={false} scale={[size.width, size.height, 1]} />
    </mesh>
  );
}

/* ------------------------------------------------------------------
   Candlestick chart — N thin instanced bars, each "breathing" upward
   to communicate price discovery. Uses InstancedMesh with per-instance
   colour so green/red candles are free.
   ------------------------------------------------------------------ */
const CANDLE_COUNT = 28;

function CandleChart({
  onLatestCandle,
}: {
  onLatestCandle: (worldPos: THREE.Vector3, height: number) => void;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  // Deterministic per-candle phase so the wave is reproducible
  const candles = useMemo(
    () =>
      Array.from({ length: CANDLE_COUNT }, (_, i) => ({
        i,
        x: -3.6 + (i / (CANDLE_COUNT - 1)) * 7.2,
        phase: (i * 0.37) % (Math.PI * 2),
        green: ((i * 41) % 7) < 4,
      })),
    [],
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorBuf = useMemo(() => new Float32Array(CANDLE_COUNT * 3), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.getElapsedTime();

    let latestX = 0;
    let latestY = 0;
    let latestH = 0;

    for (let i = 0; i < CANDLE_COUNT; i++) {
      const c = candles[i];
      // upward trend baseline + sin breathing
      const base = -1.4 + (i / CANDLE_COUNT) * 1.4;
      const h = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.1 + c.phase));
      const y = base + h * 0.5;

      dummy.position.set(c.x, y, 0);
      dummy.scale.set(0.16, h, 0.16);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);

      // colour: trend up means more greens at the front
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.0 + c.phase);
      if (c.green) {
        tmpColor.setRGB(0.34 + pulse * 0.1, 0.93, 0.86);
      } else {
        tmpColor.setRGB(0.95, 0.28 + pulse * 0.1, 0.62);
      }
      tmpColor.toArray(colorBuf, i * 3);

      if (i === CANDLE_COUNT - 1) {
        latestX = c.x;
        latestY = y + h * 0.5;
        latestH = h;
      }
    }

    if (m.instanceColor) {
      m.instanceColor.array.set(colorBuf);
      m.instanceColor.needsUpdate = true;
    }
    m.instanceMatrix.needsUpdate = true;

    onLatestCandle.call(null, new THREE.Vector3(latestX, latestY, 0), latestH);
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, CANDLE_COUNT]}
      castShadow={false}
      receiveShadow={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial vertexColors toneMapped={false} />
      <instancedBufferAttribute attach="instanceColor" args={[colorBuf, 3]} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------
   Sniper crosshair — a thin ring + cross drawn with line geometry.
   Tracks the latest candle with damping.
   ------------------------------------------------------------------ */
function Crosshair({ targetRef }: { targetRef: React.RefObject<THREE.Vector3> }) {
  const group = useRef<THREE.Group>(null);
  const lockedAt = useRef(0);
  const locked = useRef(false);

  useFrame(({ clock }, delta) => {
    if (!group.current || !targetRef.current) return;
    const target = targetRef.current;
    const t = clock.getElapsedTime();

    // drift horizontally then lock onto latest candle every ~5s
    const cyclePhase = (t % 5) / 5;
    const lockX = cyclePhase > 0.55;

    const desiredX = lockX ? target.x : Math.sin(t * 0.4) * 2.5;
    const desiredY = lockX ? target.y + 0.08 : Math.sin(t * 0.7 + 1.2) * 0.6;

    group.current.position.x += (desiredX - group.current.position.x) * Math.min(1, delta * 3.5);
    group.current.position.y += (desiredY - group.current.position.y) * Math.min(1, delta * 3.5);

    if (lockX && !locked.current) {
      locked.current = true;
      lockedAt.current = t;
    }
    if (!lockX) locked.current = false;

    // breathing scale
    const s = 0.95 + 0.05 * Math.sin(t * 3.0);
    group.current.scale.setScalar(s);
  });

  return (
    <group ref={group}>
      {/* outer ring */}
      <mesh>
        <ringGeometry args={[0.32, 0.345, 64]} />
        <meshBasicMaterial color="#5be9ff" transparent opacity={0.9} toneMapped={false} />
      </mesh>
      {/* inner ring */}
      <mesh>
        <ringGeometry args={[0.16, 0.17, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.55} toneMapped={false} />
      </mesh>
      {/* crosshair arms */}
      <mesh position={[0, 0.28, 0]}>
        <planeGeometry args={[0.014, 0.18]} />
        <meshBasicMaterial color="#5be9ff" transparent opacity={0.85} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <planeGeometry args={[0.014, 0.18]} />
        <meshBasicMaterial color="#5be9ff" transparent opacity={0.85} toneMapped={false} />
      </mesh>
      <mesh position={[0.28, 0, 0]}>
        <planeGeometry args={[0.18, 0.014]} />
        <meshBasicMaterial color="#5be9ff" transparent opacity={0.85} toneMapped={false} />
      </mesh>
      <mesh position={[-0.28, 0, 0]}>
        <planeGeometry args={[0.18, 0.014]} />
        <meshBasicMaterial color="#5be9ff" transparent opacity={0.85} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------
   Hex shield — a static hex ring on the right, which pulses briefly
   when the "rug dart" hits it.
   ------------------------------------------------------------------ */
function HexShield({ flashRef }: { flashRef: React.RefObject<number> }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (!mat.current || !flashRef.current) return;
    const f = Math.max(0, flashRef.current);
    mat.current.opacity = 0.32 + f * 0.55;
  });

  // build hex outline points
  const hexPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      pts.push(new THREE.Vector3(Math.cos(a) * 0.7, Math.sin(a) * 0.7, 0));
    }
    return pts;
  }, []);

  return (
    <group position={[3.2, 0.4, 0]}>
      <mesh>
        <ringGeometry args={[0.66, 0.7, 6]} />
        <meshBasicMaterial
          ref={mat}
          color="#7b5bff"
          transparent
          opacity={0.32}
          toneMapped={false}
        />
      </mesh>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={hexPoints.length}
            array={new Float32Array(hexPoints.flatMap((p) => [p.x, p.y, p.z]))}
            itemSize={3}
            args={[new Float32Array(hexPoints.flatMap((p) => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#a47bff" transparent opacity={0.7} toneMapped={false} />
      </line>
    </group>
  );
}

/* ------------------------------------------------------------------
   Choreographed "rug dart" + "buy pulse" — both are tiny meshes
   that fly across a fixed timeline. Triggered every ~5s.
   ------------------------------------------------------------------ */
function Projectiles({
  targetRef,
  shieldFlashRef,
}: {
  targetRef: React.RefObject<THREE.Vector3>;
  shieldFlashRef: React.MutableRefObject<number>;
}) {
  const rugRef = useRef<THREE.Mesh>(null);
  const buyRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const phase = (t % 5) / 5;

    // rug dart: travels left → shield from frame 0.05 → 0.30
    if (rugRef.current) {
      const local = (phase - 0.05) / 0.25;
      if (local >= 0 && local <= 1) {
        const startX = -3.5;
        const endX = 2.8;
        const x = startX + (endX - startX) * local;
        const y = 0.4 + Math.sin(local * Math.PI) * 0.15;
        rugRef.current.position.set(x, y, 0.05);
        (rugRef.current.material as THREE.MeshBasicMaterial).opacity = 1;
      } else {
        (rugRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
      // shield flash near impact
      if (local > 0.88 && local < 1.0) {
        shieldFlashRef.current = 1;
      }
    }

    // buy pulse: travels from chart base → through crosshair from 0.45 → 0.85
    if (buyRef.current && targetRef.current) {
      const local = (phase - 0.45) / 0.4;
      if (local >= 0 && local <= 1) {
        const startX = 0;
        const startY = -1.8;
        const endX = targetRef.current.x;
        const endY = targetRef.current.y + 0.08;
        const eased = local * local * (3 - 2 * local);
        const x = startX + (endX - startX) * eased;
        const y = startY + (endY - startY) * eased;
        buyRef.current.position.set(x, y, 0.04);
        const s = 0.5 + Math.sin(local * Math.PI) * 0.8;
        buyRef.current.scale.setScalar(s);
        (buyRef.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(local * Math.PI);
      } else {
        (buyRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
    }

    // decay shield flash
    shieldFlashRef.current = Math.max(0, shieldFlashRef.current - delta * 1.2);
  });

  return (
    <>
      <mesh ref={rugRef} position={[-4, 0.4, 0.05]}>
        <planeGeometry args={[0.42, 0.05]} />
        <meshBasicMaterial color="#ff3b6b" transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh ref={buyRef} position={[0, -2, 0.04]}>
        <ringGeometry args={[0.05, 0.1, 32]} />
        <meshBasicMaterial color="#5be9ff" transparent opacity={0} toneMapped={false} />
      </mesh>
    </>
  );
}

/* ------------------------------------------------------------------
   Signal dots emitted from the chart base
   ------------------------------------------------------------------ */
function SignalDots({ count = 40 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities, lifes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const life = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 1] = -1.6 + Math.random() * 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = 0.004 + Math.random() * 0.006;
      vel[i * 3 + 2] = 0;
      life[i] = Math.random();
    }
    return { positions: pos, velocities: vel, lifes: life };
  }, [count]);

  useFrame(() => {
    const geom = ref.current?.geometry;
    if (!geom) return;
    const pos = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] += velocities[i * 3 + 0];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      lifes[i] += 0.008;
      if (lifes[i] > 1 || pos[i * 3 + 1] > 1.4) {
        pos[i * 3 + 0] = (Math.random() - 0.5) * 7;
        pos[i * 3 + 1] = -1.6 + Math.random() * 0.2;
        lifes[i] = 0;
      }
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#9d8cff"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------
   Push-pull camera dolly — slow, continuous, never settles
   ------------------------------------------------------------------ */
function DollyCamera() {
  const { camera } = useThree();
  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    camera.position.z = 5 + Math.sin(t * 0.18) * 0.35;
    camera.position.x = pointer.x * 0.15;
    camera.position.y = pointer.y * 0.1;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ------------------------------------------------------------------
   Composed scene
   ------------------------------------------------------------------ */
export function HeroTerminal() {
  const latestCandle = useRef(new THREE.Vector3(2, 0, 0));
  const shieldFlash = useRef(0);

  return (
    <>
      <color attach="background" args={["#050008"]} />
      <TerminalBackground />

      <ambientLight intensity={0.6} />

      {/* Tilt the whole stage so the chart reads as a 3D plinth */}
      <group rotation={[0, -0.18, 0.04]} position={[-0.2, 0, 0]}>
        <CandleChart onLatestCandle={(p) => latestCandle.current.copy(p)} />
        <SignalDots count={36} />
        <Crosshair targetRef={latestCandle} />
        <HexShield flashRef={shieldFlash} />
        <Projectiles targetRef={latestCandle} shieldFlashRef={shieldFlash} />
      </group>

      <DollyCamera />

      {/* No bloom, no grain — aberration + vignette only. Cheap. */}
      <PostFx
        intensity="low"
        enableBloom={false}
        enableAberration
        enableGrain={false}
        enableVignette
      />
    </>
  );
}
