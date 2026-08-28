"use client";

import type { ConversationStatus } from "@elevenlabs/react";

const STATUS_LABEL: Record<ConversationStatus, string> = {
  disconnected: "standby",
  connecting: "connecting",
  connected: "on air",
  error: "error",
};

const DOT_STYLE: Record<ConversationStatus, string> = {
  disconnected: "bg-muted/50",
  connecting: "bg-accent live-dot",
  connected: "bg-accent live-dot",
  error: "bg-red-500",
};

type HeaderProps = {
  status: ConversationStatus;
  pingMs: number | null;
  onShowContact: () => void;
};

export function Header({ status, pingMs, onShowContact }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-line py-5">
      <h1 className="font-display text-lg font-semibold tracking-tight">Ask Andrii</h1>

      <div className="flex items-center gap-4">
        <span
          className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted uppercase"
          data-testid="session-status"
        >
          <span className={`h-2 w-2 rounded-full ${DOT_STYLE[status]}`} aria-hidden />
          {STATUS_LABEL[status]}
          {status === "connected" && pingMs !== null && (
            <span title="WebSocket ping">· {pingMs} ms</span>
          )}
        </span>
        <button
          onClick={onShowContact}
          className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-ink/40"
        >
          Contact
        </button>
      </div>
    </header>
  );
}
