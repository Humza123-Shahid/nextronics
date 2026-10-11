"use client";

import { useMemo, useState, type SVGProps } from "react";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./BestSellingProducts.module.css";
import { bestSellingTabs as defaultTabs, type BestSellingTab, type Product } from "./data";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--bsp-font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--bsp-font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--bsp-font-mono",
});

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <path
        d="M2.5 3h2l2.2 11.2a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.6L21 7H6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path
        d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CompareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M7 3v14" strokeLinecap="round" />
      <path d="M3 6.5 7 3l4 3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 21V7" strokeLinecap="round" />
      <path d="M21 17.5 17 21l-4-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface HeartIconProps extends SVGProps<SVGSVGElement> {
  filled?: boolean;
}

function HeartIcon({ filled, ...props }: HeartIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path
        d="M12 20.5s-8-4.86-8-11.02A4.98 4.98 0 0 1 9 4.5c1.54 0 2.94.83 3.5 2.09A4 4 0 0 1 15 4.5a4.98 4.98 0 0 1 5 4.98c0 6.16-8 11.02-8 11.02Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5l2.86 6.2 6.64.66-5.02 4.6 1.44 6.54L12 17.4l-5.92 3.1 1.44-6.54-5.02-4.6 6.64-.66L12 2.5Z" />
    </svg>
  );
}

function Stars({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <span className={styles.stars} aria-hidden="true">
      <span className={styles.starsBase}>
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </span>
      <span className={styles.starsFill} style={{ width: `${clamped}%` }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </span>
    </span>
  );
}

/* Stagger Animation Variants */
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  }),
};

interface ProductCardProps {
  product: Product;
  index: number;
  isWishlisted: boolean;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onCompare: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

function ProductCard({
  product,
  index,
  isWishlisted,
  onAddToCart,
  onQuickView,
  onCompare,
  onToggleWishlist,
}: ProductCardProps) {
  return (
    <motion.article
      className={styles.card}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={cardVariants}
    >
      <div className={styles.media}>
        <img
          src={product.image}
          alt={product.name}
          sizes="(max-width: 575px) 90vw, (max-width: 991px) 45vw, (max-width: 1199px) 30vw, 22vw"
          style={{ objectFit: "cover" }}
        />

        {product.discountPercent > 0 && (
          <span className={styles.discountBadge}>-{product.discountPercent}%</span>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.addBar} onClick={() => onAddToCart(product)}>
            <CartIcon />
            Add to Cart
          </button>

          <div className={styles.iconRow}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => onAddToCart(product)}
              aria-label={`Add ${product.name} to cart`}
              title="Add to Cart"
            >
              <CartIcon />
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => onQuickView(product)}
              aria-label={`Quick view ${product.name}`}
              title="Quick View"
            >
              <EyeIcon />
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => onCompare(product)}
              aria-label={`Compare ${product.name}`}
              title="Compare"
            >
              <CompareIcon />
            </button>
            <button
              type="button"
              className={`${styles.iconBtn} ${isWishlisted ? styles.wishActive : ""}`}
              onClick={() => onToggleWishlist(product)}
              aria-label={`${isWishlisted ? "Remove" : "Add"} ${product.name} ${isWishlisted ? "from" : "to"
                } wishlist`}
              aria-pressed={isWishlisted}
              title="Add to Wishlist"
            >
              <HeartIcon filled={isWishlisted} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.details}>
        <h3 className={styles.title}>
          <a href={product.href}>{product.name}</a>
        </h3>

        <div className={styles.rating}>
          <Stars percent={product.ratingPercent} />
          <span className={styles.ratingCount}>({product.ratingCount})</span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>{currency.format(product.price)}</span>
          {product.oldPrice ? (
            <span className={styles.oldPrice}>{currency.format(product.oldPrice)}</span>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export interface BestSellingProductsProps {
  tabs?: BestSellingTab[];
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onCompare?: (product: Product) => void;
}

export default function BestSellingProducts({
  tabs = defaultTabs,
  onAddToCart = (product) => console.log("Add to cart", product.id),
  onQuickView = (product) => console.log("Quick view", product.id),
  onCompare = (product) => console.log("Compare", product.id),
}: BestSellingProductsProps) {
  const [activeTabId, setActiveTabId] = useState<string | undefined>(tabs[0]?.id);
  const [wishlist, setWishlist] = useState<Set<number>>(() => new Set());

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId]
  );

  function toggleWishlist(product: Product) {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
  }

  return (
    <section
      className={`${styles.section} ${display.variable} ${body.variable} ${mono.variable}`}
    >
      <div className={styles.inner}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Best Selling Products
        </motion.h2>

        <div role="tablist" aria-label="Sort best selling products" className={styles.tabList}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab?.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`bsp-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`bsp-panel-${tab.id}`}
                className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                onClick={() => setActiveTabId(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            role="tabpanel"
            id={`bsp-panel-${activeTab?.id}`}
            aria-labelledby={`bsp-tab-${activeTab?.id}`}
            className={styles.grid}
            key={activeTab?.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab?.products.map((product, index) => (
              <ProductCard
                key={`${product.id}-${index}`}
                product={product}
                index={index}
                isWishlisted={wishlist.has(product.id)}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                onCompare={onCompare}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}