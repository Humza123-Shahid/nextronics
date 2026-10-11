"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Sparkles, ShieldCheck, Clock } from "lucide-react";

interface LimitedStockBannerProps {
  onClaimDeal?: () => void;
  /** Countdown starting point, in seconds. Defaults to 14h 32m 08s */
  initialSecondsLeft?: number;
  /** Units left in stock, out of a total of 75 (used for the progress bar) */
  unitsLeft?: number;
}

const TOTAL_UNITS = 75;

export default function LimitedStockBanner({
  onClaimDeal,
  initialSecondsLeft = 14 * 3600 + 32 * 60 + 8,
  unitsLeft = 9,
}: LimitedStockBannerProps) {
  const [imageError, setImageError] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(initialSecondsLeft);
  const [barWidth, setBarWidth] = useState(0);
  const hasMounted = useRef(false);

  // Tick the countdown timer down every second
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Animate the stock progress bar filling in on mount, and whenever
  // unitsLeft changes (in case the parent wires this up to real data)
  useEffect(() => {
    const targetPct = Math.max(
      0,
      Math.min(100, ((TOTAL_UNITS - unitsLeft) / TOTAL_UNITS) * 100)
    );
    const delay = hasMounted.current ? 0 : 300;
    const t = setTimeout(() => setBarWidth(targetPct), delay);
    hasMounted.current = true;
    return () => clearTimeout(t);
  }, [unitsLeft]);

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const isEndingSoon = secondsLeft < 60;

  return (
    <div className="lsb-enter relative overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-500/20 bg-gradient-to-r from-[#0d1428] via-[#101b33] to-[#090d18] shadow-2xl p-5 sm:p-7 md:p-8 lg:p-10 transition-all duration-300 hover:border-blue-500/40">
      {/* Ambient background glow highlights */}
      <div className="lsb-float-1 pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-blue-600/15 blur-[90px]" />
      <div className="lsb-float-2 pointer-events-none absolute right-4 bottom-0 h-64 w-64 rounded-full bg-cyan-500/15 blur-[90px]" />

      {/* Full-section diagonal shimmer sweep */}
      <div className="lsb-section-shimmer pointer-events-none absolute inset-0 z-[1]" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-10">
        {/* LEFT COLUMN: Heading & Limited Deal Info */}
        <div className="w-full md:w-7/12 lg:w-3/5 text-left flex flex-col items-start space-y-3.5 sm:space-y-4">
          {/* Urgency Badge */}
          <div className="lsb-shimmer inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400">
            <Flame className="w-3.5 h-3.5 fill-orange-400 animate-pulse" />
            <span className="tracking-wide uppercase text-[11px] sm:text-xs">
              Exclusive Drop • Limited Time Offer
            </span>
          </div>

          {/* Main Heading as specified */}
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-[2.6rem] font-black tracking-tight text-white leading-tight">
            Limited Stock!{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Grab Yours Now
            </span>
          </h2>

          {/* Subtext description for the electronics item */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Premium Nextronics Wireless Spatial Audio Speaker with 360° Studio Sound &amp; Deep Bass Subwoofer.
            Engineered for audiophiles with lossless low-latency streaming and 24-hour battery endurance.
          </p>

          {/* Stock Meter & Guarantee */}
          <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  Deal ends in{" "}
                  <strong
                    className={`tabular-nums ${isEndingSoon ? "lsb-time-critical text-red-400" : ""
                      }`}
                  >
                    {hours}h : {minutes}m : {seconds}s
                  </strong>
                </span>
              </span>
              <span
                key={unitsLeft}
                className="lsb-stock-flash text-orange-400 font-bold"
              >
                Only {unitsLeft} units left!
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="lsb-bar-shimmer relative bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-[width] duration-1000 ease-out"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>

          {/* CTA Button & Highlights */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4 w-full">
            <Link
              href="#limited-deal"
              onClick={onClaimDeal}
              className="lsb-cta-pulse group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:from-blue-500 hover:to-cyan-400 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Starting at $79</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official 2-Year Warranty</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Item Image */}
        <div className="w-full md:w-5/12 lg:w-2/5 flex justify-center md:justify-end">
          <div className="relative group max-w-[260px] sm:max-w-[290px] md:max-w-[320px] w-full flex items-center justify-center">
            {/* Pulsing circular backlight */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 via-cyan-400/20 to-indigo-500/10 blur-2xl group-hover:scale-110 transition-transform duration-500" />

            {/* Discount Badge */}
            <div className="lsb-badge-pop absolute top-2 right-2 z-20 rounded-full bg-red-500/90 text-white font-black text-[11px] sm:text-xs px-2.5 py-1 shadow-lg border border-red-400/40 tracking-wider">
              -45% OFF
            </div>

            {/* Feature Tag */}
            <div className="lsb-tag-slide absolute bottom-2 left-2 z-20 backdrop-blur-md bg-slate-900/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-cyan-300 flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Hi-Res Audio Certified</span>
            </div>

            {/* Product Image */}
            <div className="lsb-product-float relative w-full aspect-[3/4] max-h-[290px] sm:max-h-[320px] flex items-center justify-center p-2">
              <img
                src={
                  imageError
                    ? "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product19-300x300.png"
                    : "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2025/03/3-225x300.png"
                }
                alt="Limited Stock Speaker Deal"
                onError={() => setImageError(true)}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* 1. Banner entrance: fade + slide up on mount */
        @keyframes lsbEnter {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .lsb-enter { animation: lsbEnter 0.6s ease-out both; }

        /* 2. Ambient glow orbs drifting slowly */
        @keyframes lsbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 15px) scale(1.1); }
        }
        @keyframes lsbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-15px, -10px) scale(1.05); }
        }
        .lsb-float-1 { animation: lsbFloat1 8s ease-in-out infinite; }
        .lsb-float-2 { animation: lsbFloat2 9s ease-in-out infinite; }

        /* Full-section diagonal shimmer sweep across the banner background */
        .lsb-section-shimmer {
          background: linear-gradient(
            115deg,
            transparent 0%,
            transparent 35%,
            rgba(125, 211, 252, 0.10) 45%,
            rgba(255, 255, 255, 0.16) 50%,
            rgba(125, 211, 252, 0.10) 55%,
            transparent 65%,
            transparent 100%
          );
          background-size: 250% 250%;
          background-position: -50% -50%;
          animation: lsbSectionShimmer 5s ease-in-out infinite;
        }
        @keyframes lsbSectionShimmer {
          0% { background-position: -50% -50%; }
          50% { background-position: 150% 150%; }
          100% { background-position: -50% -50%; }
        }

        /* 3. Urgency badge shimmer sweep */
        .lsb-shimmer {
          position: relative;
          overflow: hidden;
        }
        .lsb-shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.25),
            transparent
          );
          animation: lsbShimmerSweep 2.5s infinite;
        }
        @keyframes lsbShimmerSweep {
          100% { left: 130%; }
        }

        /* 5. Progress bar fill shimmer */
        .lsb-bar-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.2);
          animation: lsbShimmerSweep 2s infinite;
        }

        /* 4. Countdown flashing red in the final minute */
        @keyframes lsbTimeCritical {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .lsb-time-critical { animation: lsbTimeCritical 1s ease-in-out infinite; }

        /* 10. Stock count flash on change */
        @keyframes lsbStockFlash {
          0% { color: #ffffff; transform: scale(1.3); }
          100% { color: #fb923c; transform: scale(1); }
        }
        .lsb-stock-flash {
          display: inline-block;
          animation: lsbStockFlash 0.6s ease-out;
        }

        /* 6. CTA button attention pulse ring */
        @keyframes lsbCtaPulseRing {
          0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(56, 189, 248, 0); }
          100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
        }
        .lsb-cta-pulse { animation: lsbCtaPulseRing 2.5s infinite; }

        /* 7. Product image idle float */
        @keyframes lsbProductFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .lsb-product-float { animation: lsbProductFloat 4s ease-in-out infinite; }

        /* 8. Discount badge pop-in with overshoot, staggered after entrance */
        @keyframes lsbBadgePop {
          0% { transform: scale(0) rotate(-8deg); opacity: 0; }
          70% { transform: scale(1.15) rotate(-8deg); opacity: 1; }
          100% { transform: scale(1) rotate(-8deg); }
        }
        .lsb-badge-pop {
          animation: lsbBadgePop 0.5s ease-out 0.3s both;
        }

        /* 9. Feature tag slide-in, staggered after badge */
        @keyframes lsbTagSlide {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .lsb-tag-slide {
          animation: lsbTagSlide 0.5s ease-out 0.5s both;
        }

        /* Respect users who prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .lsb-enter,
          .lsb-float-1,
          .lsb-float-2,
          .lsb-section-shimmer,
          .lsb-shimmer::after,
          .lsb-bar-shimmer::after,
          .lsb-time-critical,
          .lsb-stock-flash,
          .lsb-cta-pulse,
          .lsb-product-float,
          .lsb-badge-pop,
          .lsb-tag-slide {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}