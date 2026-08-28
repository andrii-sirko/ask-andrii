"use client";

import { useEffect, useRef, useState } from "react";
import type { TranscriptEntry } from "@/lib/transcript";

const SUGGESTIONS = [
  "What did Andrii build at Mehrwerk?",
  "Which projects used React Native?",
  "How can I get in touch?",
];

type TranscriptProps = {
  entries: TranscriptEntry[];
  connected: boolean;
  textMode: boolean;
  onSendText: (text: string) => void;
};

export function Transcript({ entries, connected, textMode, onSendText }: TranscriptProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [entries]);

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    onSendText(text);
    setDraft("");
  };

  const canSend = connected && textMode;

  return (
    <section
      aria-label="Conversation transcript"
      className="flex h-[440px] flex-col rounded-2xl border border-line bg-card"
    >
      <div className="border-b border-line px-4 py-2.5 font-mono text-xs tracking-widest text-muted uppercase">
        Transcript
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {entries.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              The conversation appears here, word for word. Try asking:
            </p>
            <ul className="space-y-2">
              {SUGGESTIONS.map((q) =>
                canSend ? (
                  <li key={q}>
                    <button
                      onClick={() => onSendText(q)}
                      className="rounded-full border border-line px-3 py-1.5 text-left text-sm text-ink hover:border-accent hover:text-accent"
                    >
                      {q}
                    </button>
                  </li>
                ) : (
                  <li key={q} className="text-sm text-muted italic">
                    &ldquo;{q}&rdquo;
                  </li>
                ),
              )}
            </ul>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className={entry.role === "user" ? "text-right" : "text-left"}>
              <span
                className={`inline-block max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  entry.role === "user"
                    ? "rounded-br-md bg-ink text-paper"
                    : "rounded-bl-md border border-line bg-paper text-ink"
                }`}
              >
                {entry.text}
              </span>
            </div>
          ))
        )}
      </div>

      {textMode && (
        <form
          className="flex gap-2 border-t border-line p-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={connected ? "Type a question…" : "Start the session first"}
            disabled={!connected}
            className="min-w-0 flex-1 rounded-full border border-line bg-transparent px-4 py-2 text-sm outline-none focus:border-accent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!connected || !draft.trim()}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-40"
          >
            Send
          </button>
        </form>
      )}
    </section>
  );
}
