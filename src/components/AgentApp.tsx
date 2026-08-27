"use client";

import { useCallback, useMemo, useReducer, useState } from "react";
import { ConversationProvider } from "@elevenlabs/react";
import { contact, projects } from "@/data/projects";
import { createClientTools } from "@/lib/clientTools";
import { transcriptReducer } from "@/lib/transcript";
import { AppShell } from "@/components/AppShell";

export function AgentApp() {
  const [transcript, dispatchTranscript] = useReducer(transcriptReducer, []);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [techFilter, setTechFilter] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [pingMs, setPingMs] = useState<number | null>(null);

  const highlight = useCallback((projectId: string) => {
    setHighlightedId(projectId);
    document
      .getElementById(`project-${projectId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const clientTools = useMemo(
    () =>
      createClientTools(projects, {
        highlight,
        setTechFilter,
        showContact: () => setContactOpen(true),
      }),
    [highlight],
  );

  return (
    <ConversationProvider
      clientTools={clientTools}
      onMessage={({ message, role }) =>
        dispatchTranscript({ type: "message", role, text: message })
      }
      onPing={({ ping_ms }) => setPingMs(ping_ms ?? null)}
      onDisconnect={() => setPingMs(null)}
    >
      <AppShell
        projects={projects}
        contact={contact}
        transcript={transcript}
        appendTranscript={(role, text) => dispatchTranscript({ type: "message", role, text })}
        highlightedId={highlightedId}
        techFilter={techFilter}
        onClearFilter={() => setTechFilter(null)}
        contactOpen={contactOpen}
        onToggleContact={() => setContactOpen((v) => !v)}
        pingMs={pingMs}
      />
    </ConversationProvider>
  );
}
