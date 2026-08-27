import { describe, expect, it } from "vitest";
import { transcriptReducer, type TranscriptEntry } from "./transcript";

describe("transcriptReducer", () => {
  it("appends messages with increasing ids", () => {
    let state: TranscriptEntry[] = [];
    state = transcriptReducer(state, { type: "message", role: "user", text: "Hi" });
    state = transcriptReducer(state, { type: "message", role: "agent", text: "Hello!" });
    expect(state.map((e) => [e.role, e.text])).toEqual([
      ["user", "Hi"],
      ["agent", "Hello!"],
    ]);
    expect(state[1].id).toBeGreaterThan(state[0].id);
  });

  it("ignores empty or whitespace-only messages", () => {
    const state = transcriptReducer([], { type: "message", role: "agent", text: "   " });
    expect(state).toEqual([]);
  });

  it("drops a consecutive duplicate from the same role (server echo)", () => {
    let state: TranscriptEntry[] = [];
    state = transcriptReducer(state, { type: "message", role: "user", text: "Same question" });
    state = transcriptReducer(state, { type: "message", role: "user", text: "Same question" });
    expect(state).toHaveLength(1);
  });

  it("keeps identical text when roles differ", () => {
    let state: TranscriptEntry[] = [];
    state = transcriptReducer(state, { type: "message", role: "user", text: "Echo" });
    state = transcriptReducer(state, { type: "message", role: "agent", text: "Echo" });
    expect(state).toHaveLength(2);
  });

  it("clears the transcript", () => {
    let state: TranscriptEntry[] = [];
    state = transcriptReducer(state, { type: "message", role: "user", text: "Hi" });
    expect(transcriptReducer(state, { type: "clear" })).toEqual([]);
  });
});
