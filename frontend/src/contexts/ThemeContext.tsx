import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeId = "neon" | "arcade" | "mango" | "mint";

const THEME_KEY = "chaos-ka-adda-theme";

export const themes: Array<{
  id: ThemeId;
  name: string;
  description: string;
  swatches: string[];
}> = [
  {
    id: "neon",
    name: "Neon Chaos",
    description: "Classic pink, cyan, and arcade glow.",
    swatches: ["#20D9FF", "#FF3F8F", "#FF9D2E"],
  },
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
    return isThemeId(savedTheme) ? savedTheme : "neon";
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
