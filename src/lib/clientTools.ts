import type { Project } from "@/data/projects";

/**
 * UI actions the tools can trigger. Implemented by the page component;
 * kept as an interface so the tool handlers are unit-testable without React.
 */
export type ToolActions = {
  highlight: (projectId: string) => void;
  setTechFilter: (tech: string | null) => void;
  showContact: () => void;
};

/**
 * Client tools called by the ElevenLabs agent. Names and parameter shapes
 * must match the tool definitions in agent/tool_configs/ exactly
 * (case-sensitive). `highlightProject` and `filterByTech` are configured
 * with expects_response=true ("blocking"), so their return strings are
 * appended to the conversation and the agent waits for them.
 */
export function createClientTools(projects: Project[], actions: ToolActions) {
  return {
    highlightProject: ({ projectId }: { projectId: string }): string => {
      const project = projects.find((p) => p.id === projectId);
      if (!project) {
        return "Unknown project id";
      }
      actions.highlight(project.id);
      return `Highlighted ${project.company}`;
    },

    filterByTech: ({ tech }: { tech: string }): string => {
      const needle = tech.trim().toLowerCase();
      if (!needle) {
        actions.setTechFilter(null);
        return "Empty tech filter; showing all projects";
      }
      const matches = projects.filter((p) => p.stack.some((s) => s.toLowerCase().includes(needle)));
      if (matches.length === 0) {
        actions.setTechFilter(null);
        return `No projects use ${tech}; showing all projects instead`;
      }
      actions.setTechFilter(needle);
      return `${matches.length} project${matches.length === 1 ? " matches" : "s match"} ${tech}`;
    },

    showContact: (): string => {
      actions.showContact();
      return "Contact shown";
    },
  };
}

/** The filter predicate shared by the UI and `filterByTech`. */
export function matchesTech(project: Project, techFilter: string | null): boolean {
  if (!techFilter) return true;
  const needle = techFilter.toLowerCase();
  return project.stack.some((s) => s.toLowerCase().includes(needle));
}
