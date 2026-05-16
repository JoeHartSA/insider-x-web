"use client";

import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

type Props = {
  intensity?: "low" | "default" | "high";
  enableBloom?: boolean;
  enableAberration?: boolean;
  enableGrain?: boolean;
  enableVignette?: boolean;
};

/**
 * A reusable post-processing stack per-scene. Tunable per section so we can
 * dial bloom up on the Fleet and down on the calmer dioramas.
 */
export function PostFx({
  intensity = "default",
  enableBloom = true,
  enableAberration = true,
  enableGrain = true,
  enableVignette = true,
}: Props) {
  const bloomIntensity = intensity === "high" ? 1.4 : intensity === "low" ? 0.5 : 0.85;
  const aberrationOffset = intensity === "high" ? 0.0018 : intensity === "low" ? 0.0006 : 0.0012;

  return (
    <EffectComposer multisampling={0}>
      {enableBloom ? (
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      ) : (
        <></>
      )}
      {enableAberration ? (
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(aberrationOffset, aberrationOffset)}
          radialModulation={false}
          modulationOffset={0}
        />
      ) : (
        <></>
      )}
      {enableGrain ? <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} /> : <></>}
      {enableVignette ? (
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
