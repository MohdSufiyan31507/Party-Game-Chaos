import type { ComponentType } from "react";
import { LoginPage, SignupPage, GuestLoginPage } from "./pages/AuthPages";
import {
  CategorySelectionPage,
  CreateRoomPage,
  FinalWinnerPage,
  GameIntroPage,
  GameplayPage,
  GameSelectionPage,
  HomeDashboardPage,
  JoinRoomPage,
  LeaderboardPage,
  LobbyPage,
  RoundResultPage,
  TeamSetupPage,
} from "./pages/CorePages";
import {
  AboutPage,
  AchievementsPage,
  NotFoundPage,
  ProfilePage,
  SettingsPage,
  StatisticsPage,
  StorePage,
} from "./pages/InfoPages";
import { LandingPage } from "./pages/LandingPage";
import { SplashPage } from "./pages/SplashPage";

type RouteDef = {
  path: string;
  component: ComponentType;
  fullScreen?: boolean;
};

export const routes: RouteDef[] = [
  { path: "/", component: SplashPage, fullScreen: true },
  { path: "/landing", component: LandingPage, fullScreen: true },
  { path: "/login", component: LoginPage, fullScreen: true },
  { path: "/signup", component: SignupPage, fullScreen: true },
  { path: "/guest", component: GuestLoginPage, fullScreen: true },
  { path: "/home", component: HomeDashboardPage },
  { path: "/rooms/create", component: CreateRoomPage },
  { path: "/rooms/join", component: JoinRoomPage },
  { path: "/lobby", component: LobbyPage },
  { path: "/lobby/:code", component: LobbyPage },
  { path: "/teams", component: TeamSetupPage },
  { path: "/teams/:code", component: TeamSetupPage },
  { path: "/games", component: GameSelectionPage },
  { path: "/categories", component: CategorySelectionPage },
  { path: "/intro", component: GameIntroPage },
  { path: "/play", component: GameplayPage },
  { path: "/play/:code", component: GameplayPage },
  { path: "/round-result", component: RoundResultPage },
  { path: "/round-result/:code", component: RoundResultPage },
  { path: "/leaderboard", component: LeaderboardPage },
  { path: "/leaderboard/:code", component: LeaderboardPage },
  { path: "/winner", component: FinalWinnerPage },
  { path: "/winner/:code", component: FinalWinnerPage },
  { path: "/profile", component: ProfilePage },
  { path: "/achievements", component: AchievementsPage },
  { path: "/statistics", component: StatisticsPage },
  { path: "/store", component: StorePage },
  { path: "/settings", component: SettingsPage },
  { path: "/about", component: AboutPage },
  { path: "*", component: NotFoundPage, fullScreen: true },
];
