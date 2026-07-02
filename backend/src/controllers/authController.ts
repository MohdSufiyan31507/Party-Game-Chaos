import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { UserModel, type UserDocument } from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { signAuthToken } from "../utils/jwt.js";

const PASSWORD_SALT_ROUNDS = 12;

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function serializeAuth(user: UserDocument) {
  return {
    token: signAuthToken({ userId: user.id }),
    user: user.toJSON(),
  };
}

export async function signup(req: Request, res: Response) {
  const username = readString(req.body.username);
  const email = readString(req.body.email).toLowerCase();
  const password = readString(req.body.password);

  if (!username || !email || !password) {
    throw new HttpError(400, "Username, email, and password are required");
  }

  if (password.length < 8) {
    throw new HttpError(400, "Password must be at least 8 characters");
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  const user = await UserModel.create({ username, email, passwordHash });

  res.status(201).json(serializeAuth(user));
}

export async function login(req: Request, res: Response) {
  const email = readString(req.body.email).toLowerCase();
  const password = readString(req.body.password);

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required");
  }

  const user = await UserModel.findOne({ email }).select("+passwordHash");

  if (!user?.passwordHash) {
    throw new HttpError(401, "Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    throw new HttpError(401, "Invalid email or password");
  }

  res.json(serializeAuth(user));
}

export async function guestLogin(req: Request, res: Response) {
  const requestedName = readString(req.body.username);
  const username = requestedName || `Guest-${Math.random().toString(36).slice(2, 7)}`;
  const user = await UserModel.create({
    username,
    isGuest: true,
    avatar: "chaos-guest",
  });

  res.status(201).json(serializeAuth(user));
}

export async function me(req: Request, res: Response) {
  res.json({ user: req.user?.toJSON() });
}
