import { createContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ACCESS_TOKEN_KEY, apiFetch } from "@/services/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
}

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (phone: string, otp: string, name?: string) => Promise<boolean>;
  register: (payload: { name: string; email: string; password: string; phone?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  updateProfile: (payload: { name?: string; email?: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function refreshAccessToken(): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      
      // Verify token by fetching user profile
      (async () => {
        try {
          const userData = await apiFetch<AuthUser>(
            "/api/me",
            { headers: { Authorization: `Bearer ${storedAccessToken}` } },
          );
          setUser(userData);
        } catch {
          // An expired or revoked persisted session is an expected signed-out state.
          localStorage.removeItem(ACCESS_TOKEN_KEY);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      (async () => {
        try {
          const auth = await refreshAccessToken();
          setUser(auth.user);
          setAccessToken(auth.accessToken);
          localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
        } catch {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  useEffect(() => {
    const onToken = (event: Event) => {
      const detail = (event as CustomEvent<{ accessToken?: string }>).detail;
      if (detail?.accessToken) setAccessToken(detail.accessToken);
    };
    window.addEventListener("autoforge:auth-token", onToken);
    return () => window.removeEventListener("autoforge:auth-token", onToken);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const auth = await apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setUser(auth.user);
      setAccessToken(auth.accessToken);
      localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
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
      localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
      toast.success(`Welcome${name ? `, ${name}` : ""}!`);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "OTP verification failed");
      return false;
    }
  };

  const register = async (payload: { name: string; email: string; password: string; phone?: string }): Promise<boolean> => {
    try {
      const auth = await apiFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          ...(payload.phone?.trim() ? { phone: payload.phone } : {}),
          rememberMe: true,
        }),
      });
      setUser(auth.user);
      setAccessToken(auth.accessToken);
      localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
      toast.success(`Welcome, ${auth.user.name}!`);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({}),
      });
    } catch {
      // Logout is best-effort because a stale session may already be revoked.
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setUser(null);
    setAccessToken(null);
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
      const updatedUser = await apiFetch<AuthUser>(
        "/api/me",
        { method: "PATCH", body: JSON.stringify(payload), headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setUser(updatedUser);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const value:AuthContextType={user,isAuthenticated:!!user,loading,accessToken,login,sendOtp,verifyOtp,register,logout,requestPasswordReset,updateProfile};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
