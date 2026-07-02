import type { ComponentType } from "react";

export type GameDifficulty = "Chill" | "Medium" | "Chaos";
export type GameMode = "free_for_all" | "team_vs_team";
export type GameStatus = "MVP" | "Placeholder";
export type GameKind = "clue" | "acting" | "heads_up" | "rapid_fire" | "emoji" | "placeholder";

export type GamePrompt = {
  prompt: string;
  answer: string;
  helperText: string;
};

export type GameDefinition = {
  id: string;
  name: string;
  description: string;
  rules: string[];
  tutorial: string[];
  categories: string[];
  supportedModes: GameMode[];
  scoringRules: {
    correct: number;
    fastBonus: number;
    skip: number;
    wrong: number;
  };
  difficulty: GameDifficulty;
  status: GameStatus;
  kind: GameKind;
  component?: ComponentType<{ game: GameDefinition }>;
  sampleData: GamePrompt[];
};
