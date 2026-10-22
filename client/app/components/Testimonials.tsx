"use client";

/**
 * Testimonials section
 * -----------------------------------------------------------------------
 * Drop this component + Testimonials.module.css in the same folder, e.g.
 * components/Testimonials.tsx and components/Testimonials.module.css,
 * then:
 *
 *   import Testimonials from "@/components/Testimonials";
 *   export default function Home() {
 *     return (
 *       <main>
 *         <Testimonials />
 *       </main>
 *     );
 *   }
 *
 * This version uses a CSS Module instead of styled-jsx, so it works with
 * any Next.js compiler setup (SWC or Babel, Webpack or Turbopack) with no
 * extra plugin configuration required.
 *
 * Fonts: add Space Grotesk + Inter via next/font/google in your root
 * layout for best performance, or keep the fallback stack below as-is.
 * -----------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import styles from "./Testimonials.module.css";

import { getAuthCookie } from "@/admin/actions/auth";

interface Testimonial {
  patientName: string;
  profession: string;
  rating: number;
  comment: string;
}

interface AvatarTheme {
  from: string;
  to: string;
}


// A handful of accent pairings so avatars don't all look identical.
const AVATAR_THEMES: AvatarTheme[] = [
  { from: "#4CC9F0", to: "#3A86FF" },
  { from: "#FF9F5A", to: "#FF6B35" },
  { from: "#7BE0AD", to: "#2FBF71" },
  { from: "#C792FF", to: "#8A5CFF" },
  { from: "#4CC9F0", to: "#8A5CFF" },
];

function getInitials(patientName: string): string {
  return patientName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M12 2.5l2.9 6.4 7 .7-5.3 4.7 1.6 6.9L12 17.8l-6.2 3.4 1.6-6.9L2.1 9.6l7-.7L12 2.5z"
        fill={filled ? "var(--star-filled)" : "none"}
        stroke={filled ? "var(--star-filled)" : "var(--star-empty)"}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TestimonialCard({
  item,
  themeIndex,
}: {
  item: Testimonial;
  themeIndex: number;
}) {
  const theme = AVATAR_THEMES[themeIndex % AVATAR_THEMES.length];
  return (
    <article className={styles.card} aria-label={`Testimonial from ${item.patientName}`}>
      <span className={styles.quoteMark} aria-hidden="true">
        “
      </span>

      <header className={styles.profile}>
        <span
          className={styles.avatar}
          style={{
            background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
          }}
        >
          {getInitials(item.patientName)}
        </span>
        <span className={styles.identity}>
          <span className={styles.patientName}>{item.patientName}</span>
          <span className={styles.profession}>{item.profession}</span>
        </span>
      </header>

      <div
        className={styles.stars}
        role="img"
        aria-label={`${item.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} filled={i < item.rating} />
        ))}
      </div>

      <p className={styles.comment}>{item.comment}</p>
    </article>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  // useEffect(() => {
  //   const resolveCookie = async () => {
  //     try {
  //       const token = await getAuthCookie();
  //       setAccessToken(token || null);
  //     } catch (err) {
  //       console.error("Failed to load auth cookie:", err);
  //     }
  //   };
  //   resolveCookie();
  // }, []);
  // useEffect(() => {
  //   // Replace this URL with your actual Django API endpoint
  //   const fetchTestimonials = async () => {
  //     console.log(accessToken);
  //     if (!accessToken) return;
  //     try {
  //       const response = await fetch("http://127.0.0.1:8080/api/testimonials/", {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${accessToken}`, // Attaches the JWT token
  //         },
  //       });
  //       console.log(response);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch testimonials data");
  //       }
  //       const data = await response.json();
  //       setTestimonials(data);
  //     } catch (err: any) {
  //       setError(err.comment || "An error occurred");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTestimonials();
  // }, [accessToken]);
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const token = await getAuthCookie();
        setAccessToken(token || null);
        console.log(token)
        const response = await fetch("http://127.0.0.1:8080/api/testimonials/", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch testimonials data");
        }

        const data = await response.json();
        setTestimonials(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  // Handle loading and error states gracefully
  if (loading) return <div className={styles.statusMessage}>Loading testimonials...</div>;
  if (error) return <div className={styles.statusMessage}>Error: {error}</div>;
  if (testimonials.length === 0) return null;

  // Duplicate the list so the marquee track can loop seamlessly at -50%.
  const track = [...testimonials, ...testimonials];

  return (
    <section className={styles.testimonials} aria-labelledby="testimonials-heading">
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Testimonials
          </span>
          <h2 id="testimonials-heading" className={styles.heading}>
            What our sellers and shoppers say
          </h2>
          <p className={styles.subheading}>
            Real feedback from electronics stores running their catalog, orders,
            and vendors on our platform.
          </p>
        </div>
      </div>

      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          {track.map((item, i) => (
            <TestimonialCard
              key={`${item.patientName}-${i}`}
              item={item}
              themeIndex={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}