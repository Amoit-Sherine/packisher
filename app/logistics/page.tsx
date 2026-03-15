"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { fadeUp, staggerContainer } from "@/lib/animations";
import HeroSketches from "@/components/HeroSketches";

export default function LogisticsPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section" style={{ position: "relative", paddingTop: "96px", paddingBottom: "64px" }}>
        <HeroSketches page="logistics" />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.p variants={fadeUp} style={{ fontFamily: "var(--font-inter), sans-serif", color: "var(--text-muted)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>
              Packisher · Logistics
            </motion.p>
            <motion.h1 variants={fadeUp} style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 6vw, 60px)", color: "var(--text-primary)", marginBottom: "32px", lineHeight: 1.1 }}>
              Delivery infrastructure for rural communities.
            </motion.h1>
            <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {[
                "Packisher Logistics is developing a batched delivery platform for communities in British Columbia that are more than an hour from major retail centres. The platform handles order intake, payment pre-authorisation, route optimisation, and driver dispatch through a single admin interface.",
                "The first market is Kamloops and surrounding communities including Merritt, Barriere, Chase, and Logan Lake. A run activates when enough orders accumulate to cover operating costs, making delivery economically viable for areas that commercial services do not reach.",
                "The platform is currently in development. A pilot launch is planned for Kamloops, BC.",
              ].map((para, i) => (
                <p key={i} style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "17px", lineHeight: 1.75 }}>
                  {para}
                </p>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Rest of content */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Status card */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "48px" }}>
          <GlassCard hover={false} style={{ padding: "24px 28px", borderLeft: "3px solid var(--accent-2)" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
              <Badge variant="soon">In Development</Badge>
              <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px" }}>Pilot launch: Kamloops, BC</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.6 }}>
              Stack: Next.js 14 · Supabase · Helcim · Shipday · Twilio
            </p>
          </GlassCard>
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Button href="/contact" variant="primary" size="md">Contact Us</Button>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", marginTop: "16px", lineHeight: 1.6 }}>
            Interested in partnering or investing in the Kamloops pilot? Reach out through the contact page.
          </p>
        </motion.div>

      </div>
    </>
  );
}
