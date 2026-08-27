import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectsGrid } from "./ProjectsGrid";
import { projects } from "@/data/projects";

describe("ProjectsGrid", () => {
  it("renders every project when no filter is active", () => {
    render(
      <ProjectsGrid
        projects={projects}
        highlightedId={null}
        techFilter={null}
        onClearFilter={() => {}}
      />,
    );
    expect(screen.getAllByRole("article")).toHaveLength(projects.length);
  });

  it("shows only matching projects when a tech filter is set", () => {
    render(
      <ProjectsGrid
        projects={projects}
        highlightedId={null}
        techFilter="magento"
        onClearFilter={() => {}}
      />,
    );
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("UKEESS")).toBeInTheDocument();
  });

  it("clears the filter via the clear control", async () => {
    const onClearFilter = vi.fn();
    render(
      <ProjectsGrid
        projects={projects}
        highlightedId={null}
        techFilter="react"
        onClearFilter={onClearFilter}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /clear/i }));
    expect(onClearFilter).toHaveBeenCalled();
  });

  it("marks the highlighted project card", () => {
    render(
      <ProjectsGrid
        projects={projects}
        highlightedId="mehrwerk"
        techFilter={null}
        onClearFilter={() => {}}
      />,
    );
    expect(screen.getByTestId("project-mehrwerk").className).toContain("ring-2");
  });
});
