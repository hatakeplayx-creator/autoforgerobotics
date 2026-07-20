const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const ACCESS_TOKEN_KEY = "autoforge_access_token";

export function apiUrl(path: string): string {
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  return /^(https?:)?\/\//i.test(url) || url.startsWith("data:") ? url : apiUrl(url);
}

export function authHeaders(token = typeof window === "undefined" ? null : localStorage.getItem(ACCESS_TOKEN_KEY)): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export class ApiError extends Error {
  readonly status: number;
  readonly fields: Record<string, string[]>;

  constructor(message: string, status: number, fields: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

interface AuthResponse {
  accessToken: string;
}

let refreshPromise: Promise<AuthResponse> | null = null;

function persistAuthTokens(auth: AuthResponse): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
  window.dispatchEvent(new CustomEvent("autoforge:auth-token", { detail: { accessToken: auth.accessToken } }));
}

async function refreshSession(): Promise<AuthResponse> {
  if (!baseUrl) throw new Error("API is not configured");
  const response = await fetch(`${baseUrl}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!response.ok) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    throw new ApiError("Session expired", response.status);
  }
  const auth = await response.json() as AuthResponse;
  persistAuthTokens(auth);
  return auth;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const initialHeaders = new Headers(init.headers);
  const usesCredentials = path.startsWith("/api/auth/") || initialHeaders.has("Authorization");
  const makeRequest = async (headers: HeadersInit | undefined) => {
    const requestHeaders = new Headers(headers);
    if (init.body !== undefined && !(init.body instanceof FormData) && !requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }
    return fetch(apiUrl(path), {
      ...init,
      credentials: usesCredentials ? "include" : "same-origin",
      headers: requestHeaders,
    });
  };
  let response = await makeRequest(init.headers);
  const headers = new Headers(init.headers);
  if (response.status === 401 && headers.has("Authorization") && path !== "/api/auth/refresh") {
    refreshPromise ??= refreshSession();
    try {
      const auth = await refreshPromise;
      headers.set("Authorization", `Bearer ${auth.accessToken}`);
      response = await makeRequest(headers);
    } finally {
      refreshPromise = null;
    }
  }
  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => ({ message: "Request failed" }));
    const body = payload && typeof payload === "object" ? payload as { message?: unknown; errors?: { fieldErrors?: unknown } } : {};
    const fieldErrors = body.errors?.fieldErrors;
    throw new ApiError(
      typeof body.message === "string" ? body.message : "Request failed",
      response.status,
      fieldErrors && typeof fieldErrors === "object" ? fieldErrors as Record<string, string[]> : {},
    );
  }
  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>;
}
