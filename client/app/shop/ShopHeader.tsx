"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Cpu,
  Headset,
  Mail,
  Globe,
  User,
  Heart,
  Shuffle,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { resolveGadgetHref } from "../lib/gadgetsNav"; // adjust path if needed

type NavItem = { name: string; href: string; badge?: "HOT" | "NEW" };

const NAV: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "On Sale", href: "#on-sale", badge: "HOT" },
  { name: "Most Popular", href: "#most-popular" },
  // { name: "Computer & Laptop", href: "#computer-laptop" },
  { name: "New Arrival", href: "#new-arrival", badge: "NEW" },
  { name: "Contact Us", href: "/contact" },
];

const BLINK_CSS = `
@keyframes shop-badge-blink {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.95); }
}
.shop-badge-blink { animation: shop-badge-blink 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
@media (prefers-reduced-motion: reduce) { .shop-badge-blink { animation: none; } }
`;

function NavBadge({ type }: { type: "HOT" | "NEW" }) {
  return (
    <span
      className={`shop-badge-blink text-[9px] font-black px-1.5 py-0.5 rounded leading-none ${type === "HOT" ? "bg-orange-500 text-white" : "bg-cyan-500 text-slate-900"
        }`}
    >
      {type}
    </span>
  );
}

/** Small hover dropdown used in the top utility bar */
function TopDropdown({
  label,
  icon,
  items,
}: {
  label: string;
  icon?: React.ReactNode;
  items: { name: string; href: string }[];
}) {
  return (
    <li className="relative group">
      <button
        type="button"
        className="flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400"
      >
        {icon}
        {label}
        <ChevronDown className="w-3 h-3" />
      </button>
      <ul className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition absolute right-0 top-full min-w-[130px] bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-slate-800 rounded-b-lg shadow-xl z-50 py-1">
        {items.map((i) => (
          <li key={i.name}>
            <Link
              href={i.href}
              className="block px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-cyan-400"
            >
              {i.name}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5">
        <div className="w-full h-full rounded-[10px] bg-[#0c101d] flex items-center justify-center">
          <Cpu className="w-5 h-5 text-cyan-400" />
        </div>
      </div>
      <span className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
        NEXTRONICS
      </span>
    </Link>
  );
}

export default function ShopHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock page scroll behind the mobile drawer; close it if the screen grows to desktop
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onResize = () => window.innerWidth >= 1280 && setMobileOpen(false);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("resize", onResize);
    };
  }, [mobileOpen]);

  const actionLink =
    "flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400";
  const badge =
    "absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center";

  return (
    <header className="contents font-sans text-slate-900 dark:text-slate-100">
      <style>{BLINK_CSS}</style>
      {/* ===== Mobile navbar ===== */}
      <div className="xl:hidden sticky top-0 z-40 bg-white/95 dark:bg-[#0c101d]/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-y-auto max-h-[calc(100dvh-64px)] border-t border-slate-200 dark:border-slate-800"
            >
              <ul className="p-4 space-y-1 text-sm font-semibold">
                {NAV.map((n) => (
                  <li key={n.name}>
                    <Link
                      href={resolveGadgetHref(n.href)}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${n.href === "/shop" ? "text-blue-600 dark:text-cyan-400" : ""
                        }`}
                    >
                      <span>{n.name}</span>
                      {n.badge && <NavBadge type={n.badge} />}
                    </Link>
                  </li>
                ))}
                <li className="flex flex-wrap gap-x-1 gap-y-1 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <Link href="#wishlist" className={actionLink}>
                    <Heart className="w-4 h-4" /> Wishlist
                  </Link>
                  <Link href="#compare" className={actionLink}>
                    <Shuffle className="w-4 h-4" /> Compare
                  </Link>
                  <Link href="#cart" className={actionLink}>
                    <ShoppingCart className="w-4 h-4" /> Cart
                  </Link>
                </li>
                <li className="flex flex-wrap gap-x-4 gap-y-1 px-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
                  <Link href="#login" className="hover:text-blue-600">Login</Link>
                  <Link href="#signup" className="hover:text-blue-600">Signup</Link>
                  <a href="mailto:support@nextronics.com" className="hover:text-blue-600 break-all">
                    support@nextronics.com
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== Top utility bar (desktop) ===== */}
      <div className="hidden xl:block bg-white dark:bg-[#0c101d] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-12 items-center">
          <ul className="col-span-4 flex items-center gap-5 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-1.5">
              <Headset className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              24/7 Hours Support
            </li>
            <li className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <a href="mailto:support@nextronics.com" className="hover:text-blue-600 dark:hover:text-cyan-400">
                support@nextronics.com
              </a>
            </li>
          </ul>
          <p className="col-span-5 text-center text-xs text-slate-500 dark:text-slate-400 py-2">
            Welcome to our world class electronics store
          </p>
          <ul className="col-span-3 flex items-center justify-end">
            <TopDropdown
              label="English"
              icon={<Globe className="w-3.5 h-3.5" />}
              items={[
                { name: "English", href: "#lang-en" },
                { name: "Arabic", href: "#lang-ar" },
              ]}
            />
            <TopDropdown
              label="$ USD"
              items={[
                { name: "USD", href: "#cur-usd" },
                { name: "INR", href: "#cur-inr" },
              ]}
            />
            <TopDropdown
              label="My Account"
              icon={<User className="w-3.5 h-3.5" />}
              items={[
                { name: "Login", href: "#login" },
                { name: "Signup", href: "#signup" },
              ]}
            />
          </ul>
        </div>
      </div>

      {/* ===== Main bar (desktop, sticky) ===== */}
      <div className="hidden xl:block sticky top-0 z-40 bg-white/95 dark:bg-[#0c101d]/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4 2xl:gap-8">
          <Logo />

          <nav>
            <ul className="flex items-center gap-5 text-sm font-bold">
              {NAV.map((n) => {
                const active = n.href === "/shop";
                return (
                  <li key={n.name}>
                    <Link
                      href={resolveGadgetHref(n.href)}
                      aria-current={active ? "page" : undefined}
                      className={`py-2 flex items-center gap-1.5 whitespace-nowrap border-b-2 transition-colors ${active
                        ? "text-blue-600 dark:text-cyan-400 border-blue-600 dark:border-cyan-400"
                        : "border-transparent text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400"
                        }`}
                    >
                      <span>{n.name}</span>
                      {n.badge && <NavBadge type={n.badge} />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <ul className="flex items-center divide-x divide-slate-200 dark:divide-slate-800">
            <li>
              <Link href="#wishlist" className={actionLink}>
                <span className="relative">
                  <Heart className="w-5 h-5" />
                  <span className={badge}>0</span>
                </span>
                <span className="sr-only">Wishlist</span>
              </Link>
            </li>
            <li>
              <Link href="#compare" className={actionLink}>
                <span className="relative">
                  <Shuffle className="w-5 h-5" />
                  <span className={badge}>0</span>
                </span>
                <span className="sr-only">Compare</span>
              </Link>
            </li>
            <li className="relative group">
              <Link href="#cart" className={actionLink}>
                <span className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className={badge}>0</span>
                </span>
                <span className="sr-only">Cart</span>
              </Link>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute right-0 top-full w-64 bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-slate-800 rounded-b-lg shadow-xl p-5 text-center">
                <h4 className="text-sm font-bold">Your cart is empty</h4>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}