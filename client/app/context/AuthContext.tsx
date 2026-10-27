"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { setAuthCookie, deleteAuthCookie, getAuthCookie } from "@/app/actions/auth";
import { api } from "@/admin/services/api";
import { Notification } from "@/admin/types";
import { useRouter } from "next/navigation";
// import { useAdmin } from "@/admin/context/AdminContext";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string | null;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_seller?: boolean;
  is_verified?: boolean;
}

interface LoginPayload {
  username: string;
  password: string;
  role?: "user" | "admin";
}

interface SignupPayload {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
  isAdmin?: boolean;
  error?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  signup: (payload: SignupPayload) => Promise<AuthResponse>;
  logout: () => void;
}


// const getCookie = (name: string) =>
//   document.cookie.split("; ").find((c) => c.startsWith(name + "="))?.split("=")[1];

// // Decode JWT exp (ms). Only works if the token is readable (not HttpOnly).
// function getExpiry(): number | null {
//   const token = getCookie("access_token");
//   if (!token) return null;
//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload.exp * 1000;
//   } catch {
//     return null;
//   }
// }

// Decode JWT exp (ms). Only works if the token is readable (not HttpOnly).
async function getExpiry(): Promise<number | null> {
  const token = await getAuthCookie();
  console.log(token);
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(String(token).split(".")[1]));
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "nextronics_auth_user";
const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "http://127.0.0.1:8080/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const {
  //   notifications,
  //   setNotifications
  // } = useAdmin();
  // Load persisted user on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to recover auth state from localStorage:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAdmin = Boolean(user && (user.is_staff || user.is_superuser));

  const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errMsg =
          data.detail ||
          data.error ||
          data.message ||
          (typeof data === "string" ? data : "Failed to sign in. Please verify your credentials.");
        return { success: false, error: errMsg };
      }

      if (data.success && data.user) {
        //setUser(data.user);
        const tokens = data.tokens;
        console.log(data.user);
        console.log(tokens);
        // 3. Replace cookieStore.set with your Server Action
        await setAuthCookie(tokens.access);
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
          if (tokens?.access) {
            localStorage.setItem("nextronics_access_token", tokens.access);
          }
        } catch (storageErr) {
          console.warn("Could not save to localStorage:", storageErr);
        }
        setUser(data.user); // last, so the effect sees a valid cookie
        return {
          success: true,
          user: data.user,
          isAdmin: Boolean(data.isAdmin || data.user.is_staff || data.user.is_superuser),
          message: data.message || "Login successful",
        };
      }

      return { success: false, error: "Unexpected response from server." };
    } catch (err: any) {
      console.error("Login fetch error:", err);
      return {
        success: false,
        error:
          "Unable to connect to the authentication server. Please ensure the backend is running on port 8080.",
      };
    }
  };

  const signup = async (payload: SignupPayload): Promise<AuthResponse> => {
    try {
      const res = await fetch(`${API_BASE}/auth/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errMsg =
          data.detail ||
          data.error ||
          data.message ||
          (typeof data === "string" ? data : "Failed to create account. Please try again.");
        return { success: false, error: errMsg };
      }

      if (data.success && data.user) {
        //setUser(data.user);
        const tokens = data.tokens;

        // 3. Replace cookieStore.set with your Server Action
        await setAuthCookie(tokens.access);

        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
          if (tokens?.access) {
            localStorage.setItem("nextronics_access_token", tokens.access);
          }
        } catch (storageErr) {
          console.warn("Could not save to localStorage:", storageErr);
        }
        //const matchedUser = users.find((u) => String(u.id) === String(userId));
        const response = await api.post<Notification>(`/notifications/`, { notification_type: "system", title: "New Customer Registration", message: `${payload.first_name} ${payload.last_name} (${payload.email}) just created an account.` }, tokens.access);

        // const response = await api.post<Notification>(`/notifications/`, { notification_type: "system", title: "New Customer Registration", message: `${payload.first_name} ${payload.last_name} (${payload.email}) just created an account.` }, tokens.access || undefined);
        // //setNotifications((prev) => [response, ...prev]);
        // setNotifications([response, ...notifications]);
        setUser(data.user); // last, so the effect sees a valid cookie
        return {
          success: true,
          user: data.user,
          isAdmin: false,
          message: data.message || "Account created successfully",
        };
      }

      return { success: false, error: "Unexpected response from server during registration." };
    } catch (err: any) {
      console.error("Signup fetch error:", err);
      return {
        success: false,
        error:
          "Unable to reach the registration server. Please verify backend connectivity on port 8080.",
      };
    }
  };

  // const logout = () => {
  //   setUser(null);
  //   try {
  //     localStorage.removeItem(AUTH_STORAGE_KEY);
  //     localStorage.removeItem("nextronics_access_token");
  //     deleteAuthCookie();
  //   } catch (err) {
  //     console.error("Error removing auth from storage:", err);
  //   }
  // };
  const logout = useCallback(
    (reason?: string) => {
      //localStorage.removeItem("user");
      localStorage.setItem("logout-event", Date.now().toString()); // notify other tabs
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem("nextronics_access_token");
      deleteAuthCookie();
      // router.replace(`/login${reason ? `?reason=${reason}` : ""}`);
      router.replace(`/signin${reason ? `?reason=${reason}` : ""}`);

    },
    [router]
  );




  // expiry effect: async-aware
  useEffect(() => {
    if (!user) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    // (b) Detect manual cookie deletion: poll every 5s
    const check = async () => {
      const exp = await getExpiry();
      if (cancelled) return;
      if (!exp || exp <= Date.now()) logout("expired");
    };
    // (a) Timer that fires exactly at expiry
    (async () => {
      const exp = await getExpiry();
      if (cancelled) return;
      if (!exp) return logout("expired");
      const delay = Math.min(Math.max(exp - Date.now(), 0), 2_147_000_000);
      timer = setTimeout(() => logout("expired"), delay);
    })();

    const poll = setInterval(check, 5000);
    // (c) Re-check when the user returns to the tab (timers are throttled in background tabs)
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    // (d) Logout in other tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === "logout-event") {
        setUser(null);
        router.replace("/signin");
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("storage", onStorage);
    };
  }, [user, logout, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
