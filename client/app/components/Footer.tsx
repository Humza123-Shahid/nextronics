"use client";

import { useState, type SVGProps, type FormEvent } from "react";
import Link from "next/link";
import { Sora, Inter } from "next/font/google";
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
import { usePathname } from "next/navigation";
import { selectGadgetTab, type GadgetTabId } from "../lib/gadgetsNav";

/**
 * Fonts
 * If your app already loads fonts globally in `app/layout.tsx`, you can
 * remove this block and swap `sora.className` / `inter.className` below
 * for your existing font variables instead.
 */


const sora = Sora({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

/* ---------------------------------- Icons --------------------------------- */
/* Lightweight inline SVGs — no external icon package required. */

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function MapPinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SendIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterXIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2H21.5l-7.5 8.57L22.75 22h-6.9l-5.4-7.06L4.2 22H1l8.02-9.17L1.5 2h7.06l4.88 6.45L18.24 2Zm-1.21 18h1.9L7.06 4h-1.9l11.87 16Z" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 22v-8.4h2.8l.42-3.26h-3.22V8.24c0-.94.26-1.58 1.6-1.58h1.72V3.72C16.5 3.66 15.42 3.6 14.17 3.6c-2.6 0-4.38 1.58-4.38 4.5v2.24H7v3.26h2.79V22h3.71Z" />
    </svg>
  );
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinejoin="round" {...props}>
      <path d="M22 12a24 24 0 0 0-.36-4.3 3 3 0 0 0-2.1-2.1C17.6 5 12 5 12 5s-5.6 0-7.54.6a3 3 0 0 0-2.1 2.1A24 24 0 0 0 2 12a24 24 0 0 0 .36 4.3 3 3 0 0 0 2.1 2.1C6.4 19 12 19 12 19s5.6 0 7.54-.6a3 3 0 0 0 2.1-2.1A24 24 0 0 0 22 12Z" />
      <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* --------------------------------- Content -------------------------------- */

const usefulLinks: { label: string; href: string; tab?: GadgetTabId }[] = [
  { label: "On Sale", href: "/#on-sale", tab: "sale" },
  { label: "Contact Us", href: "/contact" },
  { label: "Most Popular", href: "/#most-popular", tab: "popular" },
  { label: "New Arrival", href: "/#new-arrival", tab: "new" },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com/", Icon: InstagramIcon },
  { name: "X (Twitter)", href: "https://x.com/", Icon: TwitterXIcon },
  { name: "Facebook", href: "https://facebook.com/", Icon: FacebookIcon },
  { name: "YouTube", href: "https://youtube.com/", Icon: YoutubeIcon },
];

/* --------------------------------- Component -------------------------------- */

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const pathname = usePathname();

  // Hide store footer on admin routes for a clean full-screen dashboard experience
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>, link: (typeof usefulLinks)[number]) {
    // Only intercept gadget links, and only when we're already on the home page
    if (!link.tab || pathname !== "/") return;
    e.preventDefault();
    selectGadgetTab(link.tab);
    window.history.replaceState(null, "", link.href); // keep URL shareable
  }

  function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || status === "submitting") return;

    setStatus("submitting");
    // TODO: replace with your real subscribe endpoint / API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 600);
  }

  return (
    <footer className="relative bg-[#0B1220] text-[#C7CEDA]">
      {/* Circuit-trace accent line */}

      <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1fr_0.8fr_1fr_1.4fr] lg:gap-10">
          {/* Column 1 — Logo + description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex w-fit items-center gap-2.5">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20 shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 animate-spin-slow opacity-60" />
                <div className="relative w-full h-full rounded-[10px] bg-[#0c101d] flex items-center justify-center">
                  <motion.div whileHover={{ rotate: 90 }} transition={{ type: "spring", stiffness: 200 }}>
                    <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  </motion.div>
                </div>
              </div>
              <span className={`${sora.className} text-xl font-bold tracking-tight text-white`}>
                Nextronics
              </span>
            </Link>
            <p className={`${inter.className} max-w-xs text-sm leading-relaxed text-[#8B95A7]`}>
              Nextronics brings you the latest gadgets and electronics — from smartphones to
              smart homes — backed by fast shipping and genuine after-sales support.
            </p>
          </div>

          {/* Column 2 — Useful Links */}
          <div className="flex flex-col gap-4">
            <h3 className={`${sora.className} text-sm font-semibold text-white`}>Useful Links</h3>
            <ul className={`${inter.className} flex flex-col gap-3 text-sm`}>
              {usefulLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="text-[#8B95A7] transition-colors hover:text-sky-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact Us */}
          <div className="flex flex-col gap-4">
            <h3 className={`${sora.className} text-sm font-semibold text-white`}>Contact Us</h3>
            <ul className={`${inter.className} flex flex-col gap-3 text-sm`}>
              <li>
                <a
                  href="tel:01231312312"
                  className="flex items-start gap-3 text-[#8B95A7] transition-colors hover:text-sky-400"
                >
                  <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>01231312312</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@nextronics.com"
                  className="flex items-start gap-3 text-[#8B95A7] transition-colors hover:text-sky-400"
                >
                  <MailIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>support@nextronics.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Uttara, Dhaka, Bangladesh</span>
              </li>
            </ul>

            <div className="mt-1 flex items-center gap-2">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#8B95A7] transition-colors hover:border-sky-400/50 hover:text-sky-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 4 — Subscribe Us */}
          <div className="flex flex-col gap-4">
            <h3 className={`${sora.className} text-sm font-semibold text-white`}>Subscribe Us</h3>
            <p className={`${inter.className} text-sm leading-relaxed text-[#8B95A7]`}>
              Be the first to know about new arrivals, flash deals, and price drops on your
              favorite electronics.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inter.className} w-full min-w-0 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-[#8B95A7] outline-none transition-colors focus:border-sky-400/60`}
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className={`${inter.className} flex shrink-0 items-center justify-center gap-2 rounded-full bg-orange-400 px-5 py-2.5 text-sm font-medium text-[#1a1000] transition-colors hover:bg-orange-300 disabled:opacity-70`}
              >
                {status === "submitting" ? "Sending…" : "Subscribe"}
                <SendIcon className="h-4 w-4" />
              </button>
            </form>

            {status === "success" && (
              <p className={`${inter.className} text-xs text-emerald-400`}>
                You're subscribed — welcome to Nextronics!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-6 py-6 text-center text-xs text-[#8B95A7] sm:flex-row sm:justify-between sm:text-left">
          <p className={inter.className}>© {new Date().getFullYear()} Nextronics. All rights reserved.</p>
          <p className={inter.className}>Electronics, delivered right.</p>
        </div>
      </div>
    </footer>
  );
}