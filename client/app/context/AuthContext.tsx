"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "nextronics_auth_user";
const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "http://127.0.0.1:8080/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setUser(data.user);
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
        } catch (storageErr) {
          console.warn("Could not save to localStorage:", storageErr);
        }
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
        setUser(data.user);
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
        } catch (storageErr) {
          console.warn("Could not save to localStorage:", storageErr);
        }
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

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.error("Error removing auth from storage:", err);
    }
  };

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
