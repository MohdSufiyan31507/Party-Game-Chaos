import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LogOut,
  Gamepad2,
  Home,
  Palette,
  Settings,
  ShoppingBag,
  Trophy,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { themes, useTheme, type ThemeId } from "../../contexts/ThemeContext";
import { narratorFor } from "../../utils/narrator";
import { ChaosWheelLogo } from "../ui/ChaosWheelLogo";

const navItems = [
  { label: "Adda", href: "/home", icon: Home },
  { label: "Games", href: "/games", icon: Gamepad2 },
  { label: "Winners", href: "/leaderboard", icon: Trophy },
  { label: "Shop", href: "/store", icon: ShoppingBag },
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Settings", href: "/settings", icon: Settings },
];

function ThemePicker({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const activeTheme = themes.find((item) => item.id === theme) ?? themes[0];

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
        <Palette size={15} className="shrink-0 text-surge" aria-hidden="true" />
        <span className="flex h-5 w-12 shrink-0 overflow-hidden rounded-md border border-white/10">
          {activeTheme.swatches.map((swatch) => (
            <span key={swatch} className="flex-1" style={{ backgroundColor: swatch }} />
          ))}
        </span>
        <select
          value={theme}
          aria-label="Theme"
          onChange={(event) => setTheme(event.target.value as ThemeId)}
          className="min-h-8 flex-1 rounded-md border border-white/10 bg-ink/85 px-2 text-xs font-black text-white outline-none transition focus:border-surge/70 focus:ring-4 focus:ring-surge/10"
        >
          {themes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-3">
      <label className="block">
        <span className="mb-2 flex items-center justify-between gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/48">
          <span className="flex items-center gap-2">
            <Palette size={14} aria-hidden="true" />
            Theme
          </span>
          <span className="flex h-5 w-14 overflow-hidden rounded-md border border-white/10">
            {activeTheme.swatches.map((swatch) => (
              <span key={swatch} className="flex-1" style={{ backgroundColor: swatch }} />
            ))}
          </span>
        </span>
        <select
          value={theme}
          onChange={(event) => setTheme(event.target.value as ThemeId)}
          className="min-h-10 w-full rounded-lg border border-white/10 bg-ink/85 px-3 text-sm font-black text-white outline-none transition hover:border-surge/45 focus:border-surge/70 focus:ring-4 focus:ring-surge/10"
        >
          {themes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <p className="mt-2 text-xs font-semibold leading-5 text-white/54">
        {activeTheme.description}
      </p>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-ink pb-24 text-white lg:pb-0">
      <div className="theme-backdrop fixed inset-0 -z-10 transition duration-500" />
      <div className="page-grid fixed inset-0 -z-10 bg-grid opacity-45" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/75 shadow-[0_12px_34px_rgb(0_0_0/0.18)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <NavLink to="/home" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg border border-surge/40 bg-surge/15 text-surge shadow-glow transition hover:rotate-6 hover:scale-105">
              <ChaosWheelLogo size={27} />
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
                      ? "show-chip bg-surge/15 text-surge shadow-glow"
                      : "text-white/62 hover:bg-white/8 hover:text-white hover:-translate-y-0.5"
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
          <div className="chaos-surface show-panel sticky top-24 rounded-lg p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-punch">
                Party Host: {user?.username ?? "Player"}
              </p>
              <span className="show-chip rounded-md border border-lime/25 bg-lime/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-lime">
                On Air
              </span>
            </div>
            <p className="mt-3 text-xl font-black leading-tight">
              {narratorFor(location.pathname)}
            </p>
            <p className="mt-4 text-sm leading-6 text-white/62">
              Live rooms, team setup, realtime gameplay, and scores are running
              through the full-stack party engine.
            </p>
            <ThemePicker />
          </div>
        </aside>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-lg border border-white/10 bg-ink/90 p-2 shadow-glow backdrop-blur-xl lg:hidden">
        <ThemePicker compact />
        <div className="mt-2 grid grid-cols-5 gap-1">
          {navItems.slice(0, 5).map(({ label, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-black transition ${
                  isActive ? "show-chip bg-surge/15 text-surge" : "text-white/58 hover:bg-white/8"
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
