/**
 * Uploads knowledge/CV_Andrii_Sirko.pdf to the ElevenLabs knowledge base and
 * prints the document id. The CLI has no knowledge-base command yet, so this
 * script keeps the step reproducible from the repo.
 *
 *   node --env-file=.env scripts/upload-knowledge.mjs
 *
 * Put the returned id into agent/agent_configs/Ask-Andrii.json under
 * prompt.knowledge_base, then run `elevenlabs agents push` from agent/.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("Set ELEVENLABS_API_KEY (use --env-file=.env)");
  process.exit(1);
}

const filePath = path.resolve(import.meta.dirname, "../knowledge/CV_Andrii_Sirko.pdf");
const fileName = path.basename(filePath);
const buffer = await readFile(filePath);

const form = new FormData();
form.append("file", new Blob([buffer], { type: "application/pdf" }), fileName);
form.append("name", fileName);

const res = await fetch("https://api.elevenlabs.io/v1/convai/knowledge-base/file", {
  method: "POST",
  headers: { "xi-api-key": apiKey },
  body: form,
});

if (!res.ok) {
  console.error(`Upload failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}

const doc = await res.json();
console.log(JSON.stringify(doc, null, 2));
