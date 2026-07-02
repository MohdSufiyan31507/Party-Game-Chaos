import { Schema, model, type HydratedDocument, type Types } from "mongoose";

export type RoomStatus = "lobby" | "team-setup" | "game-selection" | "closed";

export type RoomPlayer = {
  user: Types.ObjectId;
  username: string;
  avatar: string;
  role: "host" | "player";
  joinedAt: Date;
};

export type RoomTeam = {
  id: "red" | "blue";
  name: string;
  accent: "red" | "blue";
  playerIds: string[];
};

export type GameplayState = {
  isActive: boolean;
  phase: "playing" | "round-result";
  currentPromptIndex: number;
  activeTeamId: "red" | "blue";
  round: number;
  roundDurationSeconds: number;
  roundEndsAt?: Date;
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
    endedAt: Date;
  };
  startedAt?: Date;
  updatedAt?: Date;
};

export type FinalResult = {
  winnerTeamId: "red" | "blue" | "draw";
  winnerTeamName: string;
  loserTeamName?: string;
  scores: {
    red: number;
    blue: number;
  };
  finishedAt: Date;
};

export type Room = {
  code: string;
  name: string;
  host: Types.ObjectId;
  maxPlayers: number;
  status: RoomStatus;
  players: RoomPlayer[];
  teams: RoomTeam[];
  teamsLocked: boolean;
  selectedGameId?: string;
  selectedCategory?: string;
  gameplay?: GameplayState;
  finalResult?: FinalResult;
  createdAt: Date;
  updatedAt: Date;
};

const roomPlayerSchema = new Schema<RoomPlayer>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true, trim: true },
    avatar: { type: String, required: true, default: "chaos-default" },
    role: { type: String, enum: ["host", "player"], required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const roomTeamSchema = new Schema<RoomTeam>(
  {
    id: { type: String, enum: ["red", "blue"], required: true },
    name: { type: String, required: true },
    accent: { type: String, enum: ["red", "blue"], required: true },
    playerIds: { type: [String], default: [] },
  },
  { _id: false },
);

const gameplaySchema = new Schema<GameplayState>(
  {
    isActive: { type: Boolean, default: false },
    phase: { type: String, enum: ["playing", "round-result"], default: "playing" },
    currentPromptIndex: { type: Number, default: 0, min: 0 },
    activeTeamId: { type: String, enum: ["red", "blue"], default: "red" },
    round: { type: Number, default: 1, min: 1 },
    roundDurationSeconds: { type: Number, default: 60, min: 10, max: 180 },
    roundEndsAt: Date,
    scores: {
      red: { type: Number, default: 0 },
      blue: { type: Number, default: 0 },
    },
    correct: {
      red: { type: Number, default: 0 },
      blue: { type: Number, default: 0 },
    },
    skips: {
      red: { type: Number, default: 0 },
      blue: { type: Number, default: 0 },
    },
    lastRoundResult: {
      teamId: { type: String, enum: ["red", "blue"] },
      score: Number,
      correct: Number,
      skips: Number,
      round: Number,
      endedReason: { type: String, enum: ["manual", "time-up"] },
      endedAt: Date,
    },
    startedAt: Date,
    updatedAt: Date,
  },
  { _id: false },
);

const finalResultSchema = new Schema<FinalResult>(
  {
    winnerTeamId: { type: String, enum: ["red", "blue", "draw"], required: true },
    winnerTeamName: { type: String, required: true },
    loserTeamName: String,
    scores: {
      red: { type: Number, required: true },
      blue: { type: Number, required: true },
    },
    finishedAt: { type: Date, required: true },
  },
  { _id: false },
);

const roomSchema = new Schema<Room>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 5,
      maxlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 48,
    },
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    maxPlayers: { type: Number, required: true, min: 2, max: 16, default: 8 },
    status: {
      type: String,
      enum: ["lobby", "team-setup", "game-selection", "closed"],
      default: "lobby",
    },
    players: {
      type: [roomPlayerSchema],
      default: [],
      validate: {
        validator(players: RoomPlayer[]) {
          return players.length <= this.maxPlayers;
        },
        message: "Room is full",
      },
    },
    teams: {
      type: [roomTeamSchema],
      default: [
        { id: "red", name: "Red Team", accent: "red", playerIds: [] },
        { id: "blue", name: "Blue Team", accent: "blue", playerIds: [] },
      ],
    },
    teamsLocked: { type: Boolean, default: false },
    selectedGameId: { type: String, trim: true },
    selectedCategory: { type: String, trim: true },
    gameplay: { type: gameplaySchema },
    finalResult: { type: finalResultSchema },
  },
  { timestamps: true },
);

export type RoomDocument = HydratedDocument<Room>;

export const RoomModel = model<Room>("Room", roomSchema);
