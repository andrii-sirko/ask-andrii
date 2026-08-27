# Claude Code prompt — "Ask Andrii" voice agent demo

Copy everything below the line into Claude Code. Before you start, have ready: an ElevenLabs API key, a GitHub repo (empty), a Vercel account with `vercel` CLI logged in, and your CV as a PDF or Markdown file.

---

## Goal

Build and deploy a small, production-quality demo that shows I can integrate ElevenLabs Agents into a real React product. This is a portfolio artifact for a job application at ElevenLabs, so code quality, honesty in the README, and a clean deploy matter more than feature count. Time box: this should be shippable in one session.

**What it does:** "Ask Andrii" — a voice agent that answers questions about my CV and projects from a knowledge base, and can drive the UI through client tools (e.g. highlight the project it's talking about). A visitor clicks "Talk to the agent", grants mic access, asks "What did Andrii build at Mehrwerk?", and the agent answers from the knowledge base while the matching project card lights up on screen.

## Non-negotiables

1. **Verify the SDK against current docs before writing any code.** Fetch and read:
   - https://elevenlabs.io/docs/eleven-agents/libraries/react
   - https://elevenlabs.io/docs/eleven-agents/customization/authentication
   - https://elevenlabs.io/docs/eleven-agents/customization/tools/client-tools
   - The knowledge-base / RAG docs for agents
   - Check whether an official ElevenLabs agent skill exists (github.com/elevenlabs/skills) and use it if so.
     My notes below reflect docs as of early 2026; if the API has moved, follow the docs, not my notes. Use `@elevenlabs/react` — the `@11labs/*` packages are deprecated.
2. **The ElevenLabs API key never reaches the browser.** No `NEXT_PUBLIC_ELEVENLABS_API_KEY`. The client gets a short-lived signed URL (or conversation token) from a Next.js route handler that calls `GET https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=…` with the `xi-api-key` header server-side.
3. **Don't invent facts about me.** The knowledge base is built only from the CV file I put in `knowledge/`. Don't embellish, don't add projects, don't guess dates.
4. **Ask before anything that costs money or creates accounts.** Creating the agent on ElevenLabs is fine; anything beyond the free/existing plan, ask first.
5. **Do not commit `.env*` files.** Provide `.env.example`.

## Stack

- Next.js (latest stable, App Router), TypeScript strict, Tailwind. Minimal UI — clean, no component library needed, dark/light via `prefers-color-scheme`.
- `@elevenlabs/react` for the conversation session.
- Vitest + React Testing Library for a handful of unit tests (tool handlers, transcript state). Don't test the SDK itself.
- Deploy target: Vercel.
- Package manager: pnpm.

## Agent setup

Prefer **agents-as-code** via the ElevenLabs CLI (`@elevenlabs/cli`: `elevenlabs agents init` / `add` / `push`) so the agent config lives in the repo. If the CLI doesn't support knowledge base upload or client-tool definitions cleanly, fall back to configuring the agent in the dashboard and write a precise `docs/AGENT_SETUP.md` with every setting I must enter (system prompt, tools with parameter schemas, knowledge base files, auth mode). Either way, I must be able to reproduce the agent from the repo.

Agent configuration:

- **Name:** Ask Andrii
- **System prompt:** Something like: "You are an assistant that answers questions about Andrii Sirko's professional background, using only the attached knowledge base. Be concise and conversational — this is voice, so no lists or markdown. When you talk about a specific project or employer, call the `highlightProject` tool with its id. When asked something not covered by the knowledge base, say so plainly; don't guess. If the user asks how to contact Andrii, call `showContact`." Write the actual prompt carefully; keep it under ~200 words.
- **Knowledge base:** the file(s) in `knowledge/`. RAG enabled.
- **LLM:** whichever default is cheapest and adequate; don't over-pick.
- **Voice:** any neutral English voice. Language: English.
- **Turn eagerness:** normal.
- **Auth:** signed URLs enabled (`enable_auth`). Do NOT also set an allowlist — docs say don't combine them.
- **First message:** short — "Hi, I can answer questions about Andrii's work. What would you like to know?"

## Client tools

Define these in the agent config AND implement them in the React `clientTools` object. The names and parameter schemas must match exactly.

| Tool               | Params                  | Behaviour                                                                                                                                      | Return to agent                                  |
| ------------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `highlightProject` | `{ projectId: string }` | Scrolls to and visually highlights the matching project card; clears previous highlight. Unknown id → no-op.                                   | `"Highlighted <name>"` or `"Unknown project id"` |
| `filterByTech`     | `{ tech: string }`      | Filters the visible project cards to those whose stack includes `tech` (case-insensitive substring). Empty result → show all + return message. | Count of matches                                 |
| `showContact`      | none                    | Opens/reveals a contact panel with email and LinkedIn from the CV.                                                                             | `"Contact shown"`                                |

Mark `highlightProject` and `filterByTech` as **blocking** in the agent config so the agent waits for the return value (per docs, non-blocking tools assume success). Valid `projectId`s: derive a stable slug list from the CV (e.g. `about-you`, `selectcode`, `mehrwerk`, `ebay-adevinta`, `accenture-smart`, `lemon-markets`, `accenture-vw-audi`, `factor-eleven`, `tooltime`, `careem`, `circula`, `mesmo`, `ukeess`) and put the list with one-line descriptions into the system prompt so the agent knows the ids.

## UI

Single page:

- Header: name, one-line title, "Talk to the agent" / "End" button, connection status pill (idle / connecting / connected / error), agent state (listening / speaking), and a small latency readout from `onPing` (`ping_ms`).
- Mic-permission explainer shown before the first session starts (docs recommend this).
- **Transcript panel:** live list of user and agent messages from `onMessage`, auto-scroll, with a "text mode" toggle that starts the session with `textOnly: true` and shows a text input — so someone without a mic can still try it.
- **Projects grid:** one card per CV entry (company, role, dates, 1–2 line summary, stack tags). Cards are the target of `highlightProject` and `filterByTech`. A "clear filter" control.
- **Contact panel:** hidden until `showContact` fires or the user clicks a contact button.
- Footer: link to the GitHub repo and a one-liner "Built with ElevenLabs Agents + Next.js".

Keep the data for cards in `src/data/projects.ts`, generated from the CV once and hand-checked — the same source drives the tool `projectId` list.

## Server

- `app/api/signed-url/route.ts` — GET, server-only, reads `ELEVENLABS_API_KEY` and `ELEVENLABS_AGENT_ID`, returns `{ signedUrl }`. Handle non-OK upstream responses with a 502 and a log line; never leak the key or upstream body to the client.
- Basic abuse protection: simple per-IP throttling appropriate for serverless (note in the README that in-memory limits don't persist across Vercel invocations; suggest Vercel KV / Upstash as the real fix — don't implement it).
- `Cache-Control: no-store` on the route.

## Repo hygiene

- `README.md`: what it is, architecture diagram (ASCII is fine), how the signed-URL flow works, how client tools round-trip, setup steps, env vars, deploy steps. Include a section titled **"Notes on the developer experience"** with three bullet placeholders marked `<!-- TODO: Andrii fills in honestly -->` — I will write these myself; do not write them for me.
- `docs/AGENT_SETUP.md` (see above) if the dashboard path is used.
- `.env.example` with `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID`.
- ESLint + Prettier, `pnpm lint`, `pnpm test`, `pnpm typecheck` all green before you say you're done.
- Conventional commits, small and meaningful. Initial commit → working local version → tests → deploy.
- MIT license.

## Deployment

1. `vercel link` to the project (ask me for project name if needed), set env vars with `vercel env add` for production, `vercel --prod`.
2. After deploy, open the production URL and confirm: page loads, signed-URL route returns 200, a session connects (I'll do the mic test myself — tell me when it's ready and what to click).
3. Print the production URL and the exact command to redeploy.

## Working style

- Start by fetching the docs and writing a short plan (≤15 lines) with any deviations from this spec because the SDK changed. Wait for my OK on the plan, then build without further check-ins unless blocked.
- If something in the ElevenLabs API doesn't work as documented, don't hack around it silently — tell me what you found; that's exactly the kind of DX observation I need for the README.
- When done, give me a 10-line summary: what's deployed, what I need to configure manually, what you'd improve with more time.
