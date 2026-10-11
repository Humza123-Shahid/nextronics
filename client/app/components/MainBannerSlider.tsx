"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Zap, Sparkles } from "lucide-react";

export interface BannerSlide {
  id: string;
  image: string;
  tag: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  secondaryText?: string;
  secondaryHref?: string;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: "slide-innovate",
    image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2025/03/slide-main-1.jpg",
    tag: "NEXT-GEN ELECTRONICS • 2026 EDITION",
    title: "Innovate. Upgrade. Repeat",
    description: "Smart Tech for a Smarter You. Experience ultra-fast computing, high-precision audio, and next-level displays.",
    buttonText: "Shop Now",
    buttonHref: "#shop",
    secondaryText: "View Deals",
    secondaryHref: "#on-sale",
  },
  {
    id: "slide-lifestyle",
    image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2025/03/slide23-1.jpg",
    tag: "SMART CONNECTED LIVING",
    title: "Power Up Your Lifestyle",
    description: "Smart Solutions for Modern Living. Premium wireless audio, intelligent smartwatches, and flagship gadgets.",
    buttonText: "Shop Now",
    buttonHref: "#shop",
    secondaryText: "Explore Categories",
    secondaryHref: "#categories",
  },
];

export default function MainBannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % DEFAULT_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + DEFAULT_SLIDES.length) % DEFAULT_SLIDES.length);
  }, []);

  // Auto-play timer with pause-on-hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 2000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 bg-[#0c101d] shadow-2xl h-[420px] sm:h-[480px] lg:h-[530px] group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Hero Highlights Slider"
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {DEFAULT_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              aria-hidden={!isActive}
            >
              {/* Background Image with Fallback Pattern */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out transform scale-100 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${slide.image}')`,
                  backgroundColor: "#0d1424",
                }}
              />

              {/* Gradient Scrim & Overlays for High Contrast Tech Theme */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/95 via-[#070b14]/75 to-transparent sm:via-[#070b14]/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-80" />

              {/* Glowing Accent Orbs */}
              <div className="pointer-events-none absolute -left-10 top-1/4 h-72 w-72 rounded-full bg-blue-600/20 blur-[100px]" />
              <div className="pointer-events-none absolute left-1/3 bottom-10 h-60 w-60 rounded-full bg-cyan-500/15 blur-[90px]" />

              {/* Slide Content Caption */}
              <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-14 max-w-2xl text-left">
                {/* Tag / Category Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-600/20 px-3.5 py-1 text-[11px] sm:text-xs font-bold text-cyan-400 mb-4 w-fit backdrop-blur-md">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{slide.tag}</span>
                </div>

                {/* Slide Title */}
                <h1 className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight sm:leading-tight">
                  {slide.title}
                </h1>

                {/* Slide Description */}
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-300 line-clamp-3 sm:line-clamp-none max-w-lg leading-relaxed">
                  {slide.description}
                </p>

                {/* Actions */}
                <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                  <Link
                    href={slide.buttonHref}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    <span>{slide.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {slide.secondaryText && (
                    <Link
                      href={slide.secondaryHref || "#"}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold backdrop-blur-md transition-all duration-200"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{slide.secondaryText}</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (Prev & Next) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-700/80 bg-slate-900/80 hover:bg-blue-600 hover:border-blue-500 text-slate-300 hover:text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-xl opacity-90 group-hover:opacity-100 hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-700/80 bg-slate-900/80 hover:bg-blue-600 hover:border-blue-500 text-slate-300 hover:text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-xl opacity-90 group-hover:opacity-100 hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
      </button>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-4 sm:bottom-6 left-6 sm:left-10 md:left-14 z-30 flex items-center gap-2">
        {DEFAULT_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${isActive
                ? "w-8 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-md shadow-cyan-500/40"
                : "w-2.5 bg-slate-600/80 hover:bg-slate-400"
                }`}
            />
          );
        })}
      </div>
    </div>
  );
}
