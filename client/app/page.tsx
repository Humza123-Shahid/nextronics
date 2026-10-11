"use client";

import { useState } from "react";
import Link from "next/link";
import LimitedStockBanner from "./components/LimitedStockBanner";
import MainHeroSection from "./components/MainHeroSection";
import ShopByCategory from "./components/ShopByCategory";
import GadgetsSection from "./components/GadgetsSection";
import Header from "./components/Header";
import {
  Flame,
  Star,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Laptop,
  Smartphone,
  Gamepad2,
  Watch,
  Camera,
  CheckCircle2,
  ArrowRight,
  Zap,
  Tag,
  ChevronRight,
  Clock,
  SlidersHorizontal,
} from "lucide-react";
import BestSellingProducts from "./components/BestSellingProducts";
import ScrollFeatureSection from "./components/ScrollFeatureSection";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviewsCount: number;
  stockStatus: string;
  specs: string[];
  isHot?: boolean;
  isNew?: boolean;
  claimedPercent?: number;
}

const DEALS_PRODUCTS: Product[] = [
  {
    id: "laptop-rog-16",
    name: "UltraBook Pro 16\" OLED (Intel Core Ultra 9, RTX 5080, 32GB RAM)",
    category: "Computer & Laptop",
    brand: "Nextronics ROG",
    price: 1899,
    originalPrice: 2299,
    discount: "-17%",
    rating: 4.9,
    reviewsCount: 124,
    stockStatus: "Only 3 left in stock",
    specs: ["16\" 2.5K 240Hz OLED", "RTX 5080 16GB VRAM", "32GB DDR5 / 2TB Gen5 SSD", "Aerospace Titanium Chassis"],
    isHot: true,
    claimedPercent: 88,
  },
  {
    id: "audio-apex-anc",
    name: "Apex 9 Planar Magnetic Active Noise Cancelling Wireless Headphones",
    category: "Audio",
    brand: "Nextronics Sound",
    price: 299,
    originalPrice: 399,
    discount: "-25%",
    rating: 5.0,
    reviewsCount: 312,
    stockStatus: "In Stock - Ships Today",
    specs: ["0.02ms Wireless Latency", "50mm Graphene Planar Drivers", "72h Battery Horizon", "Lossless 384kHz/32-bit"],
    isHot: true,
    claimedPercent: 76,
  },
  {
    id: "phone-ultra-5g",
    name: "Omni 6 Pro 5G Smartphone (512GB Titanium Gray, 1-inch Camera)",
    category: "Smartphone",
    brand: "Nextronics Mobile",
    price: 899,
    originalPrice: 1049,
    discount: "-14%",
    rating: 4.8,
    reviewsCount: 198,
    stockStatus: "In Stock",
    specs: ["Snapdragon 8 Gen 4", "6.8\" 120Hz LTPO AMOLED", "1-inch 50MP Sony Sensor", "100W HyperCharge"],
    isHot: false,
    claimedPercent: 64,
  },
  {
    id: "watch-titan-gps",
    name: "ApexWatch Ultra Rugged GPS Smartwatch (Titanium Case, Sapphire)",
    category: "Watches",
    brand: "Nextronics Wear",
    price: 349,
    originalPrice: 429,
    discount: "-19%",
    rating: 4.9,
    reviewsCount: 88,
    stockStatus: "In Stock",
    specs: ["Dual-Frequency L1/L5 GPS", "100m Water Resistant", "Continuous ECG & SpO2", "14-Day Battery Horizon"],
    isHot: true,
    claimedPercent: 92,
  },
];

const POPULAR_PRODUCTS: Product[] = [
  {
    id: "pulse-pod-neo",
    name: "PulsePod Neo Bone-Conduction ANC True Wireless Earbuds",
    category: "Audio",
    brand: "Nextronics Sound",
    price: 159,
    originalPrice: 199,
    discount: "-20%",
    rating: 4.7,
    reviewsCount: 412,
    stockStatus: "In Stock",
    specs: ["Bone Conduction Voice Array", "IP68 Waterproof", "Qi2 Induction Charging", "40h Total Playtime"],
    isHot: true,
  },
  {
    id: "camera-cinema-4k",
    name: "Lumix Alpha 4K 120fps Full-Frame Mirrorless Camera Body",
    category: "Cameras",
    brand: "Nextronics Vision",
    price: 1499,
    originalPrice: 1699,
    discount: "-12%",
    rating: 4.9,
    reviewsCount: 64,
    stockStatus: "In Stock",
    specs: ["33MP BSI CMOS Sensor", "4K 120p 10-bit 4:2:2", "5-Axis In-Body Stabilization", "Dual CFexpress Slots"],
    isNew: true,
  },
  {
    id: "gaming-console-deck",
    name: "Vortex Deck Pro Handheld Gaming PC (Ryzen Z2 Extreme, 144Hz OLED)",
    category: "Video Games",
    brand: "Vortex Gear",
    price: 649,
    originalPrice: 729,
    discount: "-11%",
    rating: 4.8,
    reviewsCount: 165,
    stockStatus: "In Stock",
    specs: ["AMD Ryzen Z2 Extreme", "8\" 144Hz VRR OLED", "32GB LPDDR5X", "Hall Effect Joysticks"],
    isHot: true,
  },
  {
    id: "monitor-qd-34",
    name: "AeroView 34\" Ultrawide QD-OLED Curved Gaming Monitor",
    category: "Computer & Laptop",
    brand: "Nextronics Vision",
    price: 799,
    originalPrice: 999,
    discount: "-20%",
    rating: 4.8,
    reviewsCount: 94,
    stockStatus: "Limited Stock",
    specs: ["0.03ms Response Time", "175Hz Refresh Rate", "True Black 400 HDR", "USB-C 90W PD Hub"],
    isNew: true,
  },
  {
    id: "speaker-dolby-bar",
    name: "AeroSound 7.1.4 Dolby Atmos Wireless Soundbar with Subwoofer",
    category: "Audio",
    brand: "Nextronics Sound",
    price: 499,
    originalPrice: 629,
    discount: "-21%",
    rating: 4.9,
    reviewsCount: 156,
    stockStatus: "In Stock",
    specs: ["780W Peak Output", "Up-firing Spatial Drivers", "Wireless 10\" Subwoofer", "HDMI eARC 2.1"],
  },
  {
    id: "gan-charger-180w",
    name: "AeroDock 180W Multiport GaN Charger with OLED Telemetry",
    category: "Accessories",
    brand: "Nextronics Power",
    price: 89,
    originalPrice: 119,
    discount: "-25%",
    rating: 4.9,
    reviewsCount: 304,
    stockStatus: "In Stock",
    specs: ["180W Total Output", "Real-Time OLED Wattage", "3x USB-C + 1x USB-A", "GaNFast Technology"],
  },
];

const CATEGORY_BROWSE = [
  { name: "Computer & Laptop", icon: Laptop, count: "1,240+ Products", href: "#computer-laptop" },
  { name: "Audio & Headphones", icon: Headphones, count: "890+ Products", href: "#audio" },
  { name: "Smartphone", icon: Smartphone, count: "650+ Products", href: "#smartphone" },
  { name: "Watches", icon: Watch, count: "310+ Products", href: "#watches" },
  { name: "Cameras", icon: Camera, count: "420+ Products", href: "#cameras" },
  { name: "Video Games", icon: Gamepad2, count: "1,100+ Products", href: "#video-games" },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [cartCount, setCartCount] = useState(3);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (productName: string) => {
    setCartCount((prev) => prev + 1);
    showToast(`Added "${productName}" to your cart!`);
  };

  const handleToggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
      showToast("Removed from your wishlist.");
    } else {
      setWishlist([...wishlist, productId]);
      showToast("Added to your wishlist!");
    }
  };

  const filteredPopular =
    activeTab === "All"
      ? POPULAR_PRODUCTS
      : POPULAR_PRODUCTS.filter((p) => p.category === activeTab);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-blue-600 selection:text-white">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-blue-500/30 bg-[#0c101d]/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-200">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-slate-200">{toastMessage}</span>
          </div>
        )}

        {/* 1. FIRST HERO SECTION: LIMITED STOCK BANNER (HEADING ON LEFT, PRODUCT IMAGE ON RIGHT) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 sm:pb-24">
          <LimitedStockBanner
            onClaimDeal={() => {
              showToast("Limited Stock Special Deal has been applied!");
            }}
          />

          {/* 2. SECOND HERO SECTION: WITH SPACING ABOVE, DUAL VERTICAL SECTIONS (SLIDER + 4-PRODUCT CAROUSEL) */}
          <MainHeroSection onAddToCart={handleAddToCart} />

          {/* 3. SHOP BY CATEGORY SECTION */}
          <ShopByCategory />
          <GadgetsSection />
          <BestSellingProducts />
          <ScrollFeatureSection />
          <Testimonials />

        </section>

      </div>
    </>
  );
}
