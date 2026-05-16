import { cn } from "@/lib/utils";

export function Logo({ className, withWordmark = true }: { className?: string; withWordmark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <defs>
          <linearGradient id="ix-logo-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#5BE9FF" />
            <stop offset="0.5" stopColor="#7B5BFF" />
            <stop offset="1" stopColor="#FF49C8" />
          </linearGradient>
        </defs>
        {/* outer ring */}
        <circle cx="14" cy="11" r="8" stroke="url(#ix-logo-grad)" strokeWidth="2" />
        {/* inner pupil */}
        <circle cx="14" cy="11" r="2.6" fill="white" />
        {/* fins (rocket lower body) */}
        <path
          d="M5 19 L9 19 L9 25 L11 22 L14 26 L17 22 L19 25 L19 19 L23 19"
          stroke="url(#ix-logo-grad)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {withWordmark && (
        <span className="text-[15px] font-medium tracking-[0.16em] uppercase">
          Insider<span className="text-[color:var(--color-ix-cyan)]">·X</span>
        </span>
      )}
    </span>
  );
}
