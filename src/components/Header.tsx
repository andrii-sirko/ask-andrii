"use client";

import type { ConversationStatus } from "@elevenlabs/react";
import { useConversationMode } from "@elevenlabs/react";

const STATUS_LABEL: Record<ConversationStatus, string> = {
  disconnected: "idle",
  connecting: "connecting",
  connected: "connected",
  error: "error",
};

const STATUS_STYLE: Record<ConversationStatus, string> = {
  disconnected: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  connecting: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  connected: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  error: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

function AgentMode() {
  const { mode } = useConversationMode();
  return (
    <span className="text-sm text-neutral-500 dark:text-neutral-400">
      {mode === "speaking" ? "speaking…" : "listening…"}
    </span>
  );
}

type HeaderProps = {
  status: ConversationStatus;
  errorText: string | null;
  pingMs: number | null;
  textMode: boolean;
  onToggleTextMode: () => void;
  onStart: () => void;
  onEnd: () => void;
  onShowContact: () => void;
};

export function Header({
  status,
  errorText,
  pingMs,
  textMode,
  onToggleTextMode,
  onStart,
  onEnd,
  onShowContact,
}: HeaderProps) {
  const active = status === "connected" || status === "connecting";

  return (
    <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-neutral-200 py-6 dark:border-neutral-800">
      <div className="mr-auto">
        <h1 className="text-xl font-semibold">Ask Andrii</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          A voice agent that answers questions about Andrii Sirko&apos;s work — and drives this page
          while it talks.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[status]}`}
          title={errorText ?? undefined}
        >
          {STATUS_LABEL[status]}
        </span>
        {status === "connected" && <AgentMode />}
        {pingMs !== null && (
          <span className="font-mono text-xs text-neutral-400" title="WebSocket ping">
            {pingMs} ms
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label className="flex cursor-pointer items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-300">
          <input
            type="checkbox"
            checked={textMode}
            onChange={onToggleTextMode}
            disabled={active}
            className="accent-neutral-900 dark:accent-neutral-100"
          />
          text mode
        </label>
        <button
          onClick={onShowContact}
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Contact
        </button>
        {active ? (
          <button
            onClick={onEnd}
            className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700"
          >
            End
          </button>
        ) : (
          <button
            onClick={onStart}
            className="rounded-lg bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            {textMode ? "Chat with the agent" : "Talk to the agent"}
          </button>
        )}
      </div>

      {errorText && (
        <p className="w-full text-sm text-red-600 dark:text-red-400" role="alert">
          {errorText}
        </p>
      )}
    </header>
  );
}
