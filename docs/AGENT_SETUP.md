# Reproducing the "Ask Andrii" agent

The agent is managed as code with the [ElevenLabs CLI](https://elevenlabs.io/docs/eleven-agents/operate/cli) (`@elevenlabs/cli`). Everything except the knowledge-base upload is a CLI push; the upload has a small script because the CLI has no knowledge-base command (as of Aug 2026).

All commands run with `ELEVENLABS_API_KEY` exported (or via `elevenlabs auth login`).

## 1. Agent + client tools (CLI)

Configs live in [`agent/`](../agent/):

- `agent/agents.json` — registry mapping the agent name to its config file and ElevenLabs id
- `agent/agent_configs/Ask-Andrii.json` — system prompt, LLM (`gemini-2.5-flash`), voice, first message, `tool_ids`, `knowledge_base`, `rag.enabled`, and `platform_settings.auth.enable_auth: true`
- `agent/tool_configs/*.json` — the three client tools; `highlightProject` and `filterByTech` have `expects_response: true` (blocking)

To push changes (or recreate after editing ids):

```bash
cd agent
pnpm dlx @elevenlabs/cli tools push
pnpm dlx @elevenlabs/cli agents push
```

Recreating from zero: `elevenlabs agents add "Ask Andrii" --template minimal` and `elevenlabs tools add <name> --type client` first — these create the resources and write their ids into `agents.json` / `tools.json`; then restore the configs from git and push.

## 2. Knowledge base + RAG (script)

```bash
# put the CV at knowledge/CV_Andrii_Sirko.pdf (not committed — personal data)
node --env-file=.env scripts/upload-knowledge.mjs
```

The script prints the document id. Put it into `agent_configs/Ask-Andrii.json` under `prompt.knowledge_base[0].id`, then compute the RAG index:

```bash
node --env-file=.env -e "fetch('https://api.elevenlabs.io/v1/convai/knowledge-base/<DOC_ID>/rag-index',{method:'POST',headers:{'xi-api-key':process.env.ELEVENLABS_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:'multilingual_e5_large_instruct'})}).then(r=>r.json()).then(console.log)"
```

Re-push the agent afterwards (`elevenlabs agents push`).

## 3. Auth settings

`platform_settings.auth.enable_auth: true` is in the agent config — connections require a signed URL. Per the docs, do **not** additionally configure an allowlist; the two must not be combined on the same agent.

## Dashboard fallback

If you prefer clicking: create an agent named "Ask Andrii", paste the system prompt and first message from `agent_configs/Ask-Andrii.json`, pick LLM Gemini 2.5 Flash / temperature 0, any neutral English voice, language English. Add the three client tools with the exact names, descriptions, and parameter schemas from `tool_configs/` (mark the first two "wait for response"). Upload the CV under Knowledge Base, attach it to the agent, enable RAG. Under Security, enable signed-URL auth ("Require authentication") and leave the allowlist empty.
