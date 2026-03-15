"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import ContactForm from "@/components/ContactForm";
import { fadeUp, staggerContainer } from "@/lib/animations";

function ContactPageContent() {
  const searchParams = useSearchParams();
  const defaultService = searchParams.get("service") ?? undefined;

  return (
    <div style={{ paddingTop: "96px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Header */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ marginBottom: "56px" }}>
          <motion.h1 variants={fadeUp} style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(48px, 7vw, 80px)", color: "var(--text-primary)", marginBottom: "12px" }}>
            Contact
          </motion.h1>
          <motion.p variants={fadeUp} style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px" }}>
            Let&apos;s talk about your business.
          </motion.p>
        </motion.div>

        {/* Get in Touch */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "clamp(24px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "8px" }}>
            Get in Touch
          </h2>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", marginBottom: "24px", lineHeight: 1.6 }}>
            Fill in the form below and we will get back to you within one business day. Prefer to reach us directly? Use the details below.
          </p>
          <GlassCard hover={false} style={{ padding: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Email */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--accent)", flexShrink: 0 }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <div>
                  <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3px" }}>Email</p>
                  <a href="mailto:support@packisher.com" style={{ color: "var(--text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                    support@packisher.com
                  </a>
                </div>
              </div>
              {/* Instagram */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--accent)", flexShrink: 0 }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
                <div>
                  <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3px" }}>Instagram</p>
                  <a href="https://www.instagram.com/packisher/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                    @packisher
                  </a>
                </div>
              </div>
              {/* LinkedIn */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--accent)", flexShrink: 0 }}>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <div>
                  <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3px" }}>LinkedIn</p>
                  <a href="https://www.linkedin.com/company/packisher/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                    Packisher Technology Services
                  </a>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Inquiry Form */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "clamp(24px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "24px" }}>
            Send a Message
          </h2>
          <GlassCard hover={false} style={{ padding: "32px" }}>
            <ContactForm defaultService={defaultService} />
          </GlassCard>
        </motion.section>

        {/* Direct Payment */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "64px" }}>
          <GlassCard hover={false} style={{ padding: "32px", borderLeft: "3px solid var(--accent)" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "24px", color: "var(--text-primary)", marginBottom: "8px" }}>
              Have a quote? Pay here.
            </h2>
            <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", marginBottom: "24px", lineHeight: 1.6 }}>
              Online payments for quoted work are coming soon. In the meantime, reach out and we will send you payment details directly.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: "rgba(200,184,154,0.1)", border: "1px solid rgba(200,184,154,0.25)", borderRadius: "var(--radius-sm)" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent)", display: "inline-block", opacity: 0.7 }} />
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Coming Soon
              </span>
            </div>
          </GlassCard>
        </motion.section>

        {/* Section D — Contact details */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <GlassCard hover={false} style={{ padding: "28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
              {[
                { label: "Email", value: "support@packisher.com", href: "mailto:support@packisher.com" },
                { label: "Instagram", value: "@packisher", href: "https://www.instagram.com/packisher/", external: true },
                { label: "Response Time", value: "Within 1 business day (Mon–Fri)" },
                { label: "Time Zones", value: "EAT (UTC+3) · MST (UTC−7)" },
              ].map((item) => (
                <div key={item.label}>
                  <p style={{ color: "var(--accent-2)", fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      style={{ color: "var(--text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", textDecoration: "underline", textUnderlineOffset: "3px" }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p style={{ color: "var(--text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px" }}>{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.section>
      </div>

    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: "96px", textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif" }}>Loading…</div>}>
      <ContactPageContent />
    </Suspense>
  );
}
