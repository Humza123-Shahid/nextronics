"use client";

import React from "react";
import MainBannerSlider from "./MainBannerSlider";
import VerticalProductSlider from "./VerticalProductSlider";

interface MainHeroSectionProps {
  onAddToCart?: (productName: string) => void;
}

export default function MainHeroSection({ onAddToCart }: MainHeroSectionProps) {
  return (
    <section className="mt-8 sm:mt-10 lg:mt-12 w-full" aria-label="Featured Hero Showcase">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* FIRST VERTICAL SECTION: Main Image Slider (~60% / 7 cols on lg, 8 cols on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <MainBannerSlider />
        </div>

        {/* SECOND VERTICAL SECTION: 4 Products Per Slide Carousel (~40% / 5 cols on lg, 4 cols on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <VerticalProductSlider onAddToCart={onAddToCart} autoPlayInterval={2000} />
        </div>
      </div>
    </section>
  );
}
