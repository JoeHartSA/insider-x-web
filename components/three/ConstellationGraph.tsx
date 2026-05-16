"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { seededRandom } from "@/lib/utils";
import { VENUES, type Venue } from "@/content/venues";

type NodeState = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  basePos: THREE.Vector3;
};

const CATEGORY_COLOR: Record<Venue["category"], string> = {
  amm: "#5be9ff",
  perps: "#ff49c8",
  memes: "#ffd166",
  aggregator: "#7b5bff",
  orderbook: "#2bff9a",
};

/**
 * Force-directed 3D node graph for the Markets section. Lightweight per-frame
 * sim — no external lib — gives venues a living, breathing layout.
 *
 * Nodes are SDF-style luminous rings with category-tinted glow. Edges are
 * additive-blended line segments whose dash offset slides over time so flow
 * feels directional.
 */
export function ConstellationGraph({ onHover }: { onHover?: (v: Venue | null) => void }) {
  const { size } = useThree();
  const nodesRef = useRef<NodeState[]>([]);
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const dashRef = useRef<number>(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const ringMatsRef = useRef<THREE.MeshBasicMaterial[]>([]);

  // Build initial node positions on a sphere
  useMemo(() => {
    const rng = seededRandom(99);
    nodesRef.current = VENUES.map((_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / VENUES.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.6 + (rng() - 0.5) * 0.4;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);
      const pos = new THREE.Vector3(x, y, z);
      return { pos: pos.clone(), vel: new THREE.Vector3(), basePos: pos.clone() };
    });
  }, []);

  // Edges: connect each node to its 3 nearest neighbours (computed once)
  const edges = useMemo(() => {
    const nodes = nodesRef.current;
    const pairs: [number, number][] = [];
    const k = 3;
    for (let i = 0; i < nodes.length; i++) {
      const dists = nodes
        .map((n, j) => ({ j, d: i === j ? Infinity : nodes[i].pos.distanceTo(n.pos) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, k)
        .map((x) => x.j);
      for (const j of dists) {
        const a = Math.min(i, j);
        const b = Math.max(i, j);
        if (!pairs.find((p) => p[0] === a && p[1] === b)) pairs.push([a, b]);
      }
    }
    return pairs;
  }, []);

  // Build the LineSegments geometry buffer once
  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(edges.length * 6);
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [edges]);

  // Animate the sim
  useFrame((_, delta) => {
    const nodes = nodesRef.current;
    if (!nodes.length) return;
    const dt = Math.min(0.033, delta);

    // Soft springy return to basePos + tiny noise drift
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const toBase = n.basePos.clone().sub(n.pos).multiplyScalar(0.6);
      n.vel.add(toBase.multiplyScalar(dt));
      // jitter
      n.vel.x += (Math.random() - 0.5) * 0.0008;
      n.vel.y += (Math.random() - 0.5) * 0.0008;
      n.vel.z += (Math.random() - 0.5) * 0.0008;
      n.vel.multiplyScalar(0.94);
      n.pos.addScaledVector(n.vel, dt * 60);
    }

    // Rotate the whole graph slowly
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.05;
      groupRef.current.rotation.x = Math.sin(performance.now() * 0.0002) * 0.1;
    }

    // Update line positions
    if (linesRef.current) {
      const pos = lineGeom.attributes.position.array as Float32Array;
      edges.forEach(([a, b], i) => {
        const na = nodes[a].pos;
        const nb = nodes[b].pos;
        pos[i * 6 + 0] = na.x;
        pos[i * 6 + 1] = na.y;
        pos[i * 6 + 2] = na.z;
        pos[i * 6 + 3] = nb.x;
        pos[i * 6 + 4] = nb.y;
        pos[i * 6 + 5] = nb.z;
      });
      lineGeom.attributes.position.needsUpdate = true;
    }

    dashRef.current += dt;

    // Pulse hovered node
    ringMatsRef.current.forEach((m, i) => {
      const v = VENUES[i];
      if (!m) return;
      const isHover = hovered === v.id;
      const target = isHover ? 1.4 : 0.85;
      m.opacity += (target - m.opacity) * Math.min(1, dt * 8);
    });
  });

  useEffect(() => {
    onHover?.(hovered ? VENUES.find((v) => v.id === hovered) ?? null : null);
  }, [hovered, onHover]);

  // Pointer-style screen-space hover via Html proxies (cheap & accessible)
  return (
    <group ref={groupRef}>
      {/* Edges — additive lines */}
      <lineSegments ref={linesRef} geometry={lineGeom}>
        <lineBasicMaterial
          color="#7b5bff"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Nodes */}
      {VENUES.map((v, i) => {
        const node = nodesRef.current[i];
        const color = CATEGORY_COLOR[v.category];
        return (
          <group
            key={v.id}
            position={[node.pos.x, node.pos.y, node.pos.z]}
            onPointerEnter={(e) => {
              e.stopPropagation();
              setHovered(v.id);
              document.body.style.cursor = "none";
            }}
            onPointerLeave={() => setHovered((h) => (h === v.id ? null : h))}
          >
            {/* outer halo */}
            <mesh>
              <sphereGeometry args={[0.18, 24, 24]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.08}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            {/* core ring */}
            <mesh>
              <ringGeometry args={[0.085, 0.11, 64]} />
              <meshBasicMaterial
                ref={(m) => {
                  if (m) ringMatsRef.current[i] = m;
                }}
                color={color}
                transparent
                opacity={0.85}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* dot */}
            <mesh>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>

            <Html
              center
              distanceFactor={size.width > 768 ? 8 : 6}
              style={{ pointerEvents: "none" }}
            >
              <div
                className="select-none whitespace-nowrap text-[11px] font-mono uppercase tracking-[0.18em]"
                style={{
                  transform: "translateY(-22px)",
                  color: hovered === v.id ? "#fff" : "rgba(245,241,255,0.5)",
                  textShadow:
                    hovered === v.id ? `0 0 12px ${color}, 0 0 24px ${color}` : "none",
                  transition: "color 200ms",
                }}
              >
                {v.name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
