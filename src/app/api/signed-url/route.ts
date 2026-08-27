import { NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/rateLimit";

// Signed URLs are minted per session; never cache them.
export const dynamic = "force-dynamic";

// In-memory, per-instance throttle — see src/lib/rateLimit.ts for caveats.
const limiter = createRateLimiter({ limit: 10, windowMs: 60_000 });

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function GET(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;
  if (!apiKey || !agentId) {
    console.error("signed-url: missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID");
    return NextResponse.json(
      { error: "Server is not configured" },
      { status: 500, headers: NO_STORE },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!limiter.check(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: NO_STORE });
  }

  const upstream = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
    { headers: { "xi-api-key": apiKey }, cache: "no-store" },
  );

  if (!upstream.ok) {
    // Log status only — the upstream body may echo request details; never forward it.
    console.error(`signed-url: upstream responded ${upstream.status}`);
    return NextResponse.json({ error: "Upstream error" }, { status: 502, headers: NO_STORE });
  }

  const data = (await upstream.json()) as { signed_url?: string };
  if (!data.signed_url) {
    console.error("signed-url: upstream response missing signed_url");
    return NextResponse.json({ error: "Upstream error" }, { status: 502, headers: NO_STORE });
  }

  return NextResponse.json({ signedUrl: data.signed_url }, { headers: NO_STORE });
}
