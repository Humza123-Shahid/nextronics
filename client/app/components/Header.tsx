"use client";

import { useState, useRef, useEffect, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  PhoneCall,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Cpu,
  Zap,
} from "lucide-react";
import { GADGET_TAB_MAP, goToGadgets } from "../lib/gadgetsNav"; // adjust path if needed

interface SubMenuItem {
  name: string;
  href: string;
}

interface CategoryItem {
  id: string;
  name: string;
  href: string;
  subItems?: SubMenuItem[];
}

const shopHref = (name: string) => `/shop?category=${encodeURIComponent(name)}`;

const CATEGORIES: CategoryItem[] = [
  { id: "accessories", name: "Accessories", href: shopHref("Accessories") },
  { id: "audio", name: "Audio", href: shopHref("Audio") },
  { id: "cameras", name: "Cameras", href: shopHref("Cameras") },
  { id: "computer-laptop", name: "Computer & Laptop", href: shopHref("Computer & Laptop") },
  { id: "home-appliances", name: "Home Appliances", href: shopHref("Home Appliances") },
  { id: "most-popular", name: "Most Popular", href: "#most-popular" },   // unchanged
  { id: "new-arrival", name: "New Arrival", href: "#new-arrival" },     // unchanged
  { id: "on-sale", name: "On Sale", href: "#on-sale" },                 // unchanged
  { id: "smartphone", name: "Smartphone", href: shopHref("Smartphone") },
  { id: "video-games", name: "Video Games", href: shopHref("Video Games") },
  { id: "watches", name: "Watches", href: shopHref("Watches") },
];

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "On Sale", href: "#on-sale", badge: "HOT" },
  { name: "Most Popular", href: "#most-popular" },
  // { name: "Computer & Laptop", href: "#computer-laptop" },
  { name: "New Arrival", href: "#new-arrival", badge: "NEW" },
  { name: "Contact Us", href: "/contact" },
];

export default function Header() {
  // --- FULL header state ---
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const catDropdownRef = useRef<HTMLDivElement>(null);

  // --- COMPACT header state ---
  const [compactMenuOpen, setCompactMenuOpen] = useState(false);
  const [compactExpandedCat, setCompactExpandedCat] = useState<string | null>(null);
  const [compactSearchOpen, setCompactSearchOpen] = useState(false);
  const [compactSearchQuery, setCompactSearchQuery] = useState("");
  const compactSearchWrapRef = useRef<HTMLDivElement>(null);
  const compactSearchInputRef = useRef<HTMLInputElement>(null);

  // --- Scroll detection with scrollY check to prevent menu layout shifts ---
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // --- Gadget section navigation (On Sale / Most Popular / New Arrival) ---
  // If the href maps to a gadget tab, we prevent the default anchor jump,
  // run the optional callback (e.g. close a menu), then fire the tab-select
  // event + smooth scroll. `delay` lets mobile drawers finish closing first,
  // because the scroll-lock cleanup calls window.scrollTo(0, savedScrollY).
  const handleGadgetLink = (
    e: ReactMouseEvent<HTMLAnchorElement>,
    href: string,
    afterClick?: () => void,
    delay = 0
  ) => {
    const tab = GADGET_TAB_MAP[href];
    afterClick?.();
    if (!tab) return; // normal link, let it behave as usual
    e.preventDefault();
    setTimeout(() => goToGadgets(tab), delay);
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Ensure the user has actually scrolled down from the top of the page (window.scrollY > 50)
        // before activating the compact header. This prevents mobile menu expansion from triggering it.
        if (!entry.isIntersecting && window.scrollY > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);

    // Also reset compact header if mobile menu opens while at top of page
    if (mobileMenuOpen && window.scrollY <= 50) {
      setIsScrolled(false);
    }

    return () => observer.disconnect();
  }, [mobileMenuOpen]);

  // Close category dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        catDropdownRef.current &&
        !catDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close compact search panel on outside click / Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        compactSearchWrapRef.current &&
        !compactSearchWrapRef.current.contains(event.target as Node)
      ) {
        setCompactSearchOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setCompactSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Autofocus the compact search input whenever it opens
  useEffect(() => {
    if (compactSearchOpen) {
      const t = setTimeout(() => compactSearchInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [compactSearchOpen]);

  const compactIconBtnClasses =
    "p-1.5 sm:p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center shrink-0";

  // Lock background page scroll while either mobile drawer is open, so the
  // drawer itself scrolls (internally) instead of the page behind it.
  useEffect(() => {
    const anyMenuOpen = mobileMenuOpen || compactMenuOpen;
    if (!anyMenuOpen) return;

    const scrollY = window.scrollY;
    const { style } = document.body;
    const prevPosition = style.position;
    const prevTop = style.top;
    const prevWidth = style.width;
    const prevOverflowY = style.overflowY;

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    style.overflowY = "scroll"; // keep scrollbar width stable, avoid layout shift

    return () => {
      style.position = prevPosition;
      style.top = prevTop;
      style.width = prevWidth;
      style.overflowY = prevOverflowY;
      window.scrollTo(0, scrollY);
    };
  }, [mobileMenuOpen, compactMenuOpen]);

  return (
    <>
      <style jsx global>{`
        /* Continuous Badge Blink */
        @keyframes badge-blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.95); }
        }
        .animate-custom-blink {
          animation: badge-blink 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Badge Pop / Pulse Animation */
        @keyframes badge-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .animate-badge-pop {
          animation: badge-pop 2s infinite ease-in-out;
        }

        /* Top Announcement Banner Marquee */
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-track {
          display: flex;
          width: 200%;
          animation: marquee 18s linear infinite;
        }

        /* Hover Navigation Link Underline Effect */
        .nav-underline-link {
          position: relative;
        }
        .nav-underline-link::after {
          content: '';
          position: absolute;
          bottom: 0px;
          left: 50%;
          width: 0%;
          height: 2px;
          background-color: #2563eb;
          transition: width 0.3s ease, left 0.3s ease;
        }
        .nav-underline-link:hover::after {
          width: 100%;
          left: 0%;
        }

        /* Logo Glow Spinning Ring */
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>

      {/* ================= FULL HEADER ================= */}
      <header className="w-full font-sans shadow-md border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c101d] text-slate-900 dark:text-slate-100 relative z-40">

        {/* Top Utility Banner with Marquee Scroll */}
        <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <div className="animate-marquee-track">
                <div className="flex items-center gap-2 text-cyan-400 font-medium pr-12">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Spring Electronics Fest: Up to 40% Off Laptops, Audio & Smart Gadgets!</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400 font-medium pr-12">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Spring Electronics Fest: Up to 40% Off Laptops, Audio & Smart Gadgets!</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-slate-400 shrink-0">
              <span>Free Delivery on Orders Over $99</span>
              <span>|</span>
              <Link href="#contact-us" className="hover:text-cyan-400">
                Need Help?
              </Link>
            </div>
          </div>
        </div>

        {/* 1. MAIN HEADER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4 lg:gap-8">

            {/* LEFT: Logo */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Mobile menu trigger button scale animation */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>

              <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20 shrink-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 animate-spin-slow opacity-60" />
                  <div className="relative w-full h-full rounded-[10px] bg-[#0c101d] flex items-center justify-center">
                    <motion.div whileHover={{ rotate: 90 }} transition={{ type: "spring", stiffness: 200 }}>
                      <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                    </motion.div>
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base sm:text-xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1 truncate">
                    NEXTRONICS
                    <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-blue-600 text-white shrink-0">
                      TECH
                    </span>
                  </span>
                  <span className="hidden sm:block text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase truncate">
                    Electronics Store
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER: Search Bar Focus Scale Animation */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="w-full flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/90 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 overflow-hidden"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, laptops, audio, phones..."
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </motion.button>
              </form>
            </div>

            {/* RIGHT: Action Icons */}
            <div className="flex items-center gap-1 sm:gap-4 shrink-0">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#wishlist"
                  className="hidden sm:flex relative p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 items-center gap-1.5"
                  title="Wishlist"
                >
                  <div className="relative">
                    <Heart className="w-5 h-5 stroke-[1.75px]" />
                    <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow animate-badge-pop">
                      2
                    </span>
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#my-account"
                  className="p-1.5 sm:p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                  title="My Account"
                >
                  <User className="w-5 h-5 stroke-[1.75px]" />
                  <div className="hidden xl:flex flex-col text-left text-xs leading-tight">
                    <span className="text-[10px] text-slate-400">Account</span>
                    <span className="font-semibold">Sign In</span>
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="#cart"
                  className="flex items-center gap-2 sm:gap-2.5 bg-blue-600/10 dark:bg-blue-500/10 border border-blue-500/20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white group"
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-cyan-400 group-hover:text-white" />
                    <span className="absolute -top-1.5 -right-2 bg-blue-600 group-hover:bg-white group-hover:text-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow animate-badge-pop">
                      3
                    </span>
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-tight">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 group-hover:text-blue-100 uppercase font-bold">
                      Your Cart
                    </span>
                    <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 group-hover:text-white">
                      $349.00
                    </span>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 2. SUB-HEADER BAR */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-[#090d18] text-slate-800 dark:text-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">

              {/* Dropdown Menu Trigger */}
              <div className="relative shrink-0" ref={catDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCatOpen(!isCatOpen)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-sm font-bold px-2.5 sm:px-6 py-2.5 sm:py-3 flex items-center gap-1.5 sm:gap-2.5 shadow-sm whitespace-nowrap"
                >
                  <div className="hidden sm:flex flex-col gap-1 w-4">
                    <span className="h-0.5 w-full bg-white rounded-full"></span>
                    <span className="h-0.5 w-full bg-white rounded-full"></span>
                    <span className="h-0.5 w-full bg-white rounded-full"></span>
                  </div>
                  <Menu className="sm:hidden w-3.5 h-3.5" />
                  <span>All Categories</span>
                  <motion.div animate={{ rotate: isCatOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Framer Motion Dropdown & Submenu */}
                <AnimatePresence>
                  {isCatOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute left-0 top-full w-64 bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-slate-800 rounded-b-xl shadow-2xl z-50 py-2"
                      onMouseLeave={() => setHoveredCat(null)}
                    >
                      <ul className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                        {CATEGORIES.map((cat) => {
                          const hasSubmenu = Boolean(cat.subItems && cat.subItems.length > 0);
                          const isHovered = hoveredCat === cat.id;

                          return (
                            <li key={cat.id} className="relative" onMouseEnter={() => setHoveredCat(cat.id)}>
                              <Link
                                href={cat.href}
                                onClick={(e) => handleGadgetLink(e, cat.href, () => setIsCatOpen(false))}
                                className="flex items-center justify-between px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-cyan-400 font-medium"
                              >
                                <span>{cat.name}</span>
                                {hasSubmenu && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                              </Link>

                              {/* NESTED SUBLIST */}
                              <AnimatePresence>
                                {hasSubmenu && isHovered && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-full top-0 w-56 bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-slate-800 rounded-r-xl shadow-2xl z-50 py-2"
                                  >
                                    <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                                      {cat.name} Sub-Menu
                                    </div>
                                    <ul>
                                      {cat.subItems?.map((sub, sIdx) => (
                                        <li key={sIdx}>
                                          <Link
                                            href={sub.href}
                                            onClick={() => setIsCatOpen(false)}
                                            className="block px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-cyan-400"
                                          >
                                            {sub.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation List Items with Underline Effect */}
              <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700 dark:text-slate-300">
                {NAV_ITEMS.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={(e) => handleGadgetLink(e, item.href)}
                    className="py-3 flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-cyan-400 nav-underline-link"
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.2 rounded animate-custom-blink ${item.badge === "HOT"
                          ? "bg-orange-500 text-white"
                          : "bg-cyan-500 text-slate-900"
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Support Contact */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 py-2 min-w-0">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600/10 dark:bg-cyan-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-cyan-400 shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </motion.div>
                <div className="flex flex-col text-xs leading-tight min-w-0">
                  <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                    Call To
                  </span>
                  <a
                    href="tel:+1800090098"
                    className="font-extrabold text-[11px] sm:text-xs text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-cyan-400 whitespace-nowrap"
                  >
                    +1800090098
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Accordion Drawer (FULL header) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c101d] overflow-y-auto overscroll-contain max-h-[calc(100vh-64px)] p-4 space-y-6 shadow-2xl"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Main Menu
                </div>
                <ul className="space-y-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2 border border-slate-200 dark:border-slate-800">
                  {NAV_ITEMS.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        href={item.href}
                        onClick={(e) =>
                          handleGadgetLink(e, item.href, () => setMobileMenuOpen(false), 350)
                        }
                        className="flex items-center justify-between p-2 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600"
                      >
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-orange-500 text-white animate-custom-blink">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile Submenu Accordion Expand */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  All Categories & Sub-menus
                </div>
                <ul className="space-y-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2 border border-slate-200 dark:border-slate-800">
                  {CATEGORIES.map((cat) => {
                    const hasSubmenu = Boolean(cat.subItems && cat.subItems.length > 0);
                    const isExpanded = mobileExpandedCat === cat.id;

                    return (
                      <li key={cat.id} className="border-b border-slate-200/50 dark:border-slate-800/50 last:border-none">
                        <div className="flex items-center justify-between py-2 px-2 text-xs font-medium">
                          <Link
                            href={cat.href}
                            onClick={(e) =>
                              handleGadgetLink(e, cat.href, () => setMobileMenuOpen(false), 350)
                            }
                            className="text-slate-700 dark:text-slate-200 hover:text-blue-600"
                          >
                            {cat.name}
                          </Link>
                          {hasSubmenu && (
                            <button
                              type="button"
                              onClick={() =>
                                setMobileExpandedCat(isExpanded ? null : cat.id)
                              }
                              className="p-1 text-slate-400 hover:text-blue-600"
                            >
                              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                <ChevronDown className="w-4 h-4" />
                              </motion.div>
                            </button>
                          )}
                        </div>

                        <AnimatePresence>
                          {hasSubmenu && isExpanded && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="pl-4 pb-2 space-y-1 text-xs text-slate-500 dark:text-slate-400 border-l-2 border-blue-500 ml-2 mb-2 overflow-hidden"
                            >
                              {cat.subItems?.map((sub, sIdx) => (
                                <li key={sIdx}>
                                  <Link
                                    href={sub.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-1 hover:text-blue-600 dark:hover:text-cyan-400"
                                  >
                                    • {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
      </header>

      {/* ================= COMPACT HEADER ================= */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 dark:bg-[#0c101d]/90 shadow-md border-b border-slate-200 dark:border-slate-800"
          >
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-2 sm:gap-4 h-16 sm:h-[72px]">

                {/* LEFT */}
                <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setCompactMenuOpen(!compactMenuOpen)}
                    className="lg:hidden p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                    aria-label="Toggle menu"
                  >
                    {compactMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.button>

                  <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20 shrink-0">
                      <div className="w-full h-full rounded-[10px] bg-[#0c101d] flex items-center justify-center">
                        <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                      </div>
                    </div>
                    <span className="text-base sm:text-xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate max-w-[110px] sm:max-w-none">
                      NEXTRONICS
                    </span>
                  </Link>
                </div>

                {/* CENTER */}
                <nav className="hidden lg:flex flex-1 items-center justify-center gap-6 text-xs font-bold text-slate-700 dark:text-slate-300 min-w-0">
                  {NAV_ITEMS.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={(e) => handleGadgetLink(e, item.href)}
                      className="py-2 flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-cyan-400 nav-underline-link whitespace-nowrap"
                    >
                      <span>{item.name}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.2 rounded animate-custom-blink ${item.badge === "HOT"
                            ? "bg-orange-500 text-white"
                            : "bg-cyan-500 text-slate-900"
                            }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>

                {/* RIGHT */}
                <div className="flex items-center gap-0.5 sm:gap-2 shrink-0" ref={compactSearchWrapRef}>
                  {/* Search icon hidden below sm breakpoint (removed at ~320px mobile widths) */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setCompactSearchOpen((prev) => !prev)}
                    className={`hidden sm:flex ${compactIconBtnClasses}`}
                  >
                    {compactSearchOpen ? (
                      <X className="w-5 h-5 stroke-[1.75px]" />
                    ) : (
                      <Search className="w-5 h-5 stroke-[1.75px]" />
                    )}
                  </motion.button>

                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="#wishlist"
                      className={`hidden sm:flex relative ${compactIconBtnClasses}`}
                    >
                      <Heart className="w-5 h-5 stroke-[1.75px]" />
                      <span className="absolute top-0.5 right-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow animate-badge-pop">
                        2
                      </span>
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Link href="#my-account" className={compactIconBtnClasses}>
                      <User className="w-5 h-5 stroke-[1.75px]" />
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="#cart"
                      className="relative flex items-center gap-2 sm:gap-2.5 bg-blue-600/10 dark:bg-blue-500/10 border border-blue-500/20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white shrink-0"
                    >
                      <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                      <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow animate-badge-pop">
                        3
                      </span>
                    </Link>
                  </motion.div>

                  {/* Expandable Compact Search Panel */}
                  <AnimatePresence>
                    {compactSearchOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 top-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c101d] shadow-xl overflow-hidden"
                      >
                        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
                          <form
                            onSubmit={(e) => e.preventDefault()}
                            className="w-full flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/90 shadow-sm overflow-hidden"
                          >
                            <input
                              ref={compactSearchInputRef}
                              type="text"
                              value={compactSearchQuery}
                              onChange={(e) => setCompactSearchQuery(e.target.value)}
                              placeholder="Search for products, laptops, audio, phones..."
                              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                            />
                            <button
                              type="submit"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0"
                            >
                              <Search className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Compact Mobile Accordion Drawer */}
              <AnimatePresence>
                {compactMenuOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:hidden border-t border-slate-200 dark:border-slate-800 overflow-y-auto overscroll-contain max-h-[calc(100vh-72px)] p-4 space-y-6"
                  >
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Main Menu
                      </div>
                      <ul className="space-y-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2 border border-slate-200 dark:border-slate-800">
                        {NAV_ITEMS.map((item, idx) => (
                          <li key={idx}>
                            <Link
                              href={item.href}
                              onClick={(e) =>
                                handleGadgetLink(e, item.href, () => setCompactMenuOpen(false), 350)
                              }
                              className="flex items-center justify-between p-2 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600"
                            >
                              <span>{item.name}</span>
                              {item.badge && (
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-orange-500 text-white animate-custom-blink">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Compact Mobile Submenu Accordion Expand */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        All Categories & Sub-menus
                      </div>
                      <ul className="space-y-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2 border border-slate-200 dark:border-slate-800">
                        {CATEGORIES.map((cat) => {
                          const hasSubmenu = Boolean(cat.subItems && cat.subItems.length > 0);
                          const isExpanded = compactExpandedCat === cat.id;

                          return (
                            <li key={cat.id} className="border-b border-slate-200/50 dark:border-slate-800/50 last:border-none">
                              <div className="flex items-center justify-between py-2 px-2 text-xs font-medium">
                                <Link
                                  href={cat.href}
                                  onClick={(e) =>
                                    handleGadgetLink(e, cat.href, () => setCompactMenuOpen(false), 350)
                                  }
                                  className="text-slate-700 dark:text-slate-200 hover:text-blue-600"
                                >
                                  {cat.name}
                                </Link>
                                {hasSubmenu && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCompactExpandedCat(isExpanded ? null : cat.id)
                                    }
                                    className="p-1 text-slate-400 hover:text-blue-600"
                                  >
                                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                      <ChevronDown className="w-4 h-4" />
                                    </motion.div>
                                  </button>
                                )}
                              </div>

                              <AnimatePresence>
                                {hasSubmenu && isExpanded && (
                                  <motion.ul
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="pl-4 pb-2 space-y-1 text-xs text-slate-500 dark:text-slate-400 border-l-2 border-blue-500 ml-2 mb-2 overflow-hidden"
                                  >
                                    {cat.subItems?.map((sub, sIdx) => (
                                      <li key={sIdx}>
                                        <Link
                                          href={sub.href}
                                          onClick={() => setCompactMenuOpen(false)}
                                          className="block py-1 hover:text-blue-600 dark:hover:text-cyan-400"
                                        >
                                          • {sub.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </motion.ul>
                                )}
                              </AnimatePresence>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}