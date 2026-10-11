// Product data for the Best Selling Products section.
//
// `image` currently points at picsum.photos placeholders (seeded per
// product so they stay stable across reloads) — swap these for your own
// product photography/CDN, and update `remotePatterns` in next.config.js
// to match. Everything else (name, price, rating, discount) is yours to
// wire up to your API/CMS; the component only cares about the shape below.

export interface Product {
  id: number;
  slug: string;
  name: string;
  image: string;
  href: string;
  price: number;
  oldPrice: number | null;
  discountPercent: number;
  ratingPercent: number;
  ratingCount: number;
}

export interface BestSellingTab {
  id: string;
  label: string;
  products: Product[];
}

interface ProductInput {
  id: number;
  slug: string;
  image: string;
  name: string;
  price: number;
  oldPrice?: number;
  ratingPercent: number;
  ratingCount: number;
}

function product({ id, slug, image, name, price, oldPrice, ratingPercent, ratingCount }: ProductInput): Product {
  const discountPercent =
    oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return {
    id,
    slug,
    name,
    image,
    href: `/product/${slug}`,
    price,
    oldPrice: oldPrice ?? null,
    discountPercent,
    ratingPercent,
    ratingCount,
  };
}

// Individual products, keyed so tabs below can reference the same item
// without duplicating data (a product can reasonably be both "Popular"
// and "Newly Added", for example).
const P = {
  ancHeadphones: product({
    id: 101,
    slug: "wireless-noise-cancelling-headphones",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiOughFI_CAPZJs98sBudmCqXQoYjBNgTrX-U9pOTetw&s=10",
    name: "Wireless Noise-Cancelling Headphones",
    price: 179.99,
    oldPrice: 249.99,
    ratingPercent: 90,
    ratingCount: 34,
  }),
  fitnessWatch: product({
    id: 102,
    slug: "smart-fitness-watch",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgp5CycrMMXQ86qYTHyWwoxwbFZzMPC8dKJmBfRPkqgQ&s=10",
    name: "Smart Fitness Watch",
    price: 99.99,
    oldPrice: 149.99,
    ratingPercent: 80,
    ratingCount: 21,
  }),
  actionCamera: product({
    id: 103,
    slug: "4k-ultra-hd-action-camera",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK1VItxFj1GUhr0HdCTBGJFaABOYcfp30-zXQ_xZnpiA&s=10",
    name: "4K Ultra HD Action Camera",
    price: 219.0,
    oldPrice: 279.0,
    ratingPercent: 90,
    ratingCount: 12,
  }),
  btSpeaker: product({
    id: 104,
    slug: "portable-bluetooth-speaker",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnR0yyB9q68hOl7fQ-CcMXYd478Ug1o2uH7qjUfNw_aA&s=10",
    name: "Portable Bluetooth Speaker",
    price: 59.99,
    oldPrice: 89.99,
    ratingPercent: 80,
    ratingCount: 47,
  }),
  mechKeyboard: product({
    id: 105,
    slug: "mechanical-gaming-keyboard",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1Mp4Jm9IV8HelwvOo2mSXZsR_Lw7y-kevTQOigeGryQ&s=10",
    name: "Mechanical Gaming Keyboard",
    price: 89.99,
    oldPrice: 119.99,
    ratingPercent: 90,
    ratingCount: 28,
  }),
  gamingMouse: product({
    id: 106,
    slug: "wireless-gaming-mouse",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDnvrmqUwdS3s3O0NVqg0ODSEOXpT2clVgJjyfSVLCiQ&s=10",
    name: "Wireless Gaming Mouse",
    price: 49.99,
    oldPrice: 69.99,
    ratingPercent: 80,
    ratingCount: 19,
  }),
  monitor4k: product({
    id: 107,
    slug: "27-inch-4k-monitor",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbSE7B_YMs9GNztqOT_H90nKO2eK1H4dTa_x7MBM-WZA&s",
    name: '27" 4K UHD Monitor',
    price: 329.99,
    oldPrice: 399.99,
    ratingPercent: 90,
    ratingCount: 15,
  }),
  earbuds: product({
    id: 108,
    slug: "true-wireless-earbuds",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKyyLzNo0Vhus-_VnlLG40kd3Tt9SYPU_TauqEEk82JQ&s",
    name: "True Wireless Earbuds",
    price: 69.99,
    oldPrice: 99.99,
    ratingPercent: 90,
    ratingCount: 52,
  }),
  drone: product({
    id: 109,
    slug: "foldable-drone-with-4k-camera",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHqKvqY0mz8WztRgWQJMt9PlyMKNQV-i4_4xOmTlmgag&s=10",
    name: "Foldable Drone with 4K Camera",
    price: 349.99,
    oldPrice: 429.99,
    ratingPercent: 80,
    ratingCount: 9,
  }),
  smartHomeHub: product({
    id: 110,
    slug: "smart-home-hub",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbSq7VSGAG-WUm1hv9CAApuwAAGEKCi4ORMzhFTz3i2Q&s=10",
    name: "Smart Home Hub",
    price: 79.99,
    oldPrice: 99.99,
    ratingPercent: 70,
    ratingCount: 6,
  }),
  powerBank20k: product({
    id: 111,
    slug: "portable-power-bank-20000mah",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo25bvMOHw2auDryJVkz4mDK0hyUE5Ps2ndlcdd-fcJg&s=10",
    name: "Portable Power Bank 20,000mAh",
    price: 39.99,
    oldPrice: 54.99,
    ratingPercent: 90,
    ratingCount: 41,
  }),
  dockingStation: product({
    id: 112,
    slug: "usb-c-docking-station",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEfr2mn_TjhkJXXF6tZTrKNRmsVICZM7N_xjsAuCJdow&s=10",
    name: "USB-C Docking Station",
    price: 54.99,
    oldPrice: 74.99,
    ratingPercent: 80,
    ratingCount: 11,
  }),
  ledDeskLamp: product({
    id: 113,
    slug: "smart-led-desk-lamp",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK2EDUhhlZyaTyrVwJW2pJ4sw8Pr2V68tJFlnjUVkERA&s=10",
    name: "Smart LED Desk Lamp",
    price: 34.99,
    oldPrice: 44.99,
    ratingPercent: 70,
    ratingCount: 8,
  }),
  gamingLaptop: product({
    id: 114,
    slug: "gaming-laptop-15-6-inch",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALYqYFBzvCRXSPDgRCQfigxXbJqQeML2LlpVRF1uakQ&s=10",
    name: 'Gaming Laptop 15.6"',
    price: 899.99,
    oldPrice: 1099.99,
    ratingPercent: 90,
    ratingCount: 17,
  }),
  wiredEarphones: product({
    id: 115,
    slug: "wired-earphones-with-mic",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpcwwKNOBCZFb6Bq1CArkDF77xzEFPlL0thdLKwHV7ZQ&s=10",
    name: "Wired Earphones with Mic",
    price: 12.99,
    oldPrice: 19.99,
    ratingPercent: 70,
    ratingCount: 23,
  }),
  ringLight: product({
    id: 116,
    slug: "bluetooth-selfie-ring-light",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8H-wkjRSY8mNQ9vU0yiKHMF-K3B1ILIhxFlvd4bX-Jw&s=10",
    name: "Bluetooth Selfie Ring Light",
    price: 18.99,
    oldPrice: 27.99,
    ratingPercent: 60,
    ratingCount: 14,
  }),
  powerBank10k: product({
    id: 117,
    slug: "portable-power-bank-10000mah",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq7UT8yeZ-V_u29mQII6pdK7DmUFM1YFj7nw7v4xuNrw&s=10",
    name: "Portable Power Bank 10,000mAh",
    price: 22.99,
    oldPrice: 29.99,
    ratingPercent: 80,
    ratingCount: 30,
  }),
  phoneTripod: product({
    id: 118,
    slug: "phone-tripod-stand",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdALjU0WjK_AnNueSk37ZJ1YlLtfSbR93YVufBlJ0UMg&s=10",
    name: "Phone Tripod Stand",
    price: 15.99,
    oldPrice: 24.99,
    ratingPercent: 70,
    ratingCount: 18,
  }),
  miniSpeaker: product({
    id: 119,
    slug: "mini-bluetooth-speaker",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYUYPkvzIxjyDmECnc3G7-SORdiKxWGlboOCxnCwFIFg&s=10",
    name: "Mini Bluetooth Speaker",
    price: 19.99,
    oldPrice: 29.99,
    ratingPercent: 80,
    ratingCount: 25,
  }),
};

export const bestSellingTabs: BestSellingTab[] = [
  {
    id: "popular",
    label: "Popular",
    products: [
      P.ancHeadphones,
      P.fitnessWatch,
      P.actionCamera,
      P.btSpeaker,
      P.mechKeyboard,
      P.gamingMouse,
      P.monitor4k,
      P.earbuds,
    ],
  },
  {
    id: "newly-added",
    label: "Newly Added",
    products: [
      P.drone,
      P.smartHomeHub,
      P.ancHeadphones,
      P.powerBank20k,
      P.dockingStation,
      P.ledDeskLamp,
      P.gamingLaptop,
      P.earbuds,
    ],
  },
  {
    id: "low-price",
    label: "Low Price",
    products: [
      P.dockingStation,
      P.wiredEarphones,
      P.ringLight,
      P.powerBank10k,
      P.mechKeyboard,
      P.phoneTripod,
      P.gamingMouse,
      P.miniSpeaker,
    ],
  },
];
