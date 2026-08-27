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
      className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-700 dark:bg-amber-950/40"
    >
      <p>
        This is a live voice conversation — your browser will ask for microphone access next. Audio
        is streamed to ElevenLabs only while the session is active. No mic? Use{" "}
        <strong>text mode</strong> instead (checkbox in the header).
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={onConfirm}
          className="rounded-lg bg-neutral-900 px-4 py-1.5 font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
        >
          Continue
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-neutral-300 px-4 py-1.5 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
