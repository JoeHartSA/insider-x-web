"use client";

import { Physics, RigidBody, CuboidCollider, InstancedRigidBodies, type InstancedRigidBodyProps } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { seededRandom } from "@/lib/utils";

/**
 * Deterministic rapier-driven coin shower. Coins are short cylinders ('puck'
 * shape) with brass-gold material. Spawn positions and velocities are derived
 * from a seeded PRNG so the first render always looks the same — good for
 * marketing screenshots.
 */
export function CoinShower({ count = 200 }: { count?: number }) {
  const instances = useMemo<InstancedRigidBodyProps[]>(() => {
    const rng = seededRandom(2024);
    return Array.from({ length: count }).map((_, i) => {
      const x = (rng() - 0.5) * 4;
      const y = 3 + rng() * 5;
      const z = (rng() - 0.5) * 4 - 0.5;
      const r = new THREE.Euler(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
      return {
        key: `coin-${i}`,
        position: [x, y, z],
        rotation: [r.x, r.y, r.z],
        angularVelocity: [(rng() - 0.5) * 8, (rng() - 0.5) * 8, (rng() - 0.5) * 8],
        linearVelocity: [(rng() - 0.5) * 0.4, -rng() * 1.5, (rng() - 0.5) * 0.4],
      };
    });
  }, [count]);

  return (
    <Physics gravity={[0, -22, 0]}>
      {/* Floor */}
      <RigidBody type="fixed" friction={0.6}>
        <CuboidCollider args={[6, 0.2, 6]} position={[0, -1.2, 0]} />
      </RigidBody>
      {/* Sloped walls so coins settle in a tidy pile */}
      <RigidBody type="fixed" friction={0.4}>
        <CuboidCollider args={[3.6, 1, 0.2]} position={[0, -0.5, -2]} rotation={[-0.35, 0, 0]} />
        <CuboidCollider args={[3.6, 1, 0.2]} position={[0, -0.5, 2]} rotation={[0.35, 0, 0]} />
        <CuboidCollider args={[0.2, 1, 3.6]} position={[-2, -0.5, 0]} rotation={[0, 0, 0.35]} />
        <CuboidCollider args={[0.2, 1, 3.6]} position={[2, -0.5, 0]} rotation={[0, 0, -0.35]} />
      </RigidBody>

      <InstancedRigidBodies instances={instances} colliders="hull">
        <instancedMesh args={[undefined, undefined, count]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.06, 24]} />
          <meshStandardMaterial
            color="#ffce63"
            emissive="#7a4a00"
            emissiveIntensity={0.25}
            metalness={0.95}
            roughness={0.25}
          />
        </instancedMesh>
      </InstancedRigidBodies>
    </Physics>
  );
}

/** Wraps the physics scene with the lights / camera bits a section needs. */
export function CoinShowerScene({ count = 200 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  return (
    <>
      <color attach="background" args={["#0c0518"]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 4]} intensity={1.3} color="#ffd8a0" castShadow />
      <pointLight position={[-4, 2, -2]} intensity={1.2} color="#ff49c8" />
      <pointLight position={[3, 2, 2]} intensity={1} color="#5be9ff" />

      {/* radial backdrop glow */}
      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[12, 8]} />
        <meshBasicMaterial color="#1a0a30" />
      </mesh>

      <group ref={groupRef}>
        <CoinShower count={count} />
      </group>
    </>
  );
}
