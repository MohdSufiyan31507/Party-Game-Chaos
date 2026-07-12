import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeId =
  | "arcade"
  | "mango"
  | "mint"
  | "lava"
  | "ocean"
  | "royal"
  | "daylight"
  | "sunset"
  | "blossom"
  | "beige"
  | "sky"
  | "sage"
  | "lilac";

const THEME_KEY = "chaos-ka-adda-theme";
const DEFAULT_THEME: ThemeId = "arcade";

export const themes: Array<{
  id: ThemeId;
  name: string;
  description: string;
  tone: "dark" | "light";
  swatches: string[];
}> = [
  {
    id: "arcade",
    name: "Arcade Night",
    description: "Deeper blues with electric violet.",
    tone: "dark",
    swatches: ["#7C5CFF", "#00E5FF", "#FF4FD8"],
  },
  {
    id: "mango",
    name: "Mango Pop",
    description: "Warm party energy with punchy contrast.",
    tone: "dark",
    swatches: ["#FFB000", "#FF4D6D", "#3BE8B0"],
  },
  {
    id: "mint",
    name: "Cyber Mint",
    description: "Cool greens, clean blues, and crisp glow.",
    tone: "dark",
    swatches: ["#52FFB8", "#36A3FF", "#E8FF5A"],
  },
  {
    id: "lava",
    name: "Lava Mode",
    description: "Hot reds, amber sparks, and danger glow.",
    tone: "dark",
    swatches: ["#FF3B30", "#FF9500", "#FFE66D"],
  },
  {
    id: "ocean",
    name: "Ocean Pulse",
    description: "Deep sea blues with aqua and seafoam.",
    tone: "dark",
    swatches: ["#00C2FF", "#00F5D4", "#90F1EF"],
  },
  {
    id: "royal",
    name: "Royal Chaos",
    description: "Regal purple, gold, and jewel green.",
    tone: "dark",
    swatches: ["#C084FC", "#FACC15", "#34D399"],
  },
  {
    id: "daylight",
    name: "Daylight Pop",
    description: "Bright sky, clean paper, and fresh lime.",
    tone: "light",
    swatches: ["#2563EB", "#F97316", "#84CC16"],
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    description: "Warm peach, coral, and pool-blue highlights.",
    tone: "light",
    swatches: ["#FB7185", "#F59E0B", "#06B6D4"],
  },
  {
    id: "blossom",
    name: "Blossom Day",
    description: "Soft pinks, violet ink, and garden green.",
    tone: "light",
    swatches: ["#D946EF", "#7C3AED", "#22C55E"],
  },
  {
    id: "beige",
    name: "Beige Studio",
    description: "Soft beige paper with teal and clay contrast.",
    tone: "light",
    swatches: ["#E7D8C9", "#0F766E", "#C2410C"],
  },
  {
    id: "sky",
    name: "Sky Blue",
    description: "Light blue air, navy text, and citrus accents.",
    tone: "light",
    swatches: ["#DDF4FF", "#1D4ED8", "#F59E0B"],
  },
  {
    id: "sage",
    name: "Sage Fresh",
    description: "Calm green-gray with berry and teal contrast.",
    tone: "light",
    swatches: ["#EAF4EC", "#0F766E", "#BE185D"],
  },
  {
    id: "lilac",
    name: "Lilac Mist",
    description: "Pale violet with indigo and coral accents.",
    tone: "light",
    swatches: ["#F3E8FF", "#4F46E5", "#F43F5E"],
  },
];

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeId(value: string | null): value is ThemeId {
  return themes.some((theme) => theme.id === value);
}

function themeTone(themeId: ThemeId) {
  return themes.find((theme) => theme.id === themeId)?.tone ?? "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return isThemeId(savedTheme) ? savedTheme : DEFAULT_THEME;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.tone = themeTone(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
