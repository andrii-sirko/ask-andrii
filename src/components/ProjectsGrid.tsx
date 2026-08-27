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
        <h2 className="text-lg font-semibold">Projects &amp; roles</h2>
        {techFilter && (
          <button
            onClick={onClearFilter}
            className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            filtered by &ldquo;{techFilter}&rdquo; — clear ✕
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
              className={`rounded-xl border p-4 transition-all duration-300 ${
                highlighted
                  ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/50 dark:bg-emerald-950/40"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-medium">{project.company}</h3>
                <span className="shrink-0 text-xs text-neutral-400">{project.dates}</span>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{project.role}</p>
              <p className="mt-2 text-sm leading-relaxed">{project.summary}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
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
