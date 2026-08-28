"use client";

import type { Project } from "@/data/projects";
import { matchesTech } from "@/lib/clientTools";

type ProjectsGridProps = {
  projects: Project[];
  highlightedId: string | null;
  techFilter: string | null;
  onClearFilter: () => void;
};

export function ProjectsGrid({
  projects,
  highlightedId,
  techFilter,
  onClearFilter,
}: ProjectsGridProps) {
  const visible = projects.filter((p) => matchesTech(p, techFilter));

  return (
    <section aria-label="Projects">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-display text-xl font-semibold tracking-tight">Projects &amp; roles</h2>
        {techFilter && (
          <button
            onClick={onClearFilter}
            className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs text-accent hover:bg-accent/20"
          >
            filtered: {techFilter} — clear ✕
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((project) => {
          const highlighted = project.id === highlightedId;
          return (
            <article
              key={project.id}
              id={`project-${project.id}`}
              data-testid={`project-${project.id}`}
              className={`rounded-2xl border bg-card p-5 transition-all duration-300 ${
                highlighted
                  ? "border-accent ring-2 ring-accent/40"
                  : "border-line hover:border-ink/25"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display font-semibold">{project.company}</h3>
                <span className="shrink-0 font-mono text-[11px] text-muted">{project.dates}</span>
              </div>
              <p className="text-sm text-muted">{project.role}</p>
              <p className="mt-2.5 text-sm leading-relaxed">{project.summary}</p>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
