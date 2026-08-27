# Ask Andrii — voice agent demo

A small production-quality demo showing an [ElevenLabs Agents](https://elevenlabs.io/docs/eleven-agents/overview) integration in a real React product: a voice agent that answers questions about Andrii Sirko's CV from a knowledge base — and drives the UI while it talks. Ask it _"What did Andrii build at Mehrwerk?"_ and the matching project card lights up on screen.

Built with Next.js (App Router), TypeScript strict, Tailwind, and `@elevenlabs/react`. There is a **text mode** toggle for trying it without a microphone.

## Architecture

```
 Browser                        Next.js (Vercel)                ElevenLabs
┌───────────────────┐          ┌──────────────────────┐        ┌─────────────────────┐
│ ConversationProv. │─GET────▶ │ /api/signed-url      │─GET──▶ │ get-signed-url      │
│  (@elevenlabs/    │◀─{signed-│  xi-api-key (server  │◀─{url}─│  (xi-api-key auth)  │
│    react)         │   Url}───│  only), per-IP       │        │                     │
│                   │          │  throttle, no-store  │        │                     │
│  startSession ────┼──WebSocket connection (signed URL, 15-min validity)──────────▶ │
│                   │                                          │  Agent "Ask Andrii" │
│  transcript ◀─────┼── onMessage ────────────────────────────│   Gemini 2.5 Flash  │
│  latency  ◀───────┼── onPing ───────────────────────────────│   + RAG over CV     │
│                   │                                          │                     │
│  UI actions ◀─────┼── clientTools calls ────────────────────│  highlightProject   │
│  (highlight card, │── return value ("Highlighted Mehrwerk")▶│  filterByTech       │
│   filter, contact)│                                          │  showContact        │
└───────────────────┘          └──────────────────────┘        └─────────────────────┘
```

### How the signed-URL flow works

The ElevenLabs API key never reaches the browser. The agent has `enable_auth` on, so it only accepts connections opened with a signed URL:

1. The client calls `GET /api/signed-url` (a Next.js route handler).
2. The handler — server-side only — calls `GET https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=…` with the `xi-api-key` header and returns `{ signedUrl }` with `Cache-Control: no-store`. Upstream failures become an opaque 502; the upstream body is never forwarded.
3. The client passes the signed URL to `startSession({ signedUrl, connectionType: "websocket" })`. Signed URLs are valid for 15 minutes; the session may outlive that.

The route has a small per-IP throttle (10 req/min). It is in-memory and therefore per-serverless-instance — counters do not persist across Vercel invocations or scale across instances. That is fine as a speed bump for a demo; the real fix would be a shared store (Vercel KV / Upstash Redis), deliberately not implemented here.

### How client tools round-trip

Tool names and parameter schemas are defined twice and must match exactly: once on the agent ([agent/tool_configs/](agent/tool_configs/)) and once in the React `clientTools` object ([src/lib/clientTools.ts](src/lib/clientTools.ts)).

| Tool               | Params          | Behaviour                                           | Returns                                         |
| ------------------ | --------------- | --------------------------------------------------- | ----------------------------------------------- |
| `highlightProject` | `{ projectId }` | Scrolls to and highlights the project card          | `"Highlighted <name>"` / `"Unknown project id"` |
| `filterByTech`     | `{ tech }`      | Filters cards by stack (case-insensitive substring) | match count                                     |
| `showContact`      | —               | Reveals the contact panel                           | `"Contact shown"`                               |

`highlightProject` and `filterByTech` are configured with `expects_response: true` (blocking), so the agent waits for the return string and appends it to the conversation — that's how it can say "three projects used GraphQL" after the UI actually filtered three cards. The valid `projectId` slugs live in [src/data/projects.ts](src/data/projects.ts) (generated once from the CV and hand-checked) and are repeated in the agent's system prompt.

## Setup

Prerequisites: Node 22+, pnpm, an ElevenLabs account (API key with **ElevenAgents: Write** scope).

```bash
pnpm install
cp .env.example .env   # fill in both values
pnpm dev
```

| Env var               | Purpose                                                           |
| --------------------- | ----------------------------------------------------------------- |
| `ELEVENLABS_API_KEY`  | Server-side only; used by `/api/signed-url` and the agent tooling |
| `ELEVENLABS_AGENT_ID` | The agent to mint signed URLs for                                 |

The agent itself is code: config lives in [agent/](agent/) and is pushed with the ElevenLabs CLI. See [docs/AGENT_SETUP.md](docs/AGENT_SETUP.md) to reproduce it from scratch (agent, tools, knowledge base, RAG index).

The knowledge base source (`knowledge/*.pdf`) is intentionally not committed — it is a CV with personal data. Drop your own PDF into `knowledge/` and run the upload script.

## Scripts

```bash
pnpm dev          # dev server
pnpm test         # Vitest unit tests (tool handlers, transcript, throttle, grid)
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm build        # production build
```

## Deploy

```bash
vercel link                                  # once
vercel env add ELEVENLABS_API_KEY production
vercel env add ELEVENLABS_AGENT_ID production
vercel --prod
```

## Notes on the developer experience

<!-- TODO: Andrii fills in honestly -->

- <!-- TODO: Andrii fills in honestly -->
- <!-- TODO: Andrii fills in honestly -->
- <!-- TODO: Andrii fills in honestly -->

## License

MIT — see [LICENSE](LICENSE).
