"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import { fadeUp, staggerContainer } from "@/lib/animations";
import HeroSketches from "@/components/HeroSketches";
import { listings } from "@/data/listings";

// ─── Shared listing card image with graceful fallback ─────────────────────────

function ListingImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div
        style={{
          height: "220px",
          background: "linear-gradient(160deg, rgba(200,184,154,0.18) 0%, rgba(200,184,154,0.07) 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "rgba(200,184,154,0.55)" }}>
          <path d="M2 20l6-8 4 5 3-3 5 6H2z" />
          <circle cx="18" cy="6" r="2" />
        </svg>
        <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", opacity: 0.7 }}>
          Photo coming soon
        </span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      style={{ width: "100%", height: "220px", objectFit: "cover", display: "block", flexShrink: 0 }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  return (
    <>
      {/* ── Hero — frosted glass matching other hero sections ── */}
      <section
        className="hero-section"
        style={{ position: "relative", paddingTop: "96px", paddingBottom: "64px" }}
      >
        <HeroSketches page="ventures" />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "880px",
            margin: "0 auto",
            padding: "0 32px",
            width: "100%",
          }}
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            style={{
              background: "rgba(245, 242, 236, 0.82)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: "var(--radius-md)",
              padding: "40px 48px",
              border: "1px solid rgba(255, 255, 255, 0.68)",
            }}
          >
            {/* Eyebrow */}
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "var(--text-muted)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Packisher · Ventures
            </motion.p>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(36px, 6vw, 64px)",
                color: "var(--text-primary)",
                marginBottom: "20px",
                lineHeight: 1.05,
              }}
            >
              Land for Sale in Kenya.
            </motion.h1>

            {/* Description */}
            <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px", maxWidth: "680px" }}>
              <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", lineHeight: 1.75 }}>
                Every listing is reviewed and verified by our team on the ground in Kenya before it is posted. Title deeds are checked, road access is confirmed, and we know each plot personally.
              </p>
              <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", fontStyle: "italic" }}>
                Prices listed in KES. We facilitate international transfers from Canada, the UK, and the US.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <Button href="/contact" variant="outline" size="sm">
                List with us
              </Button>
              <Button href="/contact" variant="primary" size="sm">
                Speak to our team
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Listings grid ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 100px" }}>

        {/* Count */}
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", marginBottom: "28px", letterSpacing: "0.04em" }}>
          {listings.length} {listings.length === 1 ? "listing" : "listings"} currently available
        </p>

        {/* Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}
        >
          {listings.map((listing) => (
            <motion.div key={listing.id} variants={fadeUp} style={{ height: "100%" }}>
              <GlassCard hover glow style={{ padding: 0, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                <ListingImage src={listing.images[0]} alt={listing.title} />

                <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {/* County + Ref */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <p style={{ color: "var(--accent-2)", fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {listing.county}
                    </p>
                    <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", opacity: 0.7 }}>
                      Ref {listing.ref}
                    </p>
                  </div>

                  {/* Title */}
                  <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--text-primary)", lineHeight: 1.2 }}>
                    {listing.title}
                  </h2>

                  {/* Size + location */}
                  <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px" }}>
                    {listing.size} · {listing.location}
                  </p>

                  {/* Description */}
                  <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.65, flex: 1 }}>
                    {listing.description}
                  </p>

                  {/* Price + CTA */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", paddingTop: "14px", borderTop: "1px solid rgba(200,184,154,0.18)", flexWrap: "wrap" }}>
                    <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--accent)" }}>
                      {listing.price}
                    </p>
                    <Button
                      href={`/contact?service=land-listing&ref=${encodeURIComponent(listing.ref)}&plot=${encodeURIComponent(listing.title)}`}
                      variant="primary"
                      size="sm"
                    >
                      Enquire
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ marginTop: "64px" }}
        >
          <GlassCard hover={false} style={{ padding: "48px 40px", textAlign: "center", background: "rgba(200,184,154,0.03)", border: "1px solid rgba(200,184,154,0.12)" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)", color: "var(--text-primary)", marginBottom: "12px" }}>
              Don&apos;t see what you&apos;re looking for?
            </h2>
            <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", lineHeight: 1.65, marginBottom: "28px", maxWidth: "520px", margin: "0 auto 28px" }}>
              Tell us your budget, preferred county, and what you intend to build or use the land for. We will source verified options and come back to you.
            </p>
            <Button href="/contact" variant="primary" size="lg">
              Tell Us What You Need
            </Button>
          </GlassCard>
        </motion.div>

      </div>
    </>
  );
}
