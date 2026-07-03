import {
  Gamepad2,
  LogIn,
  PlusCircle,
  Settings,
  ShoppingBag,
  Swords,
  Trophy,
  UserRound,
} from "lucide-react";

export const homeActions = [
  { label: "Play Now", href: "/local-teams", icon: Gamepad2, tone: "cyan" as const },
  { label: "Host a Party", href: "/rooms/create", icon: PlusCircle, tone: "pink" as const },
  { label: "Join the Chaos", href: "/rooms/join", icon: LogIn, tone: "orange" as const },
  { label: "Profile", href: "/profile", icon: UserRound, tone: "green" as const },
  { label: "Achievements", href: "/achievements", icon: Trophy, tone: "purple" as const },
  { label: "Battle Stats", href: "/statistics", icon: Swords, tone: "cyan" as const },
  { label: "Chaos Shop", href: "/store", icon: ShoppingBag, tone: "pink" as const },
  { label: "Settings", href: "/settings", icon: Settings, tone: "orange" as const },
];
