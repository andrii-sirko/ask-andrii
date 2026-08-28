"use client";

type ContactPanelProps = {
  contact: { email: string; linkedin: string; portfolio: string };
  onClose: () => void;
};

export function ContactPanel({ contact, onClose }: ContactPanelProps) {
  const links = [
    { label: "Email", href: `mailto:${contact.email}`, text: contact.email },
    { label: "LinkedIn", href: contact.linkedin, text: contact.linkedin.replace("https://", "") },
    {
      label: "Portfolio",
      href: contact.portfolio,
      text: contact.portfolio.replace("https://", ""),
    },
  ];

  return (
    <aside data-testid="contact-panel" className="rounded-2xl border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <h2 className="font-mono text-xs tracking-widest text-muted uppercase">Contact</h2>
        <button
          onClick={onClose}
          aria-label="Close contact panel"
          className="text-muted hover:text-ink"
        >
          ✕
        </button>
      </div>
      <ul className="space-y-2.5 p-4 text-sm">
        {links.map(({ label, href, text }) => (
          <li key={label} className="flex items-baseline gap-3">
            <span className="w-16 shrink-0 font-mono text-[11px] text-muted uppercase">
              {label}
            </span>
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              className="truncate underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
