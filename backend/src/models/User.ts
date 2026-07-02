import { Schema, model, type HydratedDocument } from "mongoose";

export type User = {
  username: string;
  email?: string;
  passwordHash?: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  totalScore: number;
  achievements: string[];
  purchases: string[];
  isGuest: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    avatar: {
      type: String,
      default: "chaos-default",
    },
    level: { type: Number, default: 1, min: 1 },
    xp: { type: Number, default: 0, min: 0 },
    coins: { type: Number, default: 250, min: 0 },
    gamesPlayed: { type: Number, default: 0, min: 0 },
    wins: { type: Number, default: 0, min: 0 },
    losses: { type: Number, default: 0, min: 0 },
    totalScore: { type: Number, default: 0, min: 0 },
    achievements: { type: [String], default: [] },
    purchases: { type: [String], default: [] },
    isGuest: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const serialized = ret as { passwordHash?: unknown; __v?: unknown };
        delete serialized.passwordHash;
        delete serialized.__v;
        return ret;
      },
    },
  },
);

export type UserDocument = HydratedDocument<User>;

export const UserModel = model<User>("User", userSchema);
