"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { PostFx } from "./PostFx";

/**
 * Final-CTA scene. Re-uses the hero rocket shape, but the camera dollies down
 * as the rocket scales up + accelerates upward. Exhaust particles ramp.
 *
 * `state.t` ∈ [0..1] is driven by the parent (waitlist submit or scroll).
 */
export type LiftoffState = {
  t: number;
  ignited: boolean;
};

export function Liftoff({ state }: { state: LiftoffState }) {
  const groupRef = useRef<THREE.Group>(null);
  const exhaustRef = useRef<THREE.Points>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const { positions, velocities } = useMemo(() => {
    const count = 280;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = -1.6 - Math.random() * 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = -0.02 - Math.random() * 0.04;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((_, delta) => {
    const s = stateRef.current;
    const t = s.t;

    if (groupRef.current) {
      // base hover + scale up + lift
      const lift = t * t * 8;
      const scl = 1 + t * 0.6;
      groupRef.current.position.y = lift;
      groupRef.current.scale.setScalar(scl);
      groupRef.current.rotation.y += delta * (0.3 + t * 1.4);
    }

    // exhaust
    const geom = exhaustRef.current?.geometry;
    if (geom) {
      const arr = geom.attributes.position.array as Float32Array;
      const intensity = 1 + t * 4;
      for (let i = 0; i < arr.length / 3; i++) {
        arr[i * 3 + 0] += velocities[i * 3 + 0] * intensity;
        arr[i * 3 + 1] += velocities[i * 3 + 1] * intensity;
        arr[i * 3 + 2] += velocities[i * 3 + 2] * intensity;
        if (arr[i * 3 + 1] < -5) {
          arr[i * 3 + 0] = (Math.random() - 0.5) * 0.5;
          arr[i * 3 + 1] = -1.6 - Math.random() * 0.3;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        }
      }
      geom.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <color attach="background" args={["#050008"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 5, 4]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-3, -2, 2]} intensity={1.8} color="#7b5bff" />
      <pointLight position={[3, -1, -3]} intensity={1.4} color="#ff49c8" />

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
        <group ref={groupRef}>
          <mesh>
            <icosahedronGeometry args={[1, 4]} />
            <meshStandardMaterial
              color="#9d8cff"
              metalness={0.75}
              roughness={0.22}
              emissive="#3a1a6a"
              emissiveIntensity={0.85}
            />
          </mesh>

          {/* dark pupil */}
          <mesh position={[0, 0, 1.02]}>
            <circleGeometry args={[0.32, 64]} />
            <meshBasicMaterial color="#050008" />
          </mesh>

          {/* outer ring */}
          <mesh>
            <torusGeometry args={[1.12, 0.04, 32, 128]} />
            <meshStandardMaterial
              color="#8a6bff"
              emissive="#5be9ff"
              emissiveIntensity={0.8}
              metalness={0.6}
              roughness={0.25}
            />
          </mesh>

          {/* fins */}
          {[-1, 0, 1].map((i) => (
            <group key={i} position={[i * 0.5, -1.05, 0]}>
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
        </group>
      </Float>

      <points ref={exhaustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#5be9ff"
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Bloom moved to Fleet only (the only scene that genuinely benefits).
          Aberration + vignette here; cheaper composite. */}
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
