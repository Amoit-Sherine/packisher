"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import { fadeUp, staggerContainer } from "@/lib/animations";

const howWeOperate = [
  {
    title: "Accountable on every job",
    desc: "Every delivery and every tipper load is documented with photo proof and Mpesa receipts. No excuses, no gaps.",
  },
  {
    title: "No middlemen",
    desc: "You book directly with Packisher. Your rider or driver is a Packisher operator, not a random contractor from a pool.",
  },
  {
    title: "Built for Kenya",
    desc: "Mpesa payments. WhatsApp confirmations. Kenyan roads and Nairobi traffic baked into everything we build.",
  },
  {
    title: "Transparent pricing",
    desc: "Pricing is shown before you pay. No surprise charges, no callbacks to negotiate, no hidden fees.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-section" style={{ position: "relative", paddingTop: "96px", paddingBottom: "64px" }}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div
            className="hero-glass"
            style={{ background: "rgba(245, 242, 236, 0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: "var(--radius-md)", padding: "48px 52px", border: "1px solid rgba(255,255,255,0.68)" }}
          >
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.p
                variants={fadeUp}
                style={{ fontFamily: "var(--font-inter), sans-serif", color: "var(--text-muted)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}
              >
                Packisher · Nairobi, Kenya
              </motion.p>
              <motion.h1
                variants={fadeUp}
                style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 6vw, 60px)", color: "var(--text-primary)", marginBottom: "20px", lineHeight: 1.1 }}
              >
                We handle the logistics.
              </motion.h1>
              <motion.h2
                variants={fadeUp}
                style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "clamp(22px, 3.5vw, 36px)", color: "var(--accent)", marginBottom: "32px", lineHeight: 1.2 }}
              >
                So you can focus on your business.
              </motion.h2>
              <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "17px", lineHeight: 1.75 }}>
                  Packisher is a Nairobi-based logistics company. We deliver parcels across the city and construction materials across Western Kenya. Two services. One standard of accountability.
                </p>
                <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "17px", lineHeight: 1.75 }}>
                  We built Packisher because small businesses in Kenya deserve logistics that actually works. No missing riders, no unconfirmed deliveries, no chasing the driver on phone. Every job documented. Every payment tracked. Every client updated on WhatsApp.
                </p>
                <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "17px", lineHeight: 1.75 }}>
                  We understand Mpesa, Nairobi traffic, Western Kenya roads, and the reality of running a business here. We build around what is real, not what is ideal.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How We Operate ── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px 80px" }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", color: "var(--text-primary)", marginBottom: "32px" }}>
            How we operate.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {howWeOperate.map((item) => (
              <GlassCard key={item.title} hover style={{ padding: "24px" }}>
                <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--text-primary)", marginBottom: "8px" }}>{item.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.6 }}>{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* ── Closing CTA ── */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <GlassCard hover={false} style={{ padding: "40px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "28px" }}>
              Get in touch.
            </h2>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Button href="/tipper#booking" variant="primary" size="md">Book a Truck Service</Button>
              <Button href="/contact" variant="outline" size="md">Contact Us</Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </>
  );
}
