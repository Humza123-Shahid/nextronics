"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ScrollFeatureSection
 * A scroll-linked "features" section for an electronics e-commerce storefront.
 * Left: a vertical sequence of feature boxes with a connecting line and an
 *       active dot that travels down as the user scrolls.
 * Right: a sticky device frame whose image swaps to match the active box.
 *
 * Drop this component into any page, e.g.:
 *   import ScrollFeatureSection from "@/components/ScrollFeatureSection";
 *   <ScrollFeatureSection />
 *
 * Swap the `steps` array below with your own copy/images — nothing else
 * needs to change.
 */

interface Step {
  number: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Every Category, One Storefront",
    description:
      "Browse phones, laptops, audio, wearables and smart-home gear from every seller without leaving the app. One cart, one checkout, one delivery tracker.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
    alt: "Laptop and accessories laid out on a desk",
  },
  {
    number: "02",
    title: "Live Stock & Price Alerts",
    description:
      "Get notified the moment a watched product drops in price or comes back in stock, so you never miss a restock window on limited electronics.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
    alt: "Smartphone displaying a shopping app",
  },
  {
    number: "03",
    title: "Spec-Based Comparison",
    description:
      "Line up processors, battery life, camera specs and display quality side by side, so decisions come from data, not guesswork.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    alt: "Headphones and a device on a table",
  },
  {
    number: "04",
    title: "Secure One-Tap Checkout",
    description:
      "Saved cards, UPI and wallet balance sit behind biometric confirmation, turning a full checkout into a single tap.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    alt: "Smartwatch on a wrist",
  },
  {
    number: "05",
    title: "Verified Buyer Reviews",
    description:
      "Every review is tied to a confirmed purchase, with photos and teardown notes from real owners of the exact model you're viewing.",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80",
    alt: "Camera resting on a surface",
  },
  {
    number: "06",
    title: "Extended Protection Plans",
    description:
      "Add accidental-damage and extended-warranty cover at checkout, with claims filed and tracked from the same order page.",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80",
    alt: "Bluetooth speaker on a shelf",
  },
  {
    number: "07",
    title: "Trade-In on Old Devices",
    description:
      "Value an old device in seconds and apply the credit straight to a new order — no separate listing, no waiting on a buyer.",
    image:
      "https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=1000&q=80",
    alt: "Game controller close up",
  },
];

export default function ScrollFeatureSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Fraction of the viewport height used as the "activation line". A box
    // becomes active once its top has scrolled up past this line. Tune this
    // single number to make boxes switch earlier (smaller) or later (bigger).
    const TRIGGER_LINE = 0.35;

    let ticking = false;

    const computeActive = () => {
      ticking = false;
      const triggerY = window.innerHeight * TRIGGER_LINE;

      let nextIndex = 0;
      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        // Keep advancing while this box's top has already crossed the line;
        // the last one that has is the currently active box.
        if (top <= triggerY) {
          nextIndex = i;
        } else {
          break;
        }
      }

      setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(computeActive);
      }
    };

    computeActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const progressPercent =
    steps.length > 1 ? (activeIndex / (steps.length - 1)) * 100 : 0;

  return (
    <section className="sfs-section">
      <div className="sfs-inner">
        <div className="sfs-heading">
          <span className="sfs-eyebrow">How Nextronics Works</span>
          <h2>Shopping for electronics, tuned to how you actually decide</h2>
        </div>

        <div className="sfs-grid">
          <div className="sfs-list">
            <div className="sfs-track" aria-hidden="true">
              <div
                className="sfs-track-fill"
                style={{ height: `${progressPercent}%` }}
              />
            </div>

            {steps.map((step, index) => (
              <div
                key={step.number}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                data-index={index}
                className={`sfs-item ${index === activeIndex ? "is-active" : ""
                  }`}
              >
                <div className="sfs-dot-col">
                  <span className="sfs-dot" />
                </div>
                <div className="sfs-item-body">
                  <span className="sfs-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="sfs-visual">
            <div className="sfs-frame">
              <div className="sfs-frame-glow" />
              <div className="sfs-frame-notch" />
              {steps.map((step, index) => (
                <img
                  key={step.number}
                  src={step.image}
                  alt={step.alt}
                  className={`sfs-frame-img ${index === activeIndex ? "is-active" : ""
                    }`}
                />
              ))}
              <div className="sfs-frame-caption">
                <span className="sfs-number">{steps[activeIndex].number}</span>
                <span>{steps[activeIndex].title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap");

        .sfs-section {
          --sfs-bg: #0a0e14;
          --sfs-surface: #121826;
          --sfs-surface-2: #1a2233;
          --sfs-border: #232c3f;
          --sfs-text: #edf0f5;
          --sfs-text-muted: #8a93a8;
          --sfs-accent: #4e7fff;
          --sfs-accent-soft: rgba(78, 127, 255, 0.16);

          background: var(--sfs-bg);
          color: var(--sfs-text);
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 6rem 1.5rem;
        }

        .sfs-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .sfs-heading {
          max-width: 640px;
          margin-bottom: 4rem;
        }

        .sfs-eyebrow {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--sfs-accent);
          letter-spacing: 0.02em;
          margin-bottom: 0.9rem;
        }

        .sfs-heading h2 {
          font-family: "Space Grotesk", "Inter", sans-serif;
          font-size: clamp(1.7rem, 3.2vw, 2.5rem);
          line-height: 1.25;
          font-weight: 600;
          margin: 0;
          color: #ffffff;
        }

        .sfs-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 3.5rem;
          align-items: start;
        }

        /* ---- Left: feature list with connecting line ---- */
        .sfs-list {
          position: relative;
          padding-left: 2.25rem;
        }

        .sfs-track {
          position: absolute;
          left: 5px;
          top: 6px;
          bottom: 6px;
          width: 2px;
          background: var(--sfs-border);
          border-radius: 2px;
        }

        .sfs-track-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(180deg, var(--sfs-accent), #7aa2ff);
          border-radius: 2px;
          transition: height 0.35s ease;
        }

        .sfs-item {
          position: relative;
          display: flex;
          gap: 1.25rem;
          padding: 1.75rem 0;
          border-bottom: 1px solid var(--sfs-border);
          opacity: 0.45;
          transition: opacity 0.35s ease;
        }

        .sfs-item:last-child {
          border-bottom: none;
        }

        .sfs-item.is-active {
          opacity: 1;
        }

        .sfs-dot-col {
          position: absolute;
          left: -2.25rem;
          top: 1.95rem;
          width: 12px;
          display: flex;
          justify-content: center;
        }

        .sfs-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--sfs-surface-2);
          border: 2px solid var(--sfs-border);
          transition: all 0.3s ease;
        }

        .sfs-item.is-active .sfs-dot {
          background: var(--sfs-accent);
          border-color: var(--sfs-accent);
          box-shadow: 0 0 0 5px var(--sfs-accent-soft);
        }

        .sfs-number {
          font-family: "Space Grotesk", sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--sfs-text-muted);
          display: block;
          margin-bottom: 0.4rem;
          letter-spacing: 0.03em;
        }

        .sfs-item.is-active .sfs-number {
          color: var(--sfs-accent);
        }

        .sfs-item-body h3 {
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0 0 0.55rem 0;
          color: #ffffff;
        }

        .sfs-item-body p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--sfs-text-muted);
          max-width: 46ch;
        }

        /* ---- Right: sticky device frame ---- */
        .sfs-visual {
          position: sticky;
          top: 6.5rem;
          align-self: start;
        }

        .sfs-frame {
          position: relative;
          border-radius: 22px;
          border: 1px solid var(--sfs-border);
          background: var(--sfs-surface);
          padding: 0.75rem;
          aspect-ratio: 4 / 5;
          overflow: hidden;
        }

        .sfs-frame-glow {
          position: absolute;
          inset: -30%;
          background: radial-gradient(
            circle at 30% 20%,
            var(--sfs-accent-soft),
            transparent 60%
          );
          pointer-events: none;
        }

        .sfs-frame-notch {
          position: absolute;
          top: 0.9rem;
          left: 50%;
          transform: translateX(-50%);
          width: 70px;
          height: 6px;
          background: var(--sfs-surface-2);
          border-radius: 4px;
          z-index: 3;
        }

        .sfs-frame-img {
          position: absolute;
          inset: 0.75rem;
          width: calc(100% - 1.5rem);
          height: calc(100% - 1.5rem);
          object-fit: cover;
          border-radius: 16px;
          opacity: 0;
          transform: scale(1.02);
          transition: opacity 0.5s ease, transform 0.6s ease;
        }

        .sfs-frame-img.is-active {
          opacity: 1;
          transform: scale(1);
          position: relative;
        }

        .sfs-frame-caption {
          position: absolute;
          left: 1.5rem;
          right: 1.5rem;
          bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.65rem 1rem;
          background: rgba(10, 14, 20, 0.72);
          backdrop-filter: blur(6px);
          border: 1px solid var(--sfs-border);
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #fff;
          z-index: 3;
        }

        .sfs-frame-caption .sfs-number {
          margin: 0;
          color: var(--sfs-accent);
        }

        /* ---- Responsive ---- */
        @media (max-width: 1024px) {
          .sfs-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .sfs-visual {
            position: static;
            order: -1;
          }

          .sfs-frame {
            aspect-ratio: 16 / 10;
            max-width: 560px;
            margin: 0 auto;
          }
        }

        @media (max-width: 640px) {
          .sfs-section {
            padding: 3.5rem 1.25rem;
          }

          .sfs-heading {
            margin-bottom: 2.5rem;
          }

          .sfs-list {
            padding-left: 1.75rem;
          }

          .sfs-dot-col {
            left: -1.75rem;
          }

          .sfs-item {
            gap: 1rem;
            padding: 1.35rem 0;
          }

          .sfs-item-body h3 {
            font-size: 1.05rem;
          }

          .sfs-frame {
            aspect-ratio: 4 / 3;
            border-radius: 16px;
          }

          .sfs-frame-caption {
            left: 1rem;
            right: 1rem;
            bottom: 1rem;
            font-size: 0.78rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sfs-track-fill,
          .sfs-item,
          .sfs-dot,
          .sfs-frame-img {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}