import { Suspense } from "react";
import type { Metadata } from "next";
import SignUpClient from "./SignUpClient";

export const metadata: Metadata = {
  title: "Create Account | Nextronics — Electronics & Tech Store",
  description: "Join Nextronics to unlock member-only tech deals, tracking, and fast checkout.",
};

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center bg-[#090d16] text-slate-300">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-cyan-500/30 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-xs text-slate-400">Loading Registration...</span>
          </div>
        </div>
      }
    >
      <SignUpClient />
    </Suspense>
  );
}
