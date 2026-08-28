"use client";

import { useCallback, useState } from "react";
import { useConversationControls, useConversationStatus } from "@elevenlabs/react";
import type { Project, contact as contactData } from "@/data/projects";
import type { TranscriptEntry } from "@/lib/transcript";
import { Header } from "@/components/Header";
import { VoiceStage } from "@/components/VoiceStage";
import { Transcript } from "@/components/Transcript";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { ContactPanel } from "@/components/ContactPanel";

type Contact = typeof contactData;

type AppShellProps = {
  projects: Project[];
  contact: Contact;
  transcript: TranscriptEntry[];
  appendTranscript: (role: "user" | "agent", text: string) => void;
  highlightedId: string | null;
  techFilter: string | null;
  onClearFilter: () => void;
  contactOpen: boolean;
  onToggleContact: () => void;
  pingMs: number | null;
};

export function AppShell({
  projects,
  contact,
  transcript,
  appendTranscript,
  highlightedId,
  techFilter,
  onClearFilter,
  contactOpen,
  onToggleContact,
  pingMs,
}: AppShellProps) {
  const { startSession, endSession, sendUserMessage } = useConversationControls();
  const { status, message: statusMessage } = useConversationStatus();

  const [textMode, setTextMode] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const connectSession = useCallback(
    async (asTextMode: boolean) => {
      setStartError(null);
      setTextMode(asTextMode);
      try {
        const res = await fetch("/api/signed-url");
        if (!res.ok) {
          throw new Error(
            res.status === 429
              ? "Too many requests — try again in a minute"
              : "Could not get a session URL",
          );
        }
        const { signedUrl } = (await res.json()) as { signedUrl: string };
        startSession({ signedUrl, connectionType: "websocket", textOnly: asTextMode });
      } catch (err) {
        setStartError(err instanceof Error ? err.message : "Failed to start the session");
      }
    },
    [startSession],
  );

  const handleSendText = useCallback(
    (text: string) => {
      appendTranscript("user", text);
      sendUserMessage(text);
    },
    [appendTranscript, sendUserMessage],
  );

  const errorText =
    startError ?? (status === "error" ? (statusMessage ?? "Connection error") : null);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6">
      <Header status={status} pingMs={pingMs} onShowContact={onToggleContact} />

      <VoiceStage
        status={status}
        errorText={errorText}
        onStartVoice={() => void connectSession(false)}
        onStartText={() => void connectSession(true)}
        onEnd={endSession}
      />

      <main className="grid flex-1 gap-8 pb-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="order-2 lg:order-1">
          <ProjectsGrid
            projects={projects}
            highlightedId={highlightedId}
            techFilter={techFilter}
            onClearFilter={onClearFilter}
          />
        </div>
        <div className="order-1 lg:order-2">
          <div className="space-y-4 lg:sticky lg:top-6">
            <Transcript
              entries={transcript}
              connected={status === "connected"}
              textMode={textMode}
              onSendText={handleSendText}
            />
            {contactOpen && <ContactPanel contact={contact} onClose={onToggleContact} />}
          </div>
        </div>
      </main>

      <footer className="border-t border-line py-6 font-mono text-xs text-muted">
        <a href="https://github.com/andrii-sirko/ask-andrii" className="underline hover:text-ink">
          Source on GitHub
        </a>{" "}
        · Built with ElevenLabs Agents + Next.js
      </footer>
    </div>
  );
}
