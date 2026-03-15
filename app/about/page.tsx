"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import { fadeUp, staggerContainer } from "@/lib/animations";
import HeroSketches from "@/components/HeroSketches";

const values = [
  {
    title: "Defined scope",
    desc: "Every engagement starts with a written scope. What is included, what is not, and what delivery looks like.",
  },
  {
    title: "Clear communication",
    desc: "We give progress updates without being asked. If something changes, you hear about it the same day.",
  },
  {
    title: "Full ownership at handoff",
    desc: "Code, accounts, domains, and credentials transfer to you at the end of every project. No exceptions.",
  },
  {
    title: "Transparent quoting",
    desc: "We quote after a discovery call. Estimates reflect the actual work required, not a number to win the project.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section" style={{ position: "relative", paddingTop: "96px", paddingBottom: "64px" }}>
        <HeroSketches page="about" />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
          <div className="hero-glass" style={{ background: "rgba(245, 242, 236, 0.82)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: "var(--radius-md)", padding: "40px 48px", border: "1px solid rgba(255, 255, 255, 0.68)" }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.h1 variants={fadeUp} style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 6vw, 60px)", color: "var(--text-primary)", marginBottom: "32px", lineHeight: 1.1 }}>
              Built across two markets.
            </motion.h1>
            <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {[
                "Packisher is a technology and ventures company operating across Kenya and Canada. We build digital products for small businesses and manage property in Kenya. Both sides of the business come from direct experience in these markets.",
                "The technology work covers websites, internal tools, payment integrations, and operational systems. The ventures side covers property management, land acquisition, and construction in Kenya. The two divisions are separate in how they run but connected in where they operate and why.",
              ].map((para, i) => (
                <p key={i} style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "17px", lineHeight: 1.75 }}>
                  {para}
                </p>
              ))}
            </motion.div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of content */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Mission */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "64px" }}>
          <GlassCard hover={false} style={{ padding: "28px 32px", borderLeft: "3px solid var(--accent-2)" }}>
            <p style={{ color: "var(--text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "18px", lineHeight: 1.7, fontStyle: "italic" }}>
              &ldquo;We work with businesses that have a clear problem and want it solved properly. Every engagement is scoped upfront, delivered to timeline, and handed off with full client ownership.&rdquo;
            </p>
          </GlassCard>
        </motion.div>

        {/* Dual-base */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", color: "var(--text-primary)", marginBottom: "32px" }}>
            Two markets.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            <GlassCard hover style={{ padding: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--text-primary)", marginBottom: "16px" }}>
                Canada
              </h3>
              <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.7 }}>
                Packisher operates in Canada with infrastructure on Canadian platforms. Clients here are billed in CAD, hosted on Vercel, and supported within North American business hours.
              </p>
            </GlassCard>

            <GlassCard hover style={{ padding: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--text-primary)", marginBottom: "16px" }}>
                Kenya
              </h3>
              <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.7 }}>
                Kenya is where most of our clients are and where our ventures division operates. We have worked in the Kenyan market long enough to understand its payment systems, its business culture, and the practical constraints that most foreign services are not built around.
              </p>
            </GlassCard>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", color: "var(--text-primary)", marginBottom: "32px" }}>
            How We Work
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {values.map((v) => (
              <GlassCard key={v.title} hover style={{ padding: "24px" }}>
                <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--text-primary)", marginBottom: "8px" }}>{v.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.6 }}>{v.desc}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "18px", marginBottom: "24px" }}>
            Want to work with us?
          </p>
          <Button href="/contact" variant="primary" size="lg">Book a Free Consultation</Button>
        </motion.div>

      </div>
    </>
  );
}
