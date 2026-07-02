import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  LogOut,
  Gamepad2,
  Home,
  Settings,
  ShoppingBag,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { narratorFor } from "../../utils/narrator";

const navItems = [
  { label: "Adda", href: "/home", icon: Home },
  { label: "Games", href: "/games", icon: Gamepad2 },
  { label: "Winners", href: "/leaderboard", icon: Trophy },
  { label: "Shop", href: "/store", icon: ShoppingBag },
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-ink pb-24 text-white lg:pb-0">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(182,55,255,0.28),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(32,217,255,0.18),transparent_28%),linear-gradient(135deg,#070817,#111433_55%,#1E102F)]" />
      <div className="page-grid fixed inset-0 -z-10 bg-grid opacity-45" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <NavLink to="/home" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg border border-surge/40 bg-surge/15 text-surge shadow-glow">
              <Sparkles size={22} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xs font-black uppercase tracking-[0.28em] text-white/45">
                The Chaos Games
              </span>
              <span className="block text-lg font-black">Chaos Ka Adda</span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map(({ label, href, icon: Icon }) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                    isActive
                      ? "bg-white/12 text-surge"
                      : "text-white/62 hover:bg-white/8 hover:text-white"
                  }`
                }
              >
                <Icon size={17} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="hidden min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-black uppercase tracking-[0.14em] text-white/70 transition hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            <LogOut size={15} aria-hidden="true" />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_280px]">
        <div>{children}</div>
        <aside className="hidden lg:block">
          <div className="chaos-surface sticky top-24 rounded-lg p-5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-punch">
              Party Host: {user?.username ?? "Player"}
            </p>
            <p className="mt-3 text-xl font-black leading-tight">
              {narratorFor(location.pathname)}
            </p>
            <p className="mt-4 text-sm leading-6 text-white/62">
              Milestone 2 auth shell. Backend login is live, while rooms,
              realtime, and game sessions stay local until the next milestone.
            </p>
          </div>
        </aside>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-lg border border-white/10 bg-ink/90 p-2 shadow-glow backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.slice(0, 5).map(({ label, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-black transition ${
                  isActive ? "bg-white/12 text-surge" : "text-white/58"
                }`
              }
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
