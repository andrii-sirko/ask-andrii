"use client";

import { useEffect, useRef, useState } from "react";
import type { TranscriptEntry } from "@/lib/transcript";

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

  return (
    <section
      aria-label="Conversation transcript"
      className="flex h-[420px] flex-col rounded-xl border border-neutral-200 dark:border-neutral-800"
    >
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {entries.length === 0 ? (
          <p className="text-sm text-neutral-400 dark:text-neutral-500">
            The transcript appears here. Try asking: &ldquo;What did Andrii build at
            Mehrwerk?&rdquo;
          </p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className={entry.role === "user" ? "text-right" : "text-left"}>
              <span
                className={`inline-block max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  entry.role === "user"
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
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
          className="flex gap-2 border-t border-neutral-200 p-3 dark:border-neutral-800"
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
            className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-neutral-500 disabled:opacity-50 dark:border-neutral-700"
          />
          <button
            type="submit"
            disabled={!connected || !draft.trim()}
            className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-white disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
          >
            Send
          </button>
        </form>
      )}
    </section>
  );
}
