import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = { email?: string; source?: string };

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const source = (body.source || "site").slice(0, 64);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please use a valid email" }, { status: 400 });
  }

  const entry = {
    email,
    source,
    ua: req.headers.get("user-agent") ?? "",
    ip: req.headers.get("x-forwarded-for")?.split(",")[0] ?? "",
    ts: new Date().toISOString(),
  };

  // Console log always
  console.log("[waitlist]", entry);

  // Local JSON file in dev/standalone; ignored in serverless (read-only fs)
  try {
    const dir = path.join(process.cwd(), ".local-data");
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, "waitlist.jsonl");
    await fs.appendFile(file, JSON.stringify(entry) + "\n", "utf8");
  } catch {
    // ignore — we'll wire Resend/Loops later
  }

  return NextResponse.json({ ok: true });
}
