import { apiRequest } from "./api";
import type { AuthUser } from "../types/user";

export type LeaderboardPlayer = Pick<
  AuthUser,
  "username" | "avatar" | "level" | "coins" | "gamesPlayed" | "wins" | "losses" | "totalScore" | "achievements"
> & { _id: string };

export type StoreItem = {
  id: string;
  name: string;
  cost: number;
};

export type RecentRoom = {
  _id: string;
  code: string;
  name: string;
  selectedGameId?: string;
  selectedCategory?: string;
  finalResult?: {
    winnerTeamName: string;
    scores: { red: number; blue: number };
    finishedAt: string;
  };
  updatedAt: string;
};

export function fetchLeaderboard(token: string) {
  return apiRequest<{ players: LeaderboardPlayer[] }>("/users/leaderboard", { token });
}

export function fetchStats(token: string) {
  return apiRequest<{
    stats: {
      gamesPlayed: number;
      wins: number;
      losses: number;
      totalScore: number;
      xp: number;
      level: number;
      coins: number;
      winRate: number;
    };
  }>("/users/stats", { token });
}

export function fetchRecentRooms(token: string) {
  return apiRequest<{ rooms: RecentRoom[] }>("/users/rooms/recent", { token });
}

export function fetchStore(token: string) {
  return apiRequest<{ items: StoreItem[] }>("/users/store", { token });
}

export function purchaseStoreItem(token: string, itemId: string) {
  return apiRequest<{ user: AuthUser; item: StoreItem; alreadyOwned: boolean }>(
    "/users/store/purchase",
    {
      method: "POST",
      token,
      body: JSON.stringify({ itemId }),
    },
  );
}
