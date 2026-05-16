"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { SceneFrame } from "@/components/three/SceneFrame";
import { KineticHeading } from "@/components/ui/KineticHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { playSubBassHit, playWhoosh } from "@/lib/audio/synth";
import { soundBus } from "@/lib/audio/sound-bus";
import { useIsMobile } from "@/lib/motion/use-is-mobile";
import type { LiftoffState } from "@/components/three/Liftoff";

const Liftoff = dynamic(() => import("@/components/three/Liftoff").then((m) => m.Liftoff), {
  ssr: false,
});

export function CtaFinal() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const liftoffState = useRef<LiftoffState>({ t: 0, ignited: false });
  const animFrame = useRef<number | null>(null);

  // Drive liftoff timeline on success
  useEffect(() => {
    if (!success) return;
    if (soundBus.isEnabled()) {
      playWhoosh();
      setTimeout(() => playSubBassHit(0.6), 350);
    }
    const start = performance.now();
    const dur = 2400;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      liftoffState.current.t = t;
      liftoffState.current.ignited = true;
      if (t < 1) animFrame.current = requestAnimationFrame(step);
    };
    animFrame.current = requestAnimationFrame(step);
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [success]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || success) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "final-cta" }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error — try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="waitlist"
      className="relative isolate w-full overflow-hidden bg-[color:var(--color-ix-bg)]"
      aria-label="Get early access"
    >
      <div className="relative h-[100svh] w-full sm:h-[120svh]">
        {/* Liftoff scene fills the whole section */}
        <div className="absolute inset-0">
          <SceneFrame
            className="h-full w-full"
            camera={{ position: [0, 0.5, 5], fov: 38 }}
            maxDpr={isMobile ? 1.0 : 1.4}
            fallback={<div className="aurora-fallback h-full w-full" />}
          >
            <Liftoff state={liftoffState.current} />
          </SceneFrame>
        </div>

        {/* Foreground */}
        <div
          className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] flex-col items-center justify-center gap-8 px-5 text-center sm:px-8"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 50%, rgba(5,0,8,0) 0%, rgba(5,0,8,0.7) 80%, rgba(5,0,8,0.9) 100%)",
          }}
        >
          <span className="eyebrow">11 · Liftoff</span>
          <KineticHeading
            as="h2"
            text="The fleet is yours. Take off."
            highlight="Take off."
            highlightClassName="gradient-text-fleet"
            className="font-display font-medium tracking-[-0.04em] leading-[0.95] text-balance text-[clamp(2.5rem,9vw,7.5rem)]"
          />
          <p className="max-w-[48ch] text-pretty text-[color:var(--color-ix-fg-muted)]">
            Join the private beta. We&apos;re sending invites in waves — earliest signups get the
            front of the queue and a permanent fee tier upgrade.
          </p>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex items-center gap-2 rounded-full bg-[color:var(--color-ix-cyan)]/10 px-5 py-2 text-[color:var(--color-ix-cyan)]">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-ix-cyan)] opacity-70" />
                    <span className="relative inline-flex size-2 rounded-full bg-[color:var(--color-ix-cyan)]" />
                  </span>
                  <span className="font-mono text-sm uppercase tracking-[0.2em]">You&apos;re in.</span>
                </div>
                <p className="text-sm text-[color:var(--color-ix-fg-muted)]">
                  Welcome aboard. Check your inbox.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex w-full max-w-md flex-col items-center gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  placeholder="you@trading.sol"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full flex-1 rounded-full border border-[color:var(--color-ix-border-strong)] bg-[color:var(--color-ix-surface)]/70 px-5 text-sm text-white placeholder:text-[color:var(--color-ix-fg-dim)] backdrop-blur focus:border-[color:var(--color-ix-cyan)]/60 focus:outline-none"
                  aria-label="email address"
                />
                <MagneticButton
                  type="submit"
                  variant="primary"
                  className="h-12 w-full sm:w-auto"
                  disabled={submitting}
                >
                  {submitting ? "…" : "Get my invite"}
                </MagneticButton>
              </motion.form>
            )}
          </AnimatePresence>

          {error && (
            <p className="text-sm text-[color:var(--color-ix-red)]">{error}</p>
          )}

          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ix-fg-dim)]">
            No spam · unsubscribe anytime
          </p>
        </div>
      </div>
    </section>
  );
}
