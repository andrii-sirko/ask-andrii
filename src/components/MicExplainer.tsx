"use client";

type MicExplainerProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

export function MicExplainer({ onConfirm, onCancel }: MicExplainerProps) {
  return (
    <div
      role="dialog"
      aria-label="Microphone permission"
      className="max-w-md rounded-2xl border border-accent/40 bg-card p-5 text-left text-sm"
    >
      <p className="font-mono text-xs tracking-widest text-accent uppercase">Mic check</p>
      <p className="mt-2 leading-relaxed">
        This is a live voice conversation — your browser will ask for microphone access next. Audio
        is streamed to ElevenLabs only while the session is active. No mic? Cancel and pick{" "}
        <strong>Type instead</strong>.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onConfirm}
          className="rounded-full bg-ink px-5 py-2 font-medium text-paper hover:opacity-85"
        >
          Continue
        </button>
        <button
          onClick={onCancel}
          className="rounded-full border border-line px-5 py-2 hover:border-ink/40"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
