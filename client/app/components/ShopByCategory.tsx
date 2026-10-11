"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  Variants,
} from "framer-motion";
import {
  Wind,
  Speaker,
  Smartphone,
  Sparkles,
  CookingPot,
  Laptop,
  Snowflake,
  Home,
  ArrowRight,
  Layers,
  ChevronRight,
} from "lucide-react";

export interface CategoryItem {
  id: string;
  name: string;
  count: string;
  image: string;
  href: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "air-conditioner",
    name: "Air conditioner",
    count: "4 Products",
    image: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-06.jpg",
    href: "https://websitedemos.net/electronic-store-04/product-category/air-conditioner/?customize=template",
    icon: Wind,
  },
  {
    id: "audio-video",
    name: "Audio & video",
    count: "5 Products",
    image: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-08.jpg",
    href: "https://websitedemos.net/electronic-store-04/product-category/audio-video/?customize=template",
    icon: Speaker,
  },
  {
    id: "gadgets",
    name: "Gadgets",
    count: "6 Products",
    image: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-02.jpg",
    href: "https://websitedemos.net/electronic-store-04/product-category/gadgets/?customize=template",
    icon: Smartphone,
  },
  {
    id: "home-appliances",
    name: "Home appliances",
    count: "5 Products",
    image: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-07.jpg",
    href: "https://websitedemos.net/electronic-store-04/product-category/home-appliances/?customize=template",
    icon: Sparkles,
  },
  {
    id: "kitchen-appliances",
    name: "Kitchen appliances",
    count: "6 Products",
    image: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-05.jpg",
    href: "https://websitedemos.net/electronic-store-04/product-category/kitchen-appliances/?customize=template",
    icon: CookingPot,
  },
  {
    id: "pcs-laptop",
    name: "PCs & laptop",
    count: "4 Products",
    image: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-03.jpg",
    href: "https://websitedemos.net/electronic-store-04/product-category/pcs-laptop/?customize=template",
    icon: Laptop,
  },
  {
    id: "refrigerator",
    name: "Refrigerator",
    count: "4 Products",
    image: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-04.jpg",
    href: "https://websitedemos.net/electronic-store-04/product-category/refrigerator/?customize=template",
    icon: Snowflake,
  },
  {
    id: "smart-home",
    name: "Smart home",
    count: "5 Products",
    image: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-01.jpg",
    href: "https://websitedemos.net/electronic-store-04/product-category/smart-home/?customize=template",
    icon: Home,
  },
];

/* ------------------------------------------------------------------ */
/* Animation variants                                                  */
/* ------------------------------------------------------------------ */

const headerContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const headerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
};

const gridVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 24 },
  },
};

/* ------------------------------------------------------------------ */
/* Animated counter for "N Departments Available"                      */
/* ------------------------------------------------------------------ */

function DepartmentCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(0);

  React.useEffect(() => {
    if (!inView) return;
    let frame: number;
    const duration = 700;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}

/* ------------------------------------------------------------------ */
/* Individual category card with mouse-tracked tilt                    */
/* ------------------------------------------------------------------ */

function CategoryCard({ category }: { category: CategoryItem }) {
  const [hasError, setHasError] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 25,
  });

  // Shine sweep follows cursor horizontally
  const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const Icon = category.icon;

  return (
    <motion.div variants={cardVariants} style={{ perspective: 800 }}>
      <motion.a
        ref={cardRef}
        href={category.href}
        aria-label={`Visit product category ${category.name}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex flex-col items-center text-center rounded-2xl border border-slate-800/80 bg-gradient-to-b from-[#0e1628]/90 via-[#0b1120]/90 to-[#080d1a]/95 p-4 sm:p-5 hover:border-cyan-500/50 hover:bg-gradient-to-b hover:from-[#131d36] hover:to-[#0c1326] hover:shadow-[0_16px_35px_-10px_rgba(6,182,212,0.15)] focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      >
        {/* Subtle top ambient glow on hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-20 w-3/4 rounded-full bg-cyan-500/10 blur-xl"
        />

        {/* CATEGORY IMAGE CONTAINER */}
        <div
          style={{ transform: "translateZ(20px)" }}
          className="relative w-full aspect-square max-w-[210px] mx-auto rounded-xl bg-[#070c18] border border-slate-800/80 p-3 sm:p-4 flex items-center justify-center overflow-hidden transition-colors duration-300 group-hover:border-blue-500/40 group-hover:bg-[#091022] shadow-inner"
        >
          {/* Category Icon Badge in top-right — pops in on hover */}
          <motion.div
            initial={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.15, rotate: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-lg bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition-colors backdrop-blur-sm shadow"
          >
            <Icon className="w-3.5 h-3.5" />
          </motion.div>

          {/* Main Product Image */}
          {!hasError ? (
            <motion.img
              src={category.image}
              alt={category.name}
              width={300}
              height={300}
              loading="lazy"
              decoding="async"
              onError={() => setHasError(true)}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          ) : (
            /* High-tech fallback if network fails */
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-cyan-400/80"
            >
              <Icon className="w-12 h-12 stroke-[1.5]" />
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                {category.name}
              </span>
            </motion.div>
          )}

          {/* Shine sweep overlay — follows cursor on hover */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: useTransform(
                shineX,
                (x) =>
                  `radial-gradient(120px circle at ${x} 30%, rgba(255,255,255,0.10), transparent 70%)`
              ),
            }}
          />
        </div>

        {/* CATEGORY NAME BELOW THE IMAGE */}
        <h3 className="relative mt-4 text-sm sm:text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors tracking-tight line-clamp-1">
          {category.name}
          <motion.span
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.25 }}
            className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-[1.5px] w-10 origin-center bg-cyan-400/70"
          />
        </h3>

        {/* TOTAL NUMBER OF PRODUCTS FOR THE CATEGORY */}
        <div className="mt-2 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/90 text-cyan-300/90 border border-slate-800 group-hover:border-cyan-500/40 group-hover:bg-blue-950/40 group-hover:text-cyan-200 transition-all duration-200 shadow-sm">
            <motion.span
              animate={{ opacity: [1, 0.35, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            />
            {category.count}
          </span>
        </div>

        {/* View Arrow / Action hint */}
        <motion.div
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="mt-3.5 flex items-center justify-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors"
        >
          <span>View Products</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
        </motion.div>
      </motion.a>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Main section                                                        */
/* ------------------------------------------------------------------ */

export default function ShopByCategory() {
  return (
    <section
      className="mt-10 sm:mt-14 lg:mt-16 w-full"
      aria-label="Shop by Category"
      id="shop-by-category"
    >
      {/* SECTION HEADER */}
      <motion.div
        variants={headerContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800/80"
      >
        <div>
          {/* Subheading pill */}
          <motion.div
            variants={headerItemVariants}
            className="relative inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] sm:text-xs font-bold text-cyan-400 tracking-wider uppercase mb-2.5 backdrop-blur-sm overflow-hidden"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Curated Collections</span>
            {/* Shimmer sweep loop */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Section Main Title matching user requirement */}
          <motion.h2
            variants={headerItemVariants}
            className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3"
          >
            Shop by Category
            <motion.span
              animate={{ opacity: [1, 0.35, 1], scale: [1, 1.25, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
            ></motion.span>
          </motion.h2>
          <motion.p
            variants={headerItemVariants}
            className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-xl"
          >
            Explore our cutting-edge electronic collections — from high-performance computing to intelligent smart appliances.
          </motion.p>
        </div>

        {/* Quick info / Explore all link */}
        <motion.div
          variants={headerItemVariants}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="text-xs font-semibold text-slate-400 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-lg">
            <DepartmentCounter value={CATEGORIES.length} /> Departments Available
          </span>
        </motion.div>
      </motion.div>

      {/* CATEGORIES GRID: Responsive 4-column layout as specified in WooCommerce columns-4 */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
      >
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </motion.div>
    </section>
  );
}