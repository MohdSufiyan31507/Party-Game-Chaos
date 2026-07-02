import type { Request, Response } from "express";
import { RoomModel } from "../models/Room.js";
import { UserModel } from "../models/User.js";
import { HttpError } from "../utils/httpError.js";

const storeItems = [
  { id: "neon-avatar-pack", name: "Neon Avatar Pack", cost: 150 },
  { id: "victory-taunts", name: "Victory Taunts", cost: 100 },
  { id: "chaos-card-skins", name: "Chaos Card Skins", cost: 125 },
];

export async function getProfile(req: Request, res: Response) {
  res.json({ user: req.user?.toJSON() });
}

export async function updateProfile(req: Request, res: Response) {
  const user = req.user;

  if (!user) {
    throw new HttpError(401, "Authentication required");
  }

  const username = typeof req.body.username === "string" ? req.body.username.trim() : "";
  const avatar = typeof req.body.avatar === "string" ? req.body.avatar.trim() : "";

  if (username) user.username = username;
  if (avatar) user.avatar = avatar;

  await user.save();
  res.json({ user: user.toJSON() });
}

export async function getStats(req: Request, res: Response) {
  const user = req.user;

  if (!user) {
    throw new HttpError(401, "Authentication required");
  }

  res.json({
    stats: {
      gamesPlayed: user.gamesPlayed,
      wins: user.wins,
      losses: user.losses,
      totalScore: user.totalScore,
      xp: user.xp,
      level: user.level,
      coins: user.coins,
      winRate: user.gamesPlayed ? Math.round((user.wins / user.gamesPlayed) * 100) : 0,
    },
  });
}

export async function getLeaderboard(_req: Request, res: Response) {
  const players = await UserModel.find()
    .sort({ wins: -1, totalScore: -1, gamesPlayed: 1 })
    .limit(25)
    .select("username avatar level coins gamesPlayed wins losses totalScore achievements")
    .lean();

  res.json({ players });
}

export async function getRecentRooms(req: Request, res: Response) {
  const user = req.user;

  if (!user) {
    throw new HttpError(401, "Authentication required");
  }

  const rooms = await RoomModel.find({
    status: "closed",
    "players.user": user._id,
    finalResult: { $exists: true },
  })
    .sort({ updatedAt: -1 })
    .limit(10)
    .select("code name selectedGameId selectedCategory finalResult updatedAt")
    .lean();

  res.json({ rooms });
}

export async function getStore(_req: Request, res: Response) {
  res.json({ items: storeItems });
}

export async function purchaseStoreItem(req: Request, res: Response) {
  const user = req.user;
  const itemId = typeof req.body.itemId === "string" ? req.body.itemId : "";
  const item = storeItems.find((storeItem) => storeItem.id === itemId);

  if (!user) {
    throw new HttpError(401, "Authentication required");
  }

  if (!item) {
    throw new HttpError(404, "Store item not found");
  }

  if (user.purchases.includes(item.id)) {
    res.json({ user: user.toJSON(), item, alreadyOwned: true });
    return;
  }

  if (user.coins < item.cost) {
    throw new HttpError(400, "Not enough coins");
  }

  user.coins -= item.cost;
  user.purchases.push(item.id);
  if (!user.achievements.includes("First Purchase")) {
    user.achievements.push("First Purchase");
  }

  await user.save();
  res.json({ user: user.toJSON(), item, alreadyOwned: false });
}
