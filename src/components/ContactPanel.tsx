"use client";

type ContactPanelProps = {
  contact: { email: string; linkedin: string; portfolio: string };
  onClose: () => void;
};

export function ContactPanel({ contact, onClose }: ContactPanelProps) {
  return (
    <aside
      data-testid="contact-panel"
      className="mt-4 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Contact</h2>
        <button
          onClick={onClose}
          aria-label="Close contact panel"
          className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          ✕
        </button>
      </div>
      <ul className="mt-2 space-y-1 text-sm">
        <li>
          <a href={`mailto:${contact.email}`} className="underline">
            {contact.email}
          </a>
        </li>
        <li>
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="underline">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={contact.portfolio} target="_blank" rel="noreferrer" className="underline">
            Portfolio
          </a>
        </li>
      </ul>
    </aside>
  );
}
