"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { seededRandom } from "@/lib/utils";
import { PostFx } from "./PostFx";

/**
 * FleetField — the centrepiece scene.
 *
 * 500 wallet tiles rendered as a single InstancedMesh (one draw call) on a
 * curved holographic plane. A single ShaderMaterial drives:
 *
 *  - chaos→lattice morph (uMorph)
 *  - per-tile breathing (uTime)
 *  - "FIRE" radial shockwave (uFire, uFireOrigin)
 *  - per-tile token-color stripe and PnL meter
 *
 * All animation state is mutated through `state` (set by the parent scroll
 * timeline) so the scene reads uniforms once per frame and never re-renders.
 */

export type FleetState = {
  morph: number; // 0 = chaos, 1 = lattice
  fire: number; // -1 = not fired; else seconds since fire
  hover: number; // -1 = none, else instance id
  pull: number; // 0..1 camera pull-back
  burst: number; // total PnL ticks (visual only, drives shader pulse)
};

type Props = {
  count?: number;
  state: FleetState;
  /** Called once when shader-driven shockwave should trigger the audio cue. */
  onFire?: () => void;
};

const vert = /* glsl */ `
  attribute vec3 aChaos;     // initial chaotic position
  attribute vec3 aLattice;   // target grid position
  attribute float aSeed;     // per-tile seed [0..1]
  attribute vec3 aColor;     // tile accent color
  attribute float aPnl;      // per-tile baseline PnL fill [0..1]

  uniform float uMorph;
  uniform float uTime;
  uniform float uFire;        // seconds since fire (<0 = idle)
  uniform vec3  uFireOrigin;

  varying vec2 vUv;
  varying vec3 vColor;
  varying float vSeed;
  varying float vPnl;
  varying float vWave;        // 0..1 shockwave influence

  void main() {
    vUv = uv;
    vColor = aColor;
    vSeed = aSeed;
    vPnl = aPnl;

    // morph between chaos and lattice with eased per-tile delay
    float delay = aSeed * 0.65;
    float p = clamp((uMorph - delay) / (1.0 - delay + 0.0001), 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p); // smoothstep

    vec3 pos = mix(aChaos, aLattice, p);

    // curve the plane (subtle dish)
    float r = length(pos.xz);
    pos.y += -0.04 * r * r;

    // breathing
    pos.y += sin(uTime * 1.4 + aSeed * 12.0) * 0.012;

    // shockwave
    float wave = 0.0;
    if (uFire >= 0.0) {
      float dist = length(pos.xz - uFireOrigin.xz);
      // expanding ring centered on dist = uFire * 4
      float ringR = uFire * 4.0;
      float band = exp(-pow((dist - ringR) * 1.6, 2.0));
      wave = band * (1.0 - clamp(uFire / 1.4, 0.0, 1.0));
      pos.y += wave * 0.18;
    }
    vWave = wave;

    vec4 mv = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const frag = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  varying vec3 vColor;
  varying float vSeed;
  varying float vPnl;
  varying float vWave;

  uniform float uTime;
  uniform float uFire;

  // SDF rounded rectangle
  float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + r;
    return length(max(d, 0.0)) - r;
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= 1.0;
    p.y *= 1.6;

    float card = sdRoundRect(p, vec2(0.95, 1.5), 0.4);
    if (card > 0.0) discard;

    // brighter base panel — tiles are visible at every scroll position
    vec3 panel = vec3(0.07, 0.05, 0.16);

    // top color stripe (token accent) — punchier
    float stripe = smoothstep(1.4, 1.36, p.y) - smoothstep(1.36, 1.32, p.y);
    panel = mix(panel, vColor * 1.6, stripe);

    // bottom PnL bar
    float pnlBar = step(p.y, -1.05) * step(-1.3, p.y);
    float pnlFill = step(p.x, -0.9 + vPnl * 1.8) * pnlBar;
    vec3 pnlColor = mix(vec3(0.18, 0.85, 0.5), vec3(0.5, 1.0, 0.65), vPnl);
    panel = mix(panel, pnlColor, pnlFill * 0.95);
    panel = mix(panel, vec3(0.05, 0.12, 0.08), pnlBar * (1.0 - pnlFill) * 0.7);

    // glyph rows
    for (int i = 0; i < 3; i++) {
      float yy = -0.4 + float(i) * 0.35;
      float row = step(abs(p.y - yy), 0.06) * step(abs(p.x), 0.75);
      float noise = fract(sin(p.x * 12.0 + vSeed * 30.0 + float(i)) * 43.0);
      row *= step(0.3, noise);
      panel = mix(panel, vec3(0.78, 0.7, 0.95), row * 0.22);
    }

    // hairline border (brighter)
    float edge = smoothstep(0.0, -0.04, card);
    panel = mix(panel, vec3(0.55, 0.5, 0.85), edge * 0.18);

    // FIRE flash + sustained afterglow so brightness doesn't crash back to base
    if (uFire >= 0.0) {
      float t = uFire;
      // slow decay (was exp(-t*2.6))
      float flashPulse = exp(-t * 1.1);
      // afterglow that lingers
      float afterglow = exp(-t * 0.35) * 0.45;
      float flashAmt = flashPulse + afterglow + vWave * 1.5;
      vec3 flashCol = mix(vec3(0.36, 0.91, 1.0), vec3(1.0, 0.29, 0.78), clamp(t * 0.7, 0.0, 1.0));
      panel += flashCol * flashAmt * 0.95;
    }

    // ambient breathing glow — 3x stronger so tiles always feel alive
    float breathe = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 1.2 + vSeed * 9.0));
    panel += vColor * 0.18 * breathe;

    gl_FragColor = vec4(panel, 1.0);
  }
`;

const TOKEN_COLORS: [number, number, number][] = [
  [0.36, 0.91, 1.0], // cyan
  [0.48, 0.36, 1.0], // violet
  [1.0, 0.29, 0.78], // magenta
  [0.16, 1.0, 0.6], // green
  [1.0, 0.82, 0.4], // amber
  [0.85, 0.45, 1.0], // pink-purple
];

function FleetMesh({ count, stateRef, onFire }: { count: number; stateRef: React.MutableRefObject<FleetState>; onFire?: () => void }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const firedRef = useRef(false);

  // Build the per-tile data
  const { chaos, lattice, seeds, colors, pnls } = useMemo(() => {
    const cols = count >= 500 ? 25 : count >= 240 ? 20 : 15;
    const rows = Math.ceil(count / cols);
    const totalW = cols * 0.14;
    const totalH = rows * 0.20;

    const rng = seededRandom(1337);

    const chaos = new Float32Array(count * 3);
    const lattice = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const pnls = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);

      // grid (centered, slight randomized jitter for organic feel)
      lattice[i * 3 + 0] = -totalW / 2 + c * 0.14 + 0.07 + (rng() - 0.5) * 0.005;
      lattice[i * 3 + 1] = 0;
      lattice[i * 3 + 2] = -totalH / 2 + r * 0.2 + 0.1 + (rng() - 0.5) * 0.005;

      // chaos: random points in a wide sphere
      const ang = rng() * Math.PI * 2;
      const rad = 3 + rng() * 4;
      chaos[i * 3 + 0] = Math.cos(ang) * rad;
      chaos[i * 3 + 1] = (rng() - 0.5) * 3;
      chaos[i * 3 + 2] = Math.sin(ang) * rad;

      seeds[i] = rng();

      const tc = TOKEN_COLORS[Math.floor(rng() * TOKEN_COLORS.length)];
      colors[i * 3 + 0] = tc[0];
      colors[i * 3 + 1] = tc[1];
      colors[i * 3 + 2] = tc[2];

      pnls[i] = 0.1 + rng() * 0.6;
    }

    return { chaos, lattice, seeds, colors, pnls };
  }, [count]);

  // Apply per-instance constant transforms once. Position is driven by attribute → vertex shader,
  // so the instanceMatrix only carries scale + slight rotation.
  useEffect(() => {
    if (!meshRef.current) return;
    const mat4 = new THREE.Matrix4();
    const quat = new THREE.Quaternion();
    const sc = new THREE.Vector3(0.075, 0.075, 0.075);
    const eul = new THREE.Euler(-Math.PI / 2.4, 0, 0); // more upright = legible faces
    quat.setFromEuler(eul);

    for (let i = 0; i < count; i++) {
      mat4.compose(new THREE.Vector3(0, 0, 0), quat, sc);
      meshRef.current.setMatrixAt(i, mat4);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  // Attach the per-tile shader attributes once the geometry exists
  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1, 1, 1);
    g.setAttribute("aChaos", new THREE.InstancedBufferAttribute(chaos, 3));
    g.setAttribute("aLattice", new THREE.InstancedBufferAttribute(lattice, 3));
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1));
    g.setAttribute("aColor", new THREE.InstancedBufferAttribute(colors, 3));
    g.setAttribute("aPnl", new THREE.InstancedBufferAttribute(pnls, 1));
    return g;
  }, [chaos, lattice, seeds, colors, pnls]);

  const uniforms = useMemo(
    () => ({
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uFire: { value: -1 },
      uFireOrigin: { value: new THREE.Vector3(0, 0, 0) },
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!materialRef.current) return;
    const state = stateRef.current;
    uniforms.uTime.value = clock.getElapsedTime();
    // smooth toward target morph for a softer feel even with snappy scrub
    uniforms.uMorph.value += (state.morph - uniforms.uMorph.value) * Math.min(1, delta * 6);

    // Fire timer
    if (state.fire >= 0) {
      if (!firedRef.current) {
        firedRef.current = true;
        onFire?.();
      }
      uniforms.uFire.value = state.fire;
    } else {
      uniforms.uFire.value = -1;
      firedRef.current = false;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[geom, undefined, count]} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent={false}
      />
    </instancedMesh>
  );
}

function CameraRig({ stateRef }: { stateRef: React.MutableRefObject<FleetState> }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const s = stateRef.current;
    // Cap pull-back so tiles remain readable at the end of the timeline.
    const pull = Math.min(s.pull, 1) * 0.5;
    const wantY = 1.55 + pull * 0.6;
    const wantZ = 2.6 + pull * 0.7;
    camera.position.y += (wantY - camera.position.y) * Math.min(1, delta * 3);
    camera.position.z += (wantZ - camera.position.z) * Math.min(1, delta * 3);
    target.current.set(0, 0, 0);
    camera.lookAt(target.current);
  });

  return null;
}

/**
 * Eagerly compile every shader/program on the first frame so the visible
 * first frame isn't a black "shader compiling" pause. Three's gl.compile()
 * walks the scene graph once, after which all draw calls use cached programs.
 */
function PrecompileShaders() {
  const { gl, scene, camera } = useThree();
  useLayoutEffect(() => {
    try {
      gl.compile(scene, camera);
    } catch {
      /* compile-on-demand is fine on browsers that don't expose it */
    }
  }, [gl, scene, camera]);
  return null;
}

export function FleetField({ count = 500, state, onFire }: Props) {
  const stateRef = useRef(state);
  stateRef.current = state;

  return (
    <>
      <color attach="background" args={["#06010c"]} />

      {/* very subtle deck plane underneath */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <ringGeometry args={[1.2, 4.5, 64]} />
        <meshBasicMaterial color="#0e0820" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* glow grid lines underneath the tiles */}
      <gridHelper args={[8, 32, "#1a1130", "#100820"]} position={[0, -0.4, 0]} />

      <CameraRig stateRef={stateRef} />

      <ambientLight intensity={0.55} />
      <pointLight position={[0, 3, 2]} intensity={1.6} color="#7b5bff" />
      <pointLight position={[3, 1, -1]} intensity={1.1} color="#5be9ff" />
      <pointLight position={[-3, 1, -1]} intensity={0.9} color="#ff49c8" />

      <FleetMesh count={count} stateRef={stateRef} onFire={onFire} />

      <PrecompileShaders />

      <PostFx
        intensity="default"
        enableBloom
        enableAberration={false}
        enableGrain={false}
        enableVignette
      />
    </>
  );
}
