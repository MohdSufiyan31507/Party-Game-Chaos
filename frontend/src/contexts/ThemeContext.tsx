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
  | "royal";

const THEME_KEY = "chaos-ka-adda-theme";

export const themes: Array<{
  id: ThemeId;
  name: string;
  description: string;
  swatches: string[];
}> = [
  {
    id: "arcade",
    name: "Arcade Night",
    description: "Deeper blues with electric violet.",
    swatches: ["#7C5CFF", "#00E5FF", "#FF4FD8"],
  },
  {
    id: "mango",
    name: "Mango Pop",
    description: "Warm party energy with punchy contrast.",
    swatches: ["#FFB000", "#FF4D6D", "#3BE8B0"],
  },
  {
    id: "mint",
    name: "Cyber Mint",
    description: "Cool greens, clean blues, and crisp glow.",
    swatches: ["#52FFB8", "#36A3FF", "#E8FF5A"],
  },
  {
    id: "lava",
    name: "Lava Mode",
    description: "Hot reds, amber sparks, and danger glow.",
    swatches: ["#FF3B30", "#FF9500", "#FFE66D"],
  },
  {
    id: "ocean",
    name: "Ocean Pulse",
    description: "Deep sea blues with aqua and seafoam.",
    swatches: ["#00C2FF", "#00F5D4", "#90F1EF"],
  },
  {
    id: "royal",
    name: "Royal Chaos",
    description: "Regal purple, gold, and jewel green.",
    swatches: ["#C084FC", "#FACC15", "#34D399"],
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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return isThemeId(savedTheme) ? savedTheme : "arcade";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
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
