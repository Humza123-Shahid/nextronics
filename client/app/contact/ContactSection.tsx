"use client";

import { FormEvent, useState } from "react";
import styles from "./ContactSection.module.css";

// Change these to your real details
const PHONE = "01231312312";
const EMAIL = "support@nextronics.com";
const ADDRESS = "Uttara, Dhaka, Bangladesh";
const API_ENDPOINT = "/api/contact"; // your route handler or backend URL

type Status = "idle" | "sending" | "success" | "error";

export default function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className={styles.contact} id="contact">
      <div className={styles.inner}>
        {/* Row 1: three info cards */}
        <div className={styles.cards}>
          <a className={styles.card} href={`tel:${PHONE}`}>
            <span className={styles.icon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
              </svg>
            </span>
            <p className={styles.cardText}>{PHONE}</p>
          </a>

          <a className={styles.card} href={`mailto:${EMAIL}`}>
            <span className={styles.icon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </span>
            <p className={styles.cardText}>{EMAIL}</p>
          </a>

          <div className={styles.card}>
            <span className={styles.icon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <p className={styles.cardText}>{ADDRESS}</p>
          </div>
        </div>

        {/* Row 2: form (left) + map (right) */}
        <div className={styles.main}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Enter your name" aria-label="Your name" required />
            <input type="email" name="email" placeholder="Enter your email" aria-label="Your email" required />
            <input type="text" name="subject" placeholder="Enter Subject" aria-label="Subject" required />
            <textarea name="message" placeholder="Enter your message" aria-label="Your message" required />
            <button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <p className={`${styles.status} ${styles.success}`} role="status">
                Message sent. We will get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className={`${styles.status} ${styles.error}`} role="alert">
                Message could not be sent. Please try again.
              </p>
            )}
          </form>

          <div className={styles.map}>
            <iframe
              title="Nextronics location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&z=14&output=embed`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
