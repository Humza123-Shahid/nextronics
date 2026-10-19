import { Suspense } from "react";
import type { Metadata } from "next";
import SignInClient from "./SignInClient";

export const metadata: Metadata = {
  title: "Sign In | Nextronics — Electronics & Tech Store",
  description: "Sign in to your Nextronics customer account or administrator portal.",
};

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center bg-[#090d16] text-slate-300">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-500/30 border-t-cyan-400 rounded-full animate-spin" />
            <span className="text-xs text-slate-400">Loading Nextronics Portal...</span>
          </div>
        </div>
      }
    >
      <SignInClient />
    </Suspense>
  );
}
