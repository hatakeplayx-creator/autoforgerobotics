import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/services/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (phone: string, otp: string, name?: string) => Promise<boolean>;
  register: (payload: { name: string; email: string; password: string; phone?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  updateProfile: (payload: { name?: string; email?: string }) => Promise<void>;
}

const ACCESS_TOKEN_KEY = "autoforge_access_token";
const REFRESH_TOKEN_KEY = "autoforge_refresh_token";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

let refreshPromise: Promise<AuthResponse> | null = null;

async function apiFetchWithAuth<T>(
  path: string,
  init: RequestInit = {},
  accessToken: string | null,
  setAccessToken: (token: string) => void,
  setRefreshToken: (token: string) => void,
  setUser: (user: AuthUser | null) => void,
): Promise<T> {
  const headers = new Headers(init.headers || {});
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  try {
    return await apiFetch<T>(path, { ...init, headers });
  } catch (err) {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!storedRefreshToken) {
      setUser(null);
      throw err;
    }

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken(storedRefreshToken);
    }

    try {
      const newTokens = await refreshPromise;
      setAccessToken(newTokens.accessToken);
      setRefreshToken(newTokens.refreshToken);
      setUser(newTokens.user);
      localStorage.setItem(ACCESS_TOKEN_KEY, newTokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, newTokens.refreshToken);

      const newHeaders = new Headers(init.headers || {});
      newHeaders.set("Authorization", `Bearer ${newTokens.accessToken}`);

      return await apiFetch<T>(path, { ...init, headers: newHeaders });
    } catch (refreshErr) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setUser(null);
      throw refreshErr;
    } finally {
      refreshPromise = null;
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      
      // Verify token by fetching user profile
      (async () => {
        try {
          const userData = await apiFetchWithAuth<AuthUser>(
            "/api/me",
            {},
            storedAccessToken,
            setAccessToken,
            setRefreshToken,
            setUser,
          );
          setUser(userData);
        } catch (err) {
          console.error("Failed to restore session", err);
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const auth = await apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setUser(auth.user);
      setAccessToken(auth.accessToken);
      setRefreshToken(auth.refreshToken);
      localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
      toast.success(`Welcome back, ${auth.user.name}!`);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
      return false;
    }
  };

  const sendOtp = async (phone: string): Promise<boolean> => {
    try {
      await apiFetch("/api/auth/otp/send", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
      toast.success("OTP sent successfully!");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
      return false;
    }
  };

  const verifyOtp = async (phone: string, otp: string, name?: string): Promise<boolean> => {
    try {
      const auth = await apiFetch<AuthResponse>("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, otp, name }),
      });
      setUser(auth.user);
      setAccessToken(auth.accessToken);
      setRefreshToken(auth.refreshToken);
      localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
      toast.success(`Welcome${name ? `, ${name}` : ""}!`);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "OTP verification failed");
      return false;
    }
  };

  const register = async (payload: { name: string; email: string; password: string; phone?: string }): Promise<boolean> => {
    toast.error("Registration via email/password is disabled, use OTP login instead");
    return false;
  };

  const logout = async () => {
    if (refreshToken) {
      try {
        await apiFetch("/api/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      } catch {}
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    toast.info("You have been logged out.");
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      await apiFetch("/api/auth/password-reset", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.success("If the account exists, reset instructions were sent.");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Request failed");
      return false;
    }
  };

  const updateProfile = async (payload: { name?: string; email?: string }) => {
    if (!accessToken) {
      toast.error("Please login to update your profile");
      return;
    }
    try {
      const updatedUser = await apiFetchWithAuth<AuthUser>(
        "/api/me",
        { method: "PATCH", body: JSON.stringify(payload) },
        accessToken,
        setAccessToken,
        setRefreshToken,
        setUser,
      );
      setUser(updatedUser);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      sendOtp,
      verifyOtp,
      register,
      logout,
      requestPasswordReset,
      updateProfile,
    }),
    [user, loading, accessToken, refreshToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
