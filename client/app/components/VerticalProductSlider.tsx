"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, ShoppingCart, Check, Flame, Sparkles } from "lucide-react";

export interface VerticalProductItem {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number | string;
  originalPrice?: number | string;
  onSale?: boolean;
  rating: number;
  reviewsCount?: number;
}

const PRODUCT_SLIDES: VerticalProductItem[][] = [
  // Slide 1 (4 products)
  [
    {
      id: "prod-soundwave-speaker",
      name: "SoundWave Pro Spatial Speaker",
      category: "Audio",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product19-300x300.png",
      price: "$41.00",
      originalPrice: "$55.00",
      onSale: true,
      rating: 5.0,
      reviewsCount: 1,
    },
    {
      id: "prod-zenith-laptop",
      name: "ZenithBook Ultra 15.6\" Laptop",
      category: "Computer & Laptop",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product17-300x300.png",
      price: "$88.00",
      rating: 4.0,
      reviewsCount: 1,
    },
    {
      id: "prod-horizon-smartphone",
      name: "Horizon Edge 5G OLED Phone",
      category: "Smartphone",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product20-300x300.png",
      price: "$189.00",
      rating: 4.5,
      reviewsCount: 1,
    },
    {
      id: "prod-studiobeat-anc",
      name: "StudioBeat Over-Ear ANC Headset",
      category: "Audio",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product21-300x300.png",
      price: "$139.00",
      originalPrice: "$169.00",
      onSale: true,
      rating: 4.0,
      reviewsCount: 1,
    },
  ],
  // Slide 2 (4 products)
  [
    {
      id: "prod-cyberpocket-phone",
      name: "CyberPocket Compact 5G Smartphone",
      category: "Smartphone",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product22-300x300.png",
      price: "$77.00",
      rating: 4.2,
      reviewsCount: 1,
    },
    {
      id: "prod-titanflow-gaming",
      name: "TitanFlow 16\" Gaming Laptop",
      category: "Computer & Laptop",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product23-300x300.png",
      price: "$148.00 – $159.00",
      rating: 5.0,
      reviewsCount: 1,
    },
    {
      id: "prod-apexpulse-watch",
      name: "ApexPulse Rugged GPS Smartwatch",
      category: "Watches",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product18-300x300.png",
      price: "$56.00",
      rating: 4.0,
      reviewsCount: 1,
    },
    {
      id: "prod-omnicharge-gan",
      name: "OmniCharge 65W Multiport GaN",
      category: "Accessories",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product15-300x300.png",
      price: "$45.00",
      rating: 4.0,
      reviewsCount: 1,
    },
  ],
  // Slide 3 (4 products)
  [
    {
      id: "prod-fitchrono-watch",
      name: "FitChrono Active Smartwatch",
      category: "Watches",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product12-300x300.png",
      price: "$66.00",
      rating: 4.0,
      reviewsCount: 1,
    },
    {
      id: "prod-vortexstrike-gamepad",
      name: "VortexStrike Wireless Gamepad",
      category: "Video Games",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product6-300x300.png",
      price: "$88.00",
      rating: 4.0,
      reviewsCount: 1,
    },
    {
      id: "prod-aeropure-humidifier",
      name: "AeroPure Smart Ultrasonic Hub",
      category: "Home Appliances",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product7-300x300.png",
      price: "$45.00",
      originalPrice: "$55.00",
      onSale: true,
      rating: 4.0,
      reviewsCount: 1,
    },
    {
      id: "prod-vanguard-tracker",
      name: "Vanguard Sport Fitness Tracker",
      category: "Watches",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product9-300x300.png",
      price: "$33.00",
      rating: 5.0,
      reviewsCount: 1,
    },
  ],
  // Slide 4 (4 products)
  [
    {
      id: "prod-aeroblade-laptop",
      name: "AeroBlade 14\" Portable Laptop",
      category: "Computer & Laptop",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product2-300x300.png",
      price: "$57.00",
      originalPrice: "$63.00",
      onSale: true,
      rating: 4.5,
      reviewsCount: 1,
    },
    {
      id: "prod-optix-camera",
      name: "Optix 4K Mirrorless Digital Camera",
      category: "Cameras",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product3-300x300.png",
      price: "$56.00",
      rating: 4.0,
      reviewsCount: 1,
    },
    {
      id: "prod-cinemapro-action",
      name: "CinemaPro 4K Action Camera",
      category: "Cameras",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product4-300x300.png",
      price: "$55.00",
      originalPrice: "$68.00",
      onSale: true,
      rating: 4.0,
      reviewsCount: 1,
    },
    {
      id: "prod-novapulse-buds",
      name: "NovaPulse Wireless ANC Earbuds",
      category: "Audio",
      image: "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product19-300x300.png",
      price: "$49.00",
      rating: 4.8,
      reviewsCount: 1,
    },
  ],
];

interface VerticalProductSliderProps {
  onAddToCart?: (productName: string) => void;
  /** Milliseconds between auto-advancing slides. Default 5000ms. Set to 0 to disable autoplay. */
  autoPlayInterval?: number;
}

/* ------------------------------------------------------------------ */
/* Animation variants                                                  */
/* ------------------------------------------------------------------ */

// Slide container: direction-aware enter/exit (vertical swap)
const slideVariants: Variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 24 : -24,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.06,
      delayChildren: 0.04,
      y: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -24 : 24,
    opacity: 0,
    transition: { duration: 0.15 },
  }),
};

// Individual product row entrance (staggered by parent)
const rowVariants: Variants = {
  enter: { opacity: 0, y: 10, scale: 0.98 },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 26 },
  },
};

const starVariants: Variants = {
  enter: { opacity: 0, scale: 0 },
  center: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.05 * i, type: "spring", stiffness: 400, damping: 15 },
  }),
};

export default function VerticalProductSlider({
  onAddToCart,
  autoPlayInterval = 5000,
  slides,
}: { onAddToCart?: (productName: string) => void, autoPlayInterval?: number, slides: VerticalProductItem[][] }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  console.log(slides)
  const [direction, setDirection] = useState(1);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  //const totalSlides = PRODUCT_SLIDES.length;
  const totalSlides = slides.length;
  // Keep the latest slide index in a ref so the interval callback
  // always advances from the current slide without needing to be
  // re-created (and reset) every time currentSlideIndex changes.
  const currentSlideRef = useRef(currentSlideIndex);
  useEffect(() => {
    currentSlideRef.current = currentSlideIndex;
  }, [currentSlideIndex]);

  const goTo = (nextIndex: number, dir: number) => {
    setDirection(dir);
    setCurrentSlideIndex(nextIndex);
  };

  const handlePrev = () => {
    goTo((currentSlideIndex - 1 + totalSlides) % totalSlides, -1);
  };

  const handleNext = () => {
    goTo((currentSlideIndex + 1) % totalSlides, 1);
  };

  const handleDotClick = (idx: number) => {
    if (idx === currentSlideIndex) return;
    goTo(idx, idx > currentSlideIndex ? 1 : -1);
  };

  // Autoplay: advance to next slide after `autoPlayInterval` ms.
  // On the last slide it wraps back to the first slide (direction
  // resets to forward/down so the wrap-around still animates cleanly).
  // Pauses while the user is hovering the card, and pauses/resets
  // whenever the user manually navigates (prev/next/dot click).
  useEffect(() => {
    if (!autoPlayInterval || autoPlayInterval <= 0 || isPaused || totalSlides <= 1) {
      return;
    }

    const id = window.setInterval(() => {
      const next = (currentSlideRef.current + 1) % totalSlides;
      setDirection(1);
      setCurrentSlideIndex(next);
    }, autoPlayInterval);

    return () => window.clearInterval(id);
    // Re-armed whenever the user manually changes slides (currentSlideIndex)
    // so each manual interaction resets the countdown.
  }, [autoPlayInterval, isPaused, totalSlides, currentSlideIndex]);

  const handleAddToCart = (product: VerticalProductItem) => {
    onAddToCart?.(product.name);
    setAddedId(product.id);
    window.setTimeout(() => {
      setAddedId((current) => (current === product.id ? null : current));
    }, 1200);
  };
  const handleProductClick = (productId: string) => {
    // Save the clicked product ID to localStorage
    localStorage.setItem("productID", productId);
  };
  //const activeProducts = PRODUCT_SLIDES[currentSlideIndex];
  const activeProducts = slides[currentSlideIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0c111e] to-[#090d16] p-4 sm:p-5 lg:p-6 shadow-2xl flex flex-col justify-between h-full min-h-[420px] sm:min-h-[480px] lg:min-h-[530px]"
    >
      {/* Background soft glow — slow ambient pulse */}
      <motion.div
        className="pointer-events-none absolute right-0 top-0 w-48 h-48 rounded-full bg-blue-500/10 blur-[80px]"
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* HEADER: Section Title + Pagination Nav */}
      <div className="relative z-10 flex items-center justify-between pb-3.5 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <motion.span
            className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <h3 className="text-sm sm:text-base font-black tracking-tight text-white uppercase">
            Special Highlights
          </h3>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-1.5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={currentSlideIndex}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="text-[11px] font-semibold text-slate-400 mr-1.5 inline-block"
            >
              {currentSlideIndex + 1} / {totalSlides}
            </motion.span>
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Products"
            whileHover={{ x: -1 }}
            whileTap={{ scale: 0.85 }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-700/80 bg-slate-800/70 hover:bg-blue-600 hover:border-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>

          <motion.button
            type="button"
            onClick={handleNext}
            aria-label="Next Products"
            whileHover={{ x: 1 }}
            whileTap={{ scale: 0.85 }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-700/80 bg-slate-800/70 hover:bg-blue-600 hover:border-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* 4 PRODUCTS LIST PER SLIDE */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentSlideIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col justify-between h-full gap-2.5 sm:gap-3"
          >
            {activeProducts?.map((product) => {
              //localStorage.setItem("productID", String(product.id))
              const justAdded = addedId === product.id;
              return (
                // <motion.div
                <motion.a
                  key={product.id}
                  href={"/products"}
                  onMouseDown={() => {
                    // Fires immediately when any mouse button (left, right, or middle) is pressed down
                    localStorage.setItem("productID", product.id);
                  }}
                  //onClick={() => handleProductClick(product.id)}
                  variants={rowVariants}
                  whileHover={{ y: -2 }}
                  // className="group relative flex items-center gap-3.5 p-2 sm:p-2.5 rounded-xl border border-slate-800/60 bg-[#0d1424]/60 hover:bg-[#121c33] hover:border-blue-500/40 transition-colors duration-200"
                  className="group relative flex items-center gap-3.5 p-2 sm:p-2.5 rounded-xl border border-slate-800/60 bg-[#0d1424]/60 hover:bg-[#121c33] hover:border-blue-500/40 transition-colors duration-200 cursor-pointer"
                >
                  {/* Product Thumbnail Container */}
                  <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0 rounded-lg bg-slate-900/90 border border-slate-800 p-1 flex items-center justify-center overflow-hidden">
                    {product.onSale && (
                      <motion.span
                        animate={{ opacity: [1, 0.55, 1], scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1 left-1 z-10 bg-red-500 text-white text-[9px] font-black uppercase px-1.5 py-0.2 rounded shadow"
                      >
                        Sale
                      </motion.span>
                    )}
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain filter drop-shadow"
                      loading="lazy"
                      whileHover={{ scale: 1.12, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      onError={(e) => {
                        // graceful fallback
                        (e.target as HTMLImageElement).src =
                          "https://wpthemes.themehunk.com/electronics-megamarket/wp-content/uploads/sites/346/2020/08/product19-300x300.png";
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 pr-1">
                    {/* Title */}
                    {/* <Link
                      href={`#product-${product.id}`}
                      className="block text-xs sm:text-[13px] font-bold text-slate-200 group-hover:text-cyan-400 truncate transition-colors"
                      title={product.name}
                    >
                      {product.name}
                    </Link> */}
                    <div
                      // href={`#product-${product.id}`}
                      className="block text-xs sm:text-[13px] font-bold text-slate-200 group-hover:text-cyan-400 truncate transition-colors"
                      title={product.name}
                    >
                      {product.name}
                    </div>

                    {/* Rating Stars — sequential fill-in */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((star, i) => {
                          const isFilled = star <= Math.floor(product.rating);
                          return (
                            <motion.span
                              key={star}
                              custom={i}
                              variants={starVariants}
                              initial="enter"
                              animate="center"
                            >
                              <Star
                                className={`w-3 h-3 ${isFilled
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-transparent text-slate-600"
                                  }`}
                              />
                            </motion.span>
                          );
                        })}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Price Display */}
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-xs sm:text-sm font-extrabold text-white">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] text-slate-500 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Add to Cart Action */}
                  <motion.button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                    whileTap={{ scale: 0.85 }}
                    animate={justAdded ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border shrink-0 self-center shadow ${justAdded
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white border-slate-700/60 hover:border-blue-500"
                      }`}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {justAdded ? (
                        <motion.span
                          key="check"
                          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                          animate={{ opacity: 1, rotate: 0, scale: 1 }}
                          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-center"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="cart"
                          initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                          animate={{ opacity: 1, rotate: 0, scale: 1 }}
                          exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-center"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.a>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FOOTER: Dots indicator for carousel */}
      <div className="relative z-10 pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Refreshes Weekly</span>
        </span>

        <div className="flex items-center gap-1.5">
          {/* {PRODUCT_SLIDES.map((_, idx) => { */}
          {slides.map((_, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <motion.button
                key={idx}
                type="button"
                onClick={() => handleDotClick(idx)}
                aria-label={`Go to product group ${idx + 1}`}
                whileTap={{ scale: 0.8 }}
                className="relative h-1.5 rounded-full overflow-hidden bg-slate-700 hover:bg-slate-500 transition-colors"
                animate={{ width: isActive ? 20 : 6 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-dot"
                    className="absolute inset-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}