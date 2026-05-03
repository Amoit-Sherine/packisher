"use client";

import { motion } from "framer-motion";
import Script from "next/script";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import TipperBookingForm from "@/components/TipperBookingForm";
import { fadeUp, staggerContainer } from "@/lib/animations";

const materials = [
  { icon: "🪨", name: "Ballast", desc: "Machine cut and manual. Delivered by the truck to your site." },
  { icon: "🏖️", name: "River Sand", desc: "Building sand and plasta sand. Sourced and delivered across Busia County and surrounding areas." },
  { icon: "🟤", name: "Murram", desc: "Red soil and fill material for foundations, roads, and compound leveling." },
  { icon: "💪", name: "Hardcore", desc: "Loose and broken stones for foundations and drainage." },
  { icon: "🌿", name: "Topsoil", desc: "For landscaping, farming, and site preparation." },
];

const steps = [
  "Select your material and quantity",
  "Enter your delivery location in Western Kenya",
  "Choose your preferred date and time window",
  "Get your price instantly",
  "Pay deposit via Mpesa to confirm",
  "Truck dispatched. You get driver contact and ETA on WhatsApp",
];

const trustPoints = [
  { icon: "✓", text: "Vetted truck operators on every job" },
  { icon: "✓", text: "Steel-bodied tippers built for ballast and hardcore" },
  { icon: "✓", text: "Photo confirmation at delivery" },
  { icon: "✓", text: "Mpesa receipts for every transaction" },
];

export default function TipperPage() {
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  return (
    <>
      {mapsKey && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${mapsKey}&libraries=places`}
          strategy="beforeInteractive"
        />
      )}

      <div style={{ paddingTop: "96px", minHeight: "100vh" }}>
        {/* ── HERO ── */}
        <section className="hero-section" style={{ position: "relative", paddingTop: "96px", paddingBottom: "64px", marginTop: "-96px" }}>
          <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="hero-glass"
              style={{ background: "rgba(245, 242, 236, 0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: "var(--radius-md)", padding: "48px 52px", border: "1px solid rgba(255,255,255,0.68)" }}
            >
              <motion.p variants={fadeUp} style={{ fontFamily: "var(--font-inter), sans-serif", color: "var(--text-muted)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}>
                Packisher Tipper · Western Kenya
              </motion.p>
              <motion.h1 variants={fadeUp} style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(40px, 6vw, 72px)", color: "var(--text-primary)", marginBottom: "20px", lineHeight: 1.05 }}>
                Materials on site.
              </motion.h1>
              <motion.p variants={fadeUp} style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "17px", lineHeight: 1.7, marginBottom: "32px" }}>
                Sand, ballast, murram, and hardcore delivered to your construction site across Western Kenya. Book online, pay via Mpesa, we handle the rest.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Button href="#booking" variant="primary" size="md">Book a Tipper</Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>

          {/* ── WHAT WE DELIVER ── */}
          <section style={{ marginBottom: "80px" }}>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "40px" }}>
              <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", color: "var(--text-primary)", marginBottom: "8px" }}>
                What we deliver.
              </h2>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}
            >
              {materials.map((mat) => (
                <motion.div key={mat.name} variants={fadeUp}>
                  <GlassCard hover style={{ padding: "28px", height: "100%" }}>
                    <div style={{ fontSize: "28px", marginBottom: "12px" }}>{mat.icon}</div>
                    <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--text-primary)", marginBottom: "8px" }}>{mat.name}</h3>
                    <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.65 }}>{mat.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section style={{ marginBottom: "80px" }}>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "40px" }}>
              <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", color: "var(--text-primary)", marginBottom: "8px" }}>
                Book in under five minutes.
              </h2>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {steps.map((step, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <GlassCard hover={false} style={{ padding: "20px 28px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                      <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "28px", color: "var(--accent)", lineHeight: 1, flexShrink: 0, minWidth: "32px" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", lineHeight: 1.6, paddingTop: "4px" }}>
                        {step}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ── BOOKING FORM ── */}
          <section id="booking" style={{ marginBottom: "80px", scrollMarginTop: "80px" }}>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", color: "var(--text-primary)", marginBottom: "12px" }}>
                Book a Tipper.
              </h2>
              <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", lineHeight: 1.6 }}>
                Fill in the details below. You will receive a quote and Mpesa payment prompt to confirm your booking.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <GlassCard hover={false} style={{ padding: "36px" }}>
                <TipperBookingForm />
              </GlassCard>
            </motion.div>
          </section>

          {/* ── TRUST SECTION ── */}
          <section>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 42px)", color: "var(--text-primary)", marginBottom: "8px" }}>
                Why book with Packisher Tipper.
              </h2>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}
            >
              {trustPoints.map((point) => (
                <motion.div key={point.text} variants={fadeUp}>
                  <GlassCard hover style={{ padding: "24px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                      <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "18px", color: "var(--status-live)", lineHeight: 1, flexShrink: 0 }}>
                        {point.icon}
                      </span>
                      <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", lineHeight: 1.6 }}>
                        {point.text}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>
      </div>
    </>
  );
}
