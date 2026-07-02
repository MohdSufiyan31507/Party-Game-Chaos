import { apiRequest } from "./api";
import type { AuthResponse, AuthUser } from "../types/user";

export function signupUser(payload: {
  username: string;
  email: string;
  password: string;
}) {
  return apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginGuest(payload: { username: string }) {
  return apiRequest<AuthResponse>("/auth/guest", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchCurrentUser(token: string) {
  return apiRequest<{ user: AuthUser }>("/auth/me", { token });
}
