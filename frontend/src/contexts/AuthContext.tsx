import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchCurrentUser, loginGuest, loginUser, signupUser } from "../services/authService";
import type { AuthUser } from "../types/user";

const TOKEN_KEY = "chaos-ka-adda-token";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  signup: (payload: { username: string; email: string; password: string }) => Promise<void>;
  guestLogin: (payload: { username: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUserFromApi: (user: AuthUser) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(token));

  const persistSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetchCurrentUser(token);
      setUser(response.user);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout, token]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login: async (payload) => {
        const response = await loginUser(payload);
        persistSession(response.token, response.user);
      },
      signup: async (payload) => {
        const response = await signupUser(payload);
        persistSession(response.token, response.user);
      },
      guestLogin: async (payload) => {
        const response = await loginGuest(payload);
        persistSession(response.token, response.user);
      },
      logout,
      refreshUser,
      setUserFromApi: setUser,
    }),
    [isLoading, logout, persistSession, refreshUser, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
