import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const COLS = [
  {
    title: "Product",
    links: [
      { href: "#speed", label: "Speed" },
      { href: "#fleet", label: "Fleet" },
      { href: "#rug-protection", label: "Rug protection" },
      { href: "#features", label: "Features" },
      { href: "#rewards", label: "Rewards" },
    ],
  },
  {
    title: "Compare",
    links: [
      { href: "/vs/axiom", label: "vs Axiom" },
      { href: "/vs/trojan", label: "vs Trojan" },
      { href: "/vs/photon", label: "vs Photon" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/blog", label: "Blog" },
      { href: "/changelog", label: "Changelog" },
      { href: "https://status.insider-x.io", label: "Status" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "mailto:hello@insider-x.io", label: "Contact" },
    ],
  },
];

const SOCIAL = [
  {
    href: "https://x.com/insiderx",
    label: "X",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
        <path d="M10.6 1H12.8L8.1 6.3 13.5 13H9.3L6 8.8 2.2 13H0L5 7.3 0 1h4.3l3 4 3.3-4z" />
      </svg>
    ),
  },
  {
    href: "https://t.me/insiderx",
    label: "Telegram",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
        <path d="M13.4 1.2 11.7 12.4c-.1.6-.5.7-1 .4l-2.8-2-1.3 1.3c-.2.2-.3.3-.6.3l.2-3 5.5-5c.2-.2 0-.3-.3-.1L4.6 7.6.7 6.4c-.6-.2-.6-.6.1-.9L12.6.7c.5-.2 1 .1.8.5z" />
      </svg>
    ),
  },
  {
    href: "https://discord.gg/insiderx",
    label: "Discord",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
        <path d="M11.5 2.2c-.9-.4-1.8-.7-2.7-.9-.1.2-.3.5-.4.7-1-.1-2-.1-3 0 0-.2-.2-.5-.4-.7-.9.2-1.9.5-2.7.9C.5 5 0 7.7.2 10.3c1.1.8 2.2 1.3 3.3 1.6.3-.4.5-.8.7-1.2-.4-.2-.7-.4-1.1-.6.1-.1.2-.1.3-.2 2.1 1 4.5 1 6.7 0 .1.1.2.1.3.2-.4.2-.7.4-1.1.6.2.4.4.8.7 1.2 1.1-.3 2.2-.8 3.3-1.6.3-3-.5-5.7-1.8-8.1zM4.7 8.6c-.7 0-1.2-.6-1.2-1.4 0-.7.5-1.4 1.2-1.4S6 6.4 6 7.2c0 .7-.5 1.4-1.3 1.4zm4.6 0c-.7 0-1.2-.6-1.2-1.4 0-.7.5-1.4 1.2-1.4s1.3.6 1.3 1.4-.5 1.4-1.3 1.4z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="relative isolate mt-32 overflow-hidden border-t border-[color:var(--color-ix-border)] py-20">
      {/* slow starfield gradient base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 0%, rgba(123,91,255,0.15), transparent 70%), radial-gradient(50% 60% at 50% 100%, rgba(255,73,200,0.08), transparent 70%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-[color:var(--color-ix-fg-muted)] text-pretty">
            The fastest execution engine on Solana. Command a fleet of up to 500 wallets across
            pump.fun, Raydium, Jupiter and every alt-market that matters.
          </p>
          <div className="flex items-center gap-2 pt-2">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                data-cursor="cta"
                className="inline-flex size-9 items-center justify-center rounded-full text-[color:var(--color-ix-fg-muted)] glass hover:text-white transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1 text-xs text-[color:var(--color-ix-fg-dim)]">
            <span className="relative inline-flex size-2 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--color-ix-green)] opacity-60" />
              <span className="size-2 rounded-full bg-[color:var(--color-ix-green)]" />
            </span>
            All systems operational
          </div>
        </div>

        {COLS.map((c) => (
          <div key={c.title} className="space-y-3">
            <h4 className="eyebrow">{c.title}</h4>
            <ul className="space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    data-cursor="cta"
                    className="text-[color:var(--color-ix-fg-muted)] hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 flex w-full max-w-[1400px] flex-col items-start justify-between gap-3 border-t border-[color:var(--color-ix-border)] px-5 pt-6 text-xs text-[color:var(--color-ix-fg-dim)] sm:flex-row sm:items-center sm:px-8">
        <p>© {new Date().getFullYear()} Insider-X Labs. Built on Solana.</p>
        <p className="font-mono">
          build <span className="text-[color:var(--color-ix-fg-muted)]">v0.1.0</span>
        </p>
      </div>
    </footer>
  );
}
