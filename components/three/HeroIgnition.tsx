"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { PostFx } from "./PostFx";

/* ------------------------------------------------------------------
   Ray-marched volumetric background shader
   ------------------------------------------------------------------ */
const heroBgVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const heroBgFrag = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;

  // ---- noise helpers ----
  vec3 hash33(vec3 p) {
    p = vec3( dot(p, vec3(127.1, 311.7, 74.7)),
              dot(p, vec3(269.5, 183.3, 246.1)),
              dot(p, vec3(113.5, 271.9, 124.6)) );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);

    float n = mix(
      mix(
        mix(dot(hash33(i + vec3(0,0,0)), f - vec3(0,0,0)),
            dot(hash33(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
        mix(dot(hash33(i + vec3(0,1,0)), f - vec3(0,1,0)),
            dot(hash33(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
      mix(
        mix(dot(hash33(i + vec3(0,0,1)), f - vec3(0,0,1)),
            dot(hash33(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
        mix(dot(hash33(i + vec3(0,1,1)), f - vec3(0,1,1)),
            dot(hash33(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y),
      u.z);
    return n;
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * noise3(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  // SDF metaball — soft minimum
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  float sdScene(vec3 p, float t) {
    vec3 q = p;
    // warp the space with fbm
    q.x += 0.6 * fbm(q * 0.5 + t * 0.05);
    q.y += 0.6 * fbm(q * 0.5 - t * 0.06);

    float d1 = length(q - vec3( sin(t*0.27)*1.6,  cos(t*0.19)*0.8, 0.0)) - 1.1;
    float d2 = length(q - vec3(-cos(t*0.21)*1.4, -sin(t*0.18)*0.7, 0.3)) - 0.85;
    float d3 = length(q - vec3( sin(t*0.13)*0.8,  sin(t*0.23)*1.2, -0.4)) - 0.7;
    float d  = smin(d1, d2, 0.9);
    d        = smin(d,  d3, 0.7);
    return d;
  }

  vec3 palette(float t) {
    vec3 a = vec3(0.05, 0.0, 0.1);
    vec3 b = vec3(0.7,  0.3, 1.0);
    vec3 c = vec3(0.35, 0.9, 1.0);     // cyan
    vec3 d = vec3(1.0,  0.28, 0.78);   // magenta
    vec3 col = a;
    col = mix(col, b, smoothstep(0.0, 0.5, t));
    col = mix(col, c, smoothstep(0.45, 0.75, t));
    col = mix(col, d, smoothstep(0.75, 1.0, t));
    return col;
  }

  void main() {
    vec2 res = uResolution;
    vec2 p = (gl_FragCoord.xy - 0.5 * res) / res.y;

    // cursor parallax in normalized space (-0.5..0.5)
    vec2 mouse = (uMouse - 0.5 * res) / res.y;

    // camera
    vec3 ro = vec3(0.0, 0.0, 5.0);
    vec3 rd = normalize(vec3(p.x, p.y, -1.5));

    // accumulate density along the ray
    float t = 0.0;
    float density = 0.0;
    vec3 col = vec3(0.0);

    for (int i = 0; i < 16; i++) {
      vec3 pos = ro + rd * t;
      pos.xy += mouse * 0.9 * (1.0 - smoothstep(0.0, 6.0, t));
      float d = sdScene(pos, uTime);
      float layer = smoothstep(1.2, -0.4, d);
      density += layer * 0.05;
      vec3 c = palette(clamp(layer * 1.1 + 0.1 * sin(uTime + pos.z), 0.0, 1.0));
      col += c * layer * 0.05;
      t += max(0.32, d * 0.7);
      if (t > 7.5 || density > 1.4) break;
    }

    // base gradient (very dark blue/purple) so we always have a floor
    vec3 base = mix(vec3(0.02, 0.0, 0.06), vec3(0.04, 0.0, 0.10), smoothstep(-1.0, 1.0, p.y));

    vec3 final = base + col * 1.1;

    // subtle radial vignette
    float vig = smoothstep(1.4, 0.4, length(p));
    final *= mix(0.55, 1.0, vig);

    // film-noise grain (cheap, no texture)
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    final += (g - 0.5) * 0.025;

    gl_FragColor = vec4(final, 1.0);
  }
`;

function HeroBackground() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [],
  );

  useFrame(({ clock, pointer }, delta) => {
    if (!mat.current) return;
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uResolution.value.set(size.width, size.height);

    // lerp mouse for buttery follow
    const tx = (pointer.x * 0.5 + 0.5) * size.width;
    const ty = (pointer.y * 0.5 + 0.5) * size.height;
    mouse.current.x += (tx - mouse.current.x) * Math.min(1, delta * 4);
    mouse.current.y += (ty - mouse.current.y) * Math.min(1, delta * 4);
    uniforms.uMouse.value.copy(mouse.current);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={heroBgVert}
        fragmentShader={heroBgFrag}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        transparent={false}
      />
      {/* avoid unused-var warning for viewport */}
      <group visible={false} scale={[viewport.width, viewport.height, 1]} />
    </mesh>
  );
}

/* ------------------------------------------------------------------
   Procedural rocket / orb
   ------------------------------------------------------------------ */
function RocketOrb() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.18 + pointer.x * 0.25;
    groupRef.current.rotation.x = -0.05 + pointer.y * 0.15;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.08;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.8}>
      <group ref={groupRef} position={[0, 0.1, 0]}>
        {/* central iridescent sphere (orb) — physical material w/ iridescence
            is ~10× cheaper than MeshTransmissionMaterial and reads almost
            identically against our shader background. */}
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[1.05, 4]} />
          <meshPhysicalMaterial
            color="#9d8cff"
            metalness={0.85}
            roughness={0.15}
            iridescence={1}
            iridescenceIOR={1.6}
            iridescenceThicknessRange={[100, 800]}
            clearcoat={1}
            clearcoatRoughness={0.05}
            emissive="#1a0a3a"
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* dark pupil */}
        <mesh position={[0, 0, 1.02]}>
          <circleGeometry args={[0.32, 64]} />
          <meshBasicMaterial color="#050008" />
        </mesh>

        {/* outer ring (rocket head) */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[1.18, 0.04, 32, 128]} />
          <meshStandardMaterial
            color="#8a6bff"
            emissive="#5be9ff"
            emissiveIntensity={0.8}
            metalness={0.6}
            roughness={0.25}
          />
        </mesh>

        {/* secondary slim ring */}
        <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
          <torusGeometry args={[1.45, 0.01, 16, 96]} />
          <meshBasicMaterial color="#ff49c8" transparent opacity={0.55} />
        </mesh>

        {/* fins (lower) */}
        {[-1, 0, 1].map((i) => (
          <group key={i} position={[i * 0.5, -1.05, 0]} rotation={[0, 0, 0]}>
            <mesh>
              <coneGeometry args={[0.18, 0.55, 4]} />
              <meshStandardMaterial
                color="#7b5bff"
                emissive="#7b5bff"
                emissiveIntensity={0.4}
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}

        {/* exhaust glow */}
        <mesh position={[0, -1.6, 0]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial color="#5be9ff" transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

/* ------------------------------------------------------------------
   Particle exhaust trail
   ------------------------------------------------------------------ */
function ExhaustParticles({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = -1.5 - Math.random() * 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = -0.005 - Math.random() * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return { positions: pos, velocities: vel };
  }, [count]);

  useFrame(() => {
    const geom = ref.current?.geometry;
    if (!geom) return;
    const pos = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] += velocities[i * 3 + 0];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];
      if (pos[i * 3 + 1] < -3.5) {
        pos[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
        pos[i * 3 + 1] = -1.5 - Math.random() * 0.3;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
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
        color="#5be9ff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------
   Main scene
   ------------------------------------------------------------------ */
export function HeroIgnition() {
  return (
    <>
      <color attach="background" args={["#050008"]} />
      <HeroBackground />

      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, -2, 2]} intensity={1.8} color="#7b5bff" />
      <pointLight position={[3, -1, -3]} intensity={1.4} color="#ff49c8" />

      <Environment preset="night" />

      <RocketOrb />
      <ExhaustParticles count={120} />

      {/* Bloom is the most expensive pass; the shader background already
          glows brightly so we skip it here. Aberration + vignette only. */}
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
