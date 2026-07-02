const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:4000/api";

type RequestOptions = RequestInit & {
  token?: string | null;
};

export async function apiRequest<T>(
  path: string,
  { token, headers, ...options }: RequestOptions = {},
) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data.message === "string" ? data.message : "Request failed";
    throw new Error(message);
  }

  return data as T;
}
