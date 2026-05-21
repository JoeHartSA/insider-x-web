"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Props = Omit<CanvasProps, "children"> & {
  children: ReactNode;
  className?: string;
  /** Only mount the Canvas when within this many viewport heights of being visible */
  preloadMargin?: string;
  /** Fallback element shown while scene is not mounted or loading */
  fallback?: ReactNode;
  /** Cap on DPR (default 1.25, capped harder than R3F default). */
  maxDpr?: number;
};

/**
 * Visibility-gated Canvas wrapper. Mounts the R3F scene only when on/near the
 * viewport (via IntersectionObserver), unmounts when off-screen. Pauses the
 * render loop when not visible to avoid background tax on multi-scene pages.
 */
export function SceneFrame({
  children,
  className,
  preloadMargin = "20% 0px 20% 0px",
  fallback,
  maxDpr = 1.25,
  ...rest
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  // Attach lost/restored handlers to the actual canvas once R3F mounts.
  const handleCreated = useCallback(({ gl }: { gl: { domElement: HTMLCanvasElement } }) => {
    const canvas = gl.domElement;
    const onLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onRestored = () => setContextLost(false);
    canvas.addEventListener("webglcontextlost", onLost as EventListener, false);
    canvas.addEventListener("webglcontextrestored", onRestored as EventListener, false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = wrapRef.current;
    if (!el) return;

    const mountObs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
          } else {
            // off-screen + outside preload margin → unmount
            setActive(false);
          }
        }
      },
      { rootMargin: preloadMargin, threshold: 0 },
    );
    mountObs.observe(el);

    // Second observer with no margin tracks actual visibility for frameloop
    const visObs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setVisible(e.isIntersecting);
      },
      { rootMargin: "0px", threshold: 0 },
    );
    visObs.observe(el);

    return () => {
      mountObs.disconnect();
      visObs.disconnect();
    };
  }, [preloadMargin]);

  return (
    <div ref={wrapRef} className={className}>
      {active && !contextLost ? (
        <Canvas
          dpr={[1, maxDpr]}
          frameloop={visible ? "always" : "demand"}
          onCreated={handleCreated}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
            stencil: false,
            depth: true,
            // Don't preserve the drawing buffer — saves memory and reduces
            // pressure that triggers context loss on low-resource GPUs.
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false,
          }}
          {...rest}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Suspense fallback={null}>{children}</Suspense>
          <Preload all />
        </Canvas>
      ) : (
        fallback
      )}
    </div>
  );
}
