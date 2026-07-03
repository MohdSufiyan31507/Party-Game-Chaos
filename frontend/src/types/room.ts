export type RoomStatus = "lobby" | "team-setup" | "game-selection" | "closed";

export type RoomPlayer = {
  user: string;
  username: string;
  avatar: string;
  role: "host" | "player";
  joinedAt: string;
};

export type RoomTeam = {
  id: "red" | "blue";
  name: string;
  accent: "red" | "blue";
  playerIds: string[];
  memberNames?: string[];
};

export type GameplayState = {
  isActive: boolean;
  phase: "playing" | "round-result";
  currentPromptIndex: number;
  activeTeamId: "red" | "blue";
  round: number;
  roundDurationSeconds: number;
  roundEndsAt?: string;
  scores: {
    red: number;
    blue: number;
  };
  correct: {
    red: number;
    blue: number;
  };
  skips: {
    red: number;
    blue: number;
  };
  lastRoundResult?: {
    teamId: "red" | "blue";
    score: number;
    correct: number;
    skips: number;
    round: number;
    endedReason: "manual" | "time-up";
    endedAt: string;
  };
  startedAt?: string;
  updatedAt?: string;
};

export type FinalResult = {
  winnerTeamId: "red" | "blue" | "draw";
  winnerTeamName: string;
  loserTeamName?: string;
  scores: {
    red: number;
    blue: number;
  };
  finishedAt: string;
};

export type Room = {
  _id: string;
  code: string;
  name: string;
  host: string;
  maxPlayers: number;
  status: RoomStatus;
  players: RoomPlayer[];
  teams: RoomTeam[];
  teamsLocked: boolean;
  selectedGameId?: string;
  selectedCategory?: string;
  gameplay?: GameplayState;
  finalResult?: FinalResult;
  createdAt: string;
  updatedAt: string;
};
