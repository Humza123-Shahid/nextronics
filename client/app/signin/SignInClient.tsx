"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Sparkles,
  KeyRound,
  Shield,
  Home,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SignInClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "admin" ? "admin" : "user";

  const { login, user, isAuthenticated, isAdmin: currentIsAdmin, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"user" | "admin">(initialRole);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync tab with URL if changed
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "admin") {
      setActiveTab("admin");
    } else if (roleParam === "user") {
      setActiveTab("user");
    }
  }, [searchParams]);

  const handleTabChange = (tab: "user" | "admin") => {
    setActiveTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleFillDemo = (type: "user" | "admin") => {
    if (type === "admin") {
      setActiveTab("admin");
      setIdentifier("admin");
      setPassword("admin123");
    } else {
      setActiveTab("user");
      setIdentifier("abcuser");
      setPassword("12345");
    }
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!identifier.trim()) {
      setErrorMessage("Please enter your username or email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await login({
        username: identifier.trim(),
        password,
        role: activeTab,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Authentication failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Check whether user is admin or customer
      const isTargetAdmin = Boolean(res.isAdmin);

      if (isTargetAdmin) {
        setSuccessMessage("Admin authentication verified! Redirecting to Admin Dashboard...");
        setTimeout(() => {
          router.push("/admin");
        }, 1200);
      } else {
        setSuccessMessage(`Welcome back, ${res.user?.first_name || res.user?.username || "shopper"}! Redirecting to Home...`);
        setTimeout(() => {
          router.push("/");
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during sign in.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-[#090d16] text-slate-100 overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Breadcrumb/Back link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between text-xs text-slate-400">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-cyan-400 transition-colors py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800"
        >
          <Home className="w-3.5 h-3.5 text-cyan-400" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 hover:text-cyan-400 transition-colors py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
          <span>Browse Store</span>
        </Link>
      </div>

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-2xl border border-slate-800/90 bg-[#0d1322]/90 backdrop-blur-2xl shadow-2xl shadow-blue-950/40 p-6 sm:p-8">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-3">
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/25 shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 animate-spin-slow opacity-60" />
                <div className="relative w-full h-full rounded-[10px] bg-[#0c101d] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  NEXTRONICS
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-600 text-white">
                    TECH
                  </span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                  Electronics Store
                </span>
              </div>
            </Link>

            <h1 className="text-2xl font-black tracking-tight text-white mt-1">
              {activeTab === "admin" ? "Admin Portal Sign In" : "Welcome Back"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === "admin"
                ? "Authorized personnel portal for Nextronics store administration"
                : "Sign in to access your orders, saved cart, and tech deals"}
            </p>
          </div>

          {/* User / Admin Portal Switcher */}
          <div className="mb-6">
            <div className="grid grid-cols-2 p-1 bg-slate-900/90 border border-slate-800 rounded-xl relative">
              <button
                type="button"
                onClick={() => handleTabChange("user")}
                className={`relative z-10 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "user"
                    ? "text-white shadow-md shadow-blue-900/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("admin")}
                className={`relative z-10 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "admin"
                    ? "text-white shadow-md shadow-indigo-900/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Admin Portal</span>
              </button>

              {/* Animated Tab Background Indicator */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                className={`absolute inset-y-1 rounded-lg ${
                  activeTab === "user"
                    ? "left-1 right-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400/30"
                    : "left-1/2 right-1 bg-gradient-to-r from-indigo-600 to-blue-700 border border-indigo-400/30"
                }`}
              />
            </div>
          </div>

          {/* Quick Demo Pill Helper */}
          <div className="mb-5 flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Demo Quick-Fill:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleFillDemo("user")}
                className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                  activeTab === "user"
                    ? "bg-blue-600/30 text-cyan-300 border border-blue-500/40"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                User (abcuser)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("admin")}
                className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                  activeTab === "admin"
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                Admin (admin)
              </button>
            </div>
          </div>

          {/* Alert: Error message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{errorMessage}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Alert: Success message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                  <div className="flex-1 font-medium">{successMessage}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email field */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                {activeTab === "admin" ? "Admin Username or Email" : "Username or Email Address"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  {activeTab === "admin" ? (
                    <KeyRound className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Mail className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <input
                  id="identifier"
                  type="text"
                  required
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    activeTab === "admin" ? "admin or admin@nextronics.com" : "e.g. abcuser or name@example.com"
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-300"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert("For demo accounts: Admin password is 'admin123' and Customer password is '12345'.")
                  }
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span>Remember me on this device</span>
              </label>
              {activeTab === "admin" && (
                <span className="inline-flex items-center gap-1 text-[11px] text-indigo-400 font-medium">
                  <Shield className="w-3 h-3" />
                  Staff Gateway
                </span>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || Boolean(successMessage)}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                activeTab === "admin"
                  ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-600 shadow-indigo-600/30 hover:shadow-indigo-500/40"
                  : "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-blue-600/30 hover:shadow-cyan-500/30"
              } ${isLoading || successMessage ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : successMessage ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Authorized! Redirecting...</span>
                </div>
              ) : (
                <>
                  <span>
                    {activeTab === "admin" ? "Authorize & Enter Dashboard" : "Sign In to Account"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Bottom Card Navigation / Notice */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs">
            {activeTab === "user" ? (
              <p className="text-slate-400">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/40 hover:decoration-cyan-400 transition-colors"
                >
                  Create an account (Sign Up)
                </Link>
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-slate-400">
                  Admin accounts are provisioned by system executives.
                </p>
                <button
                  type="button"
                  onClick={() => handleTabChange("user")}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Return to Customer Sign In
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Next-Gen Security</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
