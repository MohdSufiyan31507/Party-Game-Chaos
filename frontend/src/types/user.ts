export type AuthUser = {
  _id: string;
  username: string;
  email?: string;
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
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
