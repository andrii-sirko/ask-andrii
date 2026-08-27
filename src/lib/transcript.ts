export type TranscriptEntry = {
  id: number;
  role: "user" | "agent";
  text: string;
};

export type TranscriptAction =
  { type: "message"; role: "user" | "agent"; text: string } | { type: "clear" };

let nextId = 0;

export function transcriptReducer(
  state: TranscriptEntry[],
  action: TranscriptAction,
): TranscriptEntry[] {
  switch (action.type) {
    case "message": {
      const text = action.text.trim();
      if (!text) return state;
      // In text mode we append the typed message locally AND the server may echo
      // it back via onMessage — drop consecutive duplicates from the same role.
      const last = state[state.length - 1];
      if (last && last.role === action.role && last.text === text) return state;
      return [...state, { id: nextId++, role: action.role, text }];
    }
    case "clear":
      return [];
  }
}
