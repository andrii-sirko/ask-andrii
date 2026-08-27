import { describe, expect, it, vi } from "vitest";
import { createClientTools, matchesTech, type ToolActions } from "./clientTools";
import type { Project } from "@/data/projects";

const projects: Project[] = [
  {
    id: "mehrwerk",
    company: "Mehrwerk",
    role: "Frontend Lead",
    dates: "2021–2025",
    summary: "Led a team of 5.",
    stack: ["TypeScript", "React", "Ionic"],
  },
  {
    id: "careem",
    company: "Careem",
    role: "Senior Software Developer",
    dates: "2018–2019",
    summary: "Corporate customers.",
    stack: ["React", "React Native", "Redux"],
  },
];

function makeActions(): ToolActions {
  return {
    highlight: vi.fn(),
    setTechFilter: vi.fn(),
    showContact: vi.fn(),
  };
}

describe("highlightProject", () => {
  it("highlights a known project and reports the company name", () => {
    const actions = makeActions();
    const tools = createClientTools(projects, actions);
    expect(tools.highlightProject({ projectId: "mehrwerk" })).toBe("Highlighted Mehrwerk");
    expect(actions.highlight).toHaveBeenCalledWith("mehrwerk");
  });

  it("is a no-op for an unknown id", () => {
    const actions = makeActions();
    const tools = createClientTools(projects, actions);
    expect(tools.highlightProject({ projectId: "nope" })).toBe("Unknown project id");
    expect(actions.highlight).not.toHaveBeenCalled();
  });
});

describe("filterByTech", () => {
  it("filters case-insensitively by substring and returns the count", () => {
    const actions = makeActions();
    const tools = createClientTools(projects, actions);
    expect(tools.filterByTech({ tech: "react native" })).toBe("1 project matches react native");
    expect(actions.setTechFilter).toHaveBeenCalledWith("react native");
  });

  it("clears the filter and says so when nothing matches", () => {
    const actions = makeActions();
    const tools = createClientTools(projects, actions);
    expect(tools.filterByTech({ tech: "COBOL" })).toBe(
      "No projects use COBOL; showing all projects instead",
    );
    expect(actions.setTechFilter).toHaveBeenCalledWith(null);
  });

  it("treats a blank filter as show-all", () => {
    const actions = makeActions();
    const tools = createClientTools(projects, actions);
    expect(tools.filterByTech({ tech: "  " })).toBe("Empty tech filter; showing all projects");
    expect(actions.setTechFilter).toHaveBeenCalledWith(null);
  });
});

describe("showContact", () => {
  it("opens the contact panel", () => {
    const actions = makeActions();
    const tools = createClientTools(projects, actions);
    expect(tools.showContact()).toBe("Contact shown");
    expect(actions.showContact).toHaveBeenCalled();
  });
});

describe("matchesTech", () => {
  it("matches everything when no filter is set", () => {
    expect(projects.every((p) => matchesTech(p, null))).toBe(true);
  });

  it("matches stack entries by case-insensitive substring", () => {
    expect(matchesTech(projects[0], "ionic")).toBe(true);
    expect(matchesTech(projects[1], "ionic")).toBe(false);
  });
});
