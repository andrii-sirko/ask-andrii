"use client";

import { useState } from "react";
import type { ConversationStatus } from "@elevenlabs/react";
import { useConversationMode } from "@elevenlabs/react";
import { MicExplainer } from "@/components/MicExplainer";

// Deterministic bar heights so server and client render the same waveform.
const BAR_HEIGHTS = Array.from({ length: 36 }, (_, i) => {
  const wave = Math.sin(i * 0.9) * Math.sin(i * 0.35);
  return Math.round(12 + Math.abs(wave) * 30);
});

function Waveform({ status }: { status: ConversationStatus }) {
  const { mode } = useConversationMode();

  const state =
    status === "connected"
      ? mode === "speaking"
        ? "vu-speaking"
        : "vu-listening"
      : status === "connecting"
        ? "vu-connecting"
        : "vu-idle";

  const barColor =
    status === "connected"
      ? mode === "speaking"
        ? "bg-accent"
        : "bg-ink/60"
      : status === "connecting"
        ? "bg-muted"
        : "bg-line";

  return (
    <div
      aria-hidden
      className={`flex h-14 items-center justify-center gap-[3px] sm:gap-1 ${state}`}
    >
      {BAR_HEIGHTS.map((h, i) => (
        <span
          key={i}
          className={`vu-bar w-[3px] rounded-full transition-colors duration-500 sm:w-1 ${barColor}`}
          style={{ height: h, animationDelay: `${(i % 9) * 90}ms` }}
        />
      ))}
    </div>
  );
}

function ModeReadout({ status }: { status: ConversationStatus }) {
  const { mode } = useConversationMode();
  if (status !== "connected") return null;
  return (
    <p className="font-mono text-xs tracking-widest text-muted uppercase" aria-live="polite">
      {mode === "speaking" ? "Agent speaking" : "Listening — go ahead"}
    </p>
  );
}

type VoiceStageProps = {
  status: ConversationStatus;
  errorText: string | null;
  onStartVoice: () => void;
  onStartText: () => void;
  onEnd: () => void;
};

export function VoiceStage({
  status,
  errorText,
  onStartVoice,
  onStartText,
  onEnd,
}: VoiceStageProps) {
  const [showMicExplainer, setShowMicExplainer] = useState(false);
  const live = status === "connected" || status === "connecting";

  return (
    <section
      aria-label="Voice session"
      className={`flex flex-col items-center text-center transition-all duration-500 ${
        live ? "gap-4 py-8" : "gap-6 py-14 sm:py-20"
      }`}
    >
      {!live && (
        <>
          <h2 className="font-display max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Don&apos;t read the CV. Interview it.
          </h2>
          <p className="max-w-xl text-base text-muted">
            A voice agent trained on Andrii Sirko&apos;s decade of frontend work. Ask it anything —
            it answers out loud and drives this page while it talks.
          </p>
        </>
      )}

      <Waveform status={status} />
      <ModeReadout status={status} />

      {showMicExplainer ? (
        <MicExplainer
          onConfirm={() => {
            setShowMicExplainer(false);
            onStartVoice();
          }}
          onCancel={() => setShowMicExplainer(false)}
        />
      ) : live ? (
        <button
          onClick={onEnd}
          className="rounded-full border border-line bg-card px-6 py-2.5 text-sm font-medium hover:border-ink/40"
        >
          End session
        </button>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowMicExplainer(true)}
            className="rounded-full bg-ink px-7 py-3 text-sm font-semibold text-paper hover:opacity-85"
          >
            Start talking
          </button>
          <button
            onClick={onStartText}
            className="rounded-full border border-line bg-card px-7 py-3 text-sm font-medium text-ink hover:border-ink/40"
          >
            Type instead
          </button>
        </div>
      )}

      {errorText && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errorText}
        </p>
      )}
    </section>
  );
}
