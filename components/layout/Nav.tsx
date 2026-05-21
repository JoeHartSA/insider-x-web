"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/ui/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#speed", label: "Speed" },
  { href: "#fleet", label: "Fleet" },
  { href: "#rug-protection", label: "Rug protection" },
  { href: "#rewards", label: "Rewards" },
  { href: "/docs", label: "Docs" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on hash-anchor navigation
  useEffect(() => {
    if (!open) return;
    const onHash = () => setOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-8">
        <Link
          href="/"
          aria-label="Insider-X"
          className={cn(
            "flex items-center rounded-full px-3 py-2 transition-all duration-500 sm:px-4",
            scrolled ? "glass-strong" : "",
          )}
        >
          <Logo />
        </Link>

        <nav
          className={cn(
            "hidden items-center gap-1 rounded-full px-2 py-1.5 text-sm transition-all duration-500 md:flex",
            scrolled ? "glass-strong" : "",
          )}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-cursor="cta"
              className="rounded-full px-4 py-2 text-[color:var(--color-ix-fg-muted)] transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <SoundToggle className="hidden sm:inline-flex" />
          <MagneticButton
            href="https://app.insider-x.io"
            external
            variant="primary"
            strength={8}
            className="hidden h-10 px-4 text-[13px] sm:inline-flex sm:px-5"
          >
            Launch App
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticButton>

          {/* Mobile trigger */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                data-cursor="cta"
                className="inline-flex size-10 items-center justify-center rounded-full glass-strong md:hidden"
              >
                <span className="relative block h-3 w-4">
                  <span
                    className={cn(
                      "absolute left-0 right-0 top-0 h-[1.5px] rounded bg-white transition-transform duration-300",
                      open && "translate-y-[5px] rotate-45",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 right-0 top-1/2 h-[1.5px] -translate-y-1/2 rounded bg-white transition-opacity duration-200",
                      open && "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-[1.5px] rounded bg-white transition-transform duration-300",
                      open && "-translate-y-[5px] -rotate-45",
                    )}
                  />
                </span>
              </button>
            </Dialog.Trigger>
            <AnimatePresence>
              {open && (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay asChild forceMount>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="fixed inset-0 z-[60] bg-[color:var(--color-ix-bg)]/85 backdrop-blur-md md:hidden"
                    />
                  </Dialog.Overlay>
                  <Dialog.Content asChild forceMount>
                    <motion.div
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="fixed inset-0 z-[61] flex flex-col gap-6 px-6 pt-24 pb-10 md:hidden"
                    >
                      <Dialog.Title className="sr-only">Menu</Dialog.Title>
                      <nav className="flex flex-col gap-1">
                        {LINKS.map((l, i) => (
                          <motion.div
                            key={l.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.08 + i * 0.06,
                              duration: 0.5,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                          >
                            <Link
                              href={l.href}
                              onClick={() => setOpen(false)}
                              className="block py-3 font-display text-4xl tracking-tight text-white"
                            >
                              {l.label}
                            </Link>
                          </motion.div>
                        ))}
                      </nav>

                      <div className="mt-auto flex flex-col gap-4">
                        <SoundToggle />
                        <a
                          href="https://app.insider-x.io"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black"
                        >
                          Launch App
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden
                            className="ml-2"
                          >
                            <path
                              d="M3 11L11 3M11 3H5M11 3V9"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      </div>
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
