"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ShieldCheck,
  Truck,
  Sparkles,
  Home,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SignUpClient() {
  const router = useRouter();
  const { signup } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!username.trim()) {
      setErrorMessage("Please enter a username.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 5) {
      setErrorMessage("Password must be at least 5 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("Please accept the terms and conditions to proceed.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signup({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phoneNumber.trim(),
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        `Welcome to Nextronics, ${res.user?.first_name || res.user?.username || "Shopper"}! Navigating to home page...`
      );

      // On successful sign up of user, navigate to home page as requested
      setTimeout(() => {
        router.push("/");
      }, 1300);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during registration.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-[#090d16] text-slate-100 overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-600/15 rounded-full blur-[130px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-blue-600/12 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Navigation Links */}
      <div className="w-full max-w-lg mb-6 flex items-center justify-between text-xs text-slate-400">
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
          <span>Explore Products</span>
        </Link>
      </div>

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
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

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customer Registration</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white mt-1">
              Create Your Customer Account
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Join Nextronics for express order processing, tracking, and member tech discounts.
            </p>
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="reg-username" className="block text-xs font-semibold text-slate-300 mb-1">
                Username <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
                <input
                  id="reg-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. tech_enthusiast"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 transition-all"
                />
              </div>
            </div>

            {/* Name Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-firstname" className="block text-xs font-semibold text-slate-300 mb-1">
                  First Name
                </label>
                <input
                  id="reg-firstname"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alex"
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 transition-all"
                />
              </div>

              <div>
                <label htmlFor="reg-lastname" className="block text-xs font-semibold text-slate-300 mb-1">
                  Last Name
                </label>
                <input
                  id="reg-lastname"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Hunter"
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="reg-phone" className="block text-xs font-semibold text-slate-300 mb-1">
                Phone Number <span className="text-slate-500 text-[10px]">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="reg-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 transition-all"
                />
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-300 mb-1">
                  Password <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 5 chars"
                    className="w-full pl-9 pr-9 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="reg-confirm" className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="reg-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className={`w-full pl-9 pr-9 py-2.5 bg-slate-900/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                      confirmPassword && password !== confirmPassword
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/25"
                        : confirmPassword && password === confirmPassword
                        ? "border-emerald-500 focus:ring-2 focus:ring-emerald-500/25"
                        : "border-slate-700/80 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span>
                  I agree to the Nextronics{" "}
                  <Link href="#terms" className="text-cyan-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#privacy" className="text-cyan-400 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || Boolean(successMessage)}
              className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-blue-600/30 hover:shadow-cyan-500/30 transition-all ${
                isLoading || successMessage ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Your Account...</span>
                </div>
              ) : successMessage ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Account Ready! Navigating Home...</span>
                </div>
              ) : (
                <>
                  <span>Create Account & Start Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Bottom Link to Sign In */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs">
            <p className="text-slate-400">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/40 hover:decoration-cyan-400 transition-colors"
              >
                Sign In here
              </Link>
            </p>
          </div>
        </div>

        {/* Member Benefits Strip */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60 flex flex-col items-center gap-1">
            <Truck className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">Free Delivery</span>
            <span className="text-slate-500">Orders over $99</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60 flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">100% Genuine</span>
            <span className="text-slate-500">Official Warranty</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60 flex flex-col items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">Tech Rewards</span>
            <span className="text-slate-500">Member Discounts</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
