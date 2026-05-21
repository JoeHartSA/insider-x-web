import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Trade faster, safer, smarter.";
  const sub =
    searchParams.get("sub") ||
    "Sub-200ms fills · on-chain rug protection · fees up to 5× cheaper than Axiom.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(60% 60% at 30% 30%, rgba(123,91,255,0.4) 0%, transparent 60%), radial-gradient(60% 60% at 80% 80%, rgba(255,73,200,0.35) 0%, transparent 60%), #050008",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#5BE9FF" />
                <stop offset="0.5" stopColor="#7B5BFF" />
                <stop offset="1" stopColor="#FF49C8" />
              </linearGradient>
            </defs>
            <circle cx="16" cy="13" r="8" stroke="url(#g)" strokeWidth="2" />
            <circle cx="16" cy="13" r="2.6" fill="white" />
            <path
              d="M7 22 L11 22 L11 28 L13 25 L16 29 L19 25 L21 28 L21 22 L25 22"
              stroke="url(#g)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div style={{ display: "flex", letterSpacing: 6, fontSize: 24, color: "#a89fc4" }}>
            INSIDER · X
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              lineHeight: 1.0,
              fontWeight: 600,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#a89fc4", maxWidth: 900 }}>
            {sub}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#6a627f",
            fontSize: 20,
          }}
        >
          <div style={{ display: "flex" }}>insider-x.io</div>
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #5BE9FF 0%, #7B5BFF 50%, #FF49C8 100%)",
              color: "#000",
              fontWeight: 600,
            }}
          >
            Request beta access →
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
