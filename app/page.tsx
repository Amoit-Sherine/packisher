"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { fadeUp, staggerContainer } from "@/lib/animations";
import HeroSketches from "@/components/HeroSketches";
import DesktopMockup from "@/components/DesktopMockup";

const featuredServices = [
  {
    name: "Business Website",
    description: "Custom-built, mobile-first website for your business. No templates, deployed live within 7 days.",
  },
  {
    name: "Digital Operations Setup",
    description: "Move your operations off WhatsApp and paper into tools that work. Google Workspace, Notion, Airtable, or Jotform.",
  },
  {
    name: "Payments Integration",
    description: "M-Pesa STK Push or Square card payments on your website or app. Full API setup and testing included.",
  },
];

// ─── Tech-stack icons ─────────────────────────────────────────────────────────

const techStack = [
  {
    name: "Next.js",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="currentColor" />
        <path d="M11.5 22.5V9.5L22 22.5V9.5" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "React",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#61DAFB" }}>
        <ellipse cx="16" cy="16" rx="13.5" ry="5" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="16" cy="16" rx="13.5" ry="5" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="13.5" ry="5" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 16 16)" />
        <circle cx="16" cy="16" r="2.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="28" height="28" rx="4" fill="#3178C6" />
        <text x="5.5" y="23" fontFamily="sans-serif" fontWeight="bold" fontSize="13" fill="white">TS</text>
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#06B6D4" }}>
        <path d="M16 7c-4 0-6.5 2-7.5 6 1.5-2 3.25-2.75 5.25-2.25 1.14.29 1.96 1.11 2.86 2.03C17.91 14.27 19.69 16 23.5 16c4 0 6.5-2 7.5-6-1.5 2-3.25 2.75-5.25 2.25-1.14-.29-1.96-1.11-2.86-2.03C22.09 8.73 20.31 7 16 7z" fill="currentColor" />
        <path d="M8.5 16c-4 0-6.5 2-7.5 6 1.5-2 3.25-2.75 5.25-2.25 1.14.29 1.96 1.11 2.86 2.03C10.41 23.27 12.19 25 16 25c4 0 6.5-2 7.5-6-1.5 2-3.25 2.75-5.25 2.25-1.14-.29-1.96-1.11-2.86-2.03C14.59 17.73 12.81 16 8.5 16z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Supabase",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#3ECF8E" }}>
        <path d="M17.5 4.5L6 20h11V27.5L26.5 12H17.5V4.5z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Vercel",
    icon: (
      <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4L30 28H2L16 4z" />
      </svg>
    ),
  },
  {
    name: "Square",
    icon: (
      <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="28" height="28" rx="4" fill="currentColor" />
        <rect x="9" y="9" width="14" height="14" rx="2" fill="white" />
      </svg>
    ),
  },
  {
    name: "Resend",
    icon: (
      <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 6h10c4.4 0 7.5 2.6 7.5 6.5 0 3.1-1.6 5.5-4.2 6.5L26 26h-5l-5.2-7H12v7H7V6zm5 9.5h4c2 0 3.2-1.1 3.2-3s-1.2-3-3.2-3H12v6z" />
      </svg>
    ),
  },
  {
    name: "Twilio",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#F22F46" }}>
        <circle cx="16" cy="16" r="14" fill="currentColor" />
        <circle cx="11.5" cy="11.5" r="2.5" fill="white" />
        <circle cx="20.5" cy="11.5" r="2.5" fill="white" />
        <circle cx="11.5" cy="20.5" r="2.5" fill="white" />
        <circle cx="20.5" cy="20.5" r="2.5" fill="white" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    icon: (
      <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C8.27 2 2 8.27 2 16c0 6.19 4.01 11.43 9.57 13.29.7.13.96-.3.96-.67v-2.36c-3.89.85-4.71-1.88-4.71-1.88-.64-1.62-1.56-2.05-1.56-2.05-1.27-.87.1-.85.1-.85 1.41.1 2.15 1.44 2.15 1.44 1.25 2.14 3.28 1.52 4.08 1.16.13-.9.49-1.52.89-1.87-3.11-.35-6.38-1.55-6.38-6.92 0-1.53.55-2.78 1.44-3.76-.14-.36-.63-1.78.14-3.71 0 0 1.17-.37 3.85 1.43A13.4 13.4 0 0 1 16 9.87c1.19.01 2.39.16 3.51.47 2.67-1.8 3.84-1.43 3.84-1.43.77 1.93.28 3.35.14 3.71.9.98 1.44 2.23 1.44 3.76 0 5.38-3.28 6.56-6.4 6.91.5.43.95 1.29.95 2.6v3.86c0 .37.25.81.96.67C25.99 27.43 30 22.19 30 16 30 8.27 23.73 2 16 2z" />
      </svg>
    ),
  },
  {
    name: "Framer",
    icon: (
      <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 4h20v10H16L6 4z" />
        <path d="M6 14h10l10 10H6V14z" />
        <path d="M6 24h10L6 32V24z" />
      </svg>
    ),
  },
  {
    name: "M-Pesa",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#00A550" />
        <text x="8.5" y="21.5" fontFamily="sans-serif" fontWeight="bold" fontSize="13" fill="white">M</text>
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#25D366" }}>
        <circle cx="16" cy="16" r="14" fill="currentColor" />
        <path d="M22.5 19.8c-.3-.15-1.75-.87-2.02-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.35.22-.65.07-1.74-.87-2.88-1.55-4.04-3.5-.31-.53.31-.49.88-1.64.1-.2.05-.36-.03-.51s-.67-1.62-.92-2.22c-.24-.53-.49-.46-.67-.47h-.58c-.2 0-.5.07-.76.36-.26.3-1 .97-1 2.37s1.02 2.74 1.16 2.93c.15.2 2.01 3.07 4.87 4.31 1.81.78 2.52.84 3.43.71.55-.08 1.75-.72 2-1.41.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.35z" fill="white" />
        <path d="M16.04 4.5A11.5 11.5 0 0 0 5.97 22.1L4 28l6.08-1.59A11.5 11.5 0 1 0 16.04 4.5z" stroke="white" strokeWidth="1.2" fill="none" />
      </svg>
    ),
  },
  {
    name: "Google",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.6 16.3c0-1-.1-2-.2-2.9H16v5.5h7.6c-.3 1.8-1.4 3.3-2.9 4.3v3.5h4.7c2.8-2.5 4.2-6.3 4.2-10.4z" fill="#4285F4" />
        <path d="M16 30c3.8 0 7-1.3 9.4-3.4l-4.7-3.5c-1.3.9-3 1.4-4.7 1.4-3.6 0-6.7-2.4-7.8-5.7H3.4v3.7C5.8 27 10.6 30 16 30z" fill="#34A853" />
        <path d="M8.2 18.8c-.3-.9-.4-1.8-.4-2.8s.1-1.9.4-2.8V9.5H3.4A14 14 0 0 0 2 16c0 2.2.5 4.4 1.4 6.5l4.8-3.7z" fill="#FBBC05" />
        <path d="M16 7.5c2 0 3.8.7 5.2 2l3.9-3.9C22.9 3.5 19.7 2 16 2 10.6 2 5.8 5 3.4 9.5l4.8 3.7c1.1-3.3 4.2-5.7 7.8-5.7z" fill="#EA4335" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section
        className="hero-section"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          paddingTop: "64px",
          background: "transparent",
        }}
      >
        <HeroSketches page="home" sizeMultiplier={0.9} leftOnly />

        {/* Three-column hero row */}
        <div
          className="home-hero-row"
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: "32px",
            maxWidth: "1200px",
            padding: "0 32px",
            width: "100%",
          }}
        >
          {/* Left: ventures property dashboard — clickable */}
          <div className="home-hero-ventures-window" style={{ flexShrink: 0 }}>
            <Link href="/ventures#land-for-sale" className="ventures-window-link">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: "260px",
                  cursor: "pointer",
                  background: "rgba(245, 242, 236, 0.88)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.7)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {/* Title bar */}
                <div style={{ background: "rgba(200,184,154,0.18)", padding: "9px 14px", display: "flex", alignItems: "center", gap: "7px", borderBottom: "1px solid rgba(200,184,154,0.2)" }}>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f57" }} />
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ffbd2e" }} />
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#28c840" }} />
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 500, marginLeft: "4px", letterSpacing: "0.01em" }}>Packisher Properties</span>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840", marginLeft: "auto" }} />
                </div>
                {/* Property rows */}
                <div style={{ padding: "10px" }}>
                  {[
                    { name: "Westlands Apt 4B", status: "Occupied", type: "Apartment · Nairobi" },
                    { name: "Kilimani Studio", status: "Active", type: "Studio · Nairobi" },
                    { name: "South B 2-Bedroom", status: "Occupied", type: "2BR · Nairobi" },
                  ].map((prop, i) => (
                    <div key={i} style={{ padding: "9px 11px", marginBottom: i < 2 ? "6px" : 0, background: "rgba(255,255,255,0.52)", borderRadius: "8px", border: "1px solid rgba(200,184,154,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <div>
                        <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{prop.name}</p>
                        <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "4px", fontWeight: 600, background: prop.status === "Occupied" ? "rgba(40,200,64,0.12)" : "rgba(200,184,154,0.22)", color: prop.status === "Occupied" ? "#1a9e32" : "var(--accent)" }}>{prop.status}</span>
                      </div>
                      <p style={{ fontSize: "10px", color: "var(--text-muted)", textAlign: "right", whiteSpace: "nowrap", opacity: 0.75 }}>{prop.type}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
              <p className="ventures-window-tooltip">View land listings</p>
            </Link>
          </div>

          {/* Centre: text card */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="hero-glass"
            style={{
              flex: 1,
              minWidth: 0,
              padding: "52px 44px",
              background: "rgba(245, 242, 236, 0.82)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid rgba(255, 255, 255, 0.68)",
            }}
          >
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "var(--text-muted)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              Packisher Technology Services
            </motion.p>

            <motion.h1
              variants={fadeUp}
              style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, lineHeight: 1.05, marginBottom: "8px" }}
            >
              <span style={{ display: "block", fontSize: "clamp(38px, 4.8vw, 66px)", color: "var(--text-primary)" }}>
                Technology that works.
              </span>
              <span style={{ display: "block", fontSize: "clamp(38px, 4.8vw, 66px)", color: "var(--accent)" }}>
                Built with community.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "var(--text-secondary)",
                fontSize: "17px",
                lineHeight: 1.65,
                margin: "24px 0 36px",
              }}
            >
              We build digital products for small businesses and manage property in Kenya.
            </motion.p>

            {/* Hero buttons — side by side */}
            <motion.div
              variants={fadeUp}
              className="hero-glass-btns"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, minWidth: "140px" }}>
                <span style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif" }}>
                  Technology
                </span>
                <Button href="/services" variant="primary" size="sm" style={{ width: "100%", justifyContent: "center" } as React.CSSProperties}>
                  View Services
                </Button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, minWidth: "140px" }}>
                <span style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif" }}>
                  Ventures
                </span>
                <Button href="/ventures" variant="outline" size="sm" style={{ width: "100%", justifyContent: "center" } as React.CSSProperties}>
                  Explore Ventures
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: desktop mockup — clickable */}
          <div className="home-hero-mockup" style={{ flexShrink: 0 }}>
            <Link href="/portfolio" className="mockup-window-link">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                style={{ cursor: "pointer" }}
              >
                <DesktopMockup />
              </motion.div>
              <p className="mockup-window-tooltip">See our work</p>
            </Link>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", animation: "scrollBounce 2s ease-in-out infinite", color: "var(--text-muted)", zIndex: 1 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>

        <style>{`
          /* ── Window link hover tooltips ── */
          .ventures-window-link,
          .mockup-window-link {
            display: block;
            text-decoration: none;
          }
          .ventures-window-tooltip,
          .mockup-window-tooltip {
            text-align: center;
            font-size: 11px;
            color: var(--text-muted);
            font-family: var(--font-inter), sans-serif;
            margin-top: 8px;
            opacity: 0;
            transition: opacity 0.2s ease;
          }
          .ventures-window-link:hover .ventures-window-tooltip,
          .mockup-window-link:hover .mockup-window-tooltip {
            opacity: 1;
          }
          /* ── Responsive hero ── */
          @media (max-width: 960px) {
            .home-hero-row {
              flex-direction: column;
              align-items: center;
              max-width: 700px !important;
              gap: 32px !important;
            }
            .home-hero-ventures-window {
              display: none !important;
            }
            .home-hero-mockup {
              display: flex;
              justify-content: center;
              width: 100%;
            }
            .home-hero-row .hero-glass {
              text-align: center;
            }
            .home-hero-row .hero-glass-btns {
              width: 100%;
              justify-content: center;
            }
            .home-hero-row .hero-glass-btns > div {
              flex: 1 !important;
              min-width: 130px !important;
            }
          }
          @media (max-width: 400px) {
            .desktop-mockup-root {
              transform: scale(0.88);
              transform-origin: top center;
            }
          }
        `}</style>
      </section>

      {/* Mobile-only: Packisher Properties window */}
      <div className="mobile-ventures-window" style={{ display: "none", padding: "0 24px 8px", justifyContent: "center" }}>
        <div style={{
          width: "100%",
          maxWidth: "360px",
          background: "rgba(245, 242, 236, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.7)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
          overflow: "hidden",
          fontFamily: "var(--font-inter), sans-serif",
        }}>
          <div style={{ background: "rgba(200,184,154,0.18)", padding: "9px 14px", display: "flex", alignItems: "center", gap: "7px", borderBottom: "1px solid rgba(200,184,154,0.2)" }}>
            <div style={{ display: "flex", gap: "5px" }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#28c840" }} />
            </div>
            <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 500, marginLeft: "4px" }}>Packisher Properties</span>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840", marginLeft: "auto" }} />
          </div>
          <div style={{ padding: "10px" }}>
            {[
              { name: "Westlands Apt 4B", status: "Occupied", type: "Apartment · Nairobi" },
              { name: "Kilimani Studio", status: "Active", type: "Studio · Nairobi" },
              { name: "South B 2-Bedroom", status: "Occupied", type: "2BR · Nairobi" },
            ].map((prop, i) => (
              <div key={i} style={{ padding: "9px 11px", marginBottom: i < 2 ? "6px" : 0, background: "rgba(255,255,255,0.52)", borderRadius: "8px", border: "1px solid rgba(200,184,154,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{prop.name}</p>
                  <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "4px", fontWeight: 600, background: prop.status === "Occupied" ? "rgba(40,200,64,0.12)" : "rgba(200,184,154,0.22)", color: prop.status === "Occupied" ? "#1a9e32" : "var(--accent)" }}>{prop.status}</span>
                </div>
                <p style={{ fontSize: "10px", color: "var(--text-muted)", textAlign: "right", whiteSpace: "nowrap", opacity: 0.75 }}>{prop.type}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 960px) {
            .mobile-ventures-window { display: flex !important; }
          }
        `}</style>
      </div>

      {/* VALUE PROPS */}
      <section style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}
        >
          {[
            {
              title: "Kenya and Canada",
              desc: "We operate in both markets and understand them from the inside. Payments, infrastructure, business culture — we build around the reality of each.",
            },
            {
              title: "Small business focus",
              desc: "Our clients are owner-operated businesses. The work is scoped to what they actually need, not what looks good on a proposal.",
            },
            {
              title: "Remote delivery",
              desc: "Every service is delivered online. Most projects ship within 7 to 10 business days from a confirmed scope.",
            },
          ].map((item) => (
            <motion.div key={item.title} variants={fadeUp}>
              <GlassCard hover style={{ padding: "32px", height: "100%" }}>
                <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--text-primary)", marginBottom: "10px" }}>{item.title}</h3>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.6 }}>{item.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* OUR DIVISIONS */}
      <section id="divisions" style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 56px)", color: "var(--text-primary)", marginBottom: "8px" }}>Our Divisions</h2>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px" }}>
            Packisher operates across two active divisions. Each runs independently with its own focus and roadmap.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}
        >
          <motion.div variants={fadeUp}>
            <GlassCard hover glow style={{ padding: "28px", height: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
              <Badge variant="live">Live</Badge>
              <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--text-primary)" }}>Technology Services</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6, fontFamily: "var(--font-inter), sans-serif", flex: 1 }}>
                Remote-first digital services for businesses in Kenya and Canada. Websites, Google Workspace, payment integration, and business digitization.
              </p>
              <Button href="/services" variant="primary" size="sm">View Services</Button>
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeUp}>
            <GlassCard hover style={{ padding: "28px", height: "100%", display: "flex", flexDirection: "column", gap: "12px", background: "var(--card-soon-bg)", border: "1.5px dashed var(--card-soon-border)" }}>
              <Badge variant="soon">Active in Kenya</Badge>
              <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--text-primary)" }}>Ventures</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, fontFamily: "var(--font-inter), sans-serif", flex: 1 }}>
                Property investment, short-term rentals, and construction contracting in Kenya. Actively exploring property management in Nairobi and coastal listings.
              </p>
              <Button href="/ventures" variant="outline" size="sm">Learn More</Button>
            </GlassCard>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURED SERVICES */}
      <section style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 56px)", color: "var(--text-primary)", marginBottom: "8px" }}>What We Do</h2>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif" }}>Kenya and Canada · Remote delivery</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px" }}
        >
          {featuredServices.map((svc) => (
            <motion.div key={svc.name} variants={fadeUp}>
              <GlassCard hover glow style={{ padding: "28px", height: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--text-primary)" }}>{svc.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6, fontFamily: "var(--font-inter), sans-serif", flex: 1 }}>{svc.description}</p>
                <Button href="/services" variant="outline" size="sm">Learn More</Button>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        <div style={{ textAlign: "center" }}>
          <Link href="/services" style={{ color: "var(--accent)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", textDecoration: "underline", textUnderlineOffset: "4px" }}>
            View All Services →
          </Link>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 56px)", color: "var(--text-primary)", marginBottom: "40px" }}>
          Our Work
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "40px" }}
        >
          <motion.div variants={fadeUp}>
            <GlassCard hover glow style={{ padding: "28px", height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
                <Badge variant="live">Live</Badge>
                <span style={{ color: "var(--text-muted)", fontSize: "12px", fontFamily: "var(--font-inter), sans-serif" }}>Secwepemc Sisters · Kamloops, BC</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--text-primary)", marginBottom: "10px" }}>Secwepemc Sisters&apos; Sacred Thread</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.65, fontFamily: "var(--font-inter), sans-serif", marginBottom: "20px", flex: 1 }}>
                Indigenous, queer, sister-operated craft e-commerce store. Glassmorphism UI, Square payment integration with live catalog inventory, and Vercel Postgres for order persistence.
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                {["Next.js 14", "TypeScript", "Square", "Framer Motion", "Vercel Postgres", "Resend"].map((t) => (<Badge key={t} variant="tech">{t}</Badge>))}
              </div>
              <Button href="https://ssst.packisher.com" variant="primary" size="sm" external>View Live Site</Button>
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeUp}>
            <GlassCard hover glow style={{ padding: "28px", height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
                <Badge variant="live">Live</Badge>
                <span style={{ color: "var(--text-muted)", fontSize: "12px", fontFamily: "var(--font-inter), sans-serif" }}>Internal · Kamloops, BC &amp; Nairobi</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--text-primary)", marginBottom: "10px" }}>Packisher.com</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.65, fontFamily: "var(--font-inter), sans-serif", marginBottom: "20px", flex: 1 }}>
                Company website for Packisher Technology Services and Ventures. Custom logo mark with braille P detail, glassmorphism design system, land listings, and structured data for SEO.
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                {["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"].map((t) => (<Badge key={t} variant="tech">{t}</Badge>))}
              </div>
              <Button href="https://packisher.com" variant="primary" size="sm" external>View Live Site</Button>
            </GlassCard>
          </motion.div>
        </motion.div>

        <div style={{ textAlign: "center" }}>
          <Link href="/portfolio" style={{ color: "var(--accent)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", textDecoration: "underline", textUnderlineOffset: "4px" }}>
            View Full Portfolio →
          </Link>
        </div>
      </section>

      {/* TRUST STRIP — icons */}
      <section style={{ padding: "40px 24px 56px" }}>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "28px" }}>
          Built with
        </p>
        <div
          className="tech-strip no-scrollbar"
          style={{
            display: "flex",
            gap: "32px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {techStack.map(({ name, icon }) => (
            <div
              key={name}
              className="tech-strip-item"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "7px",
                opacity: 0.55,
                transition: "opacity 0.2s ease",
              }}
            >
              <div style={{ width: 32, height: 32, flexShrink: 0 }}>{icon}</div>
              <span style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "10px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
              }}>
                {name}
              </span>
            </div>
          ))}
        </div>
        <style>{`
          .tech-strip-item:hover { opacity: 1 !important; }
          @media (max-width: 640px) {
            .tech-strip {
              flex-wrap: nowrap !important;
              overflow-x: auto;
              justify-content: flex-start !important;
              padding-bottom: 8px;
            }
          }
        `}</style>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto 40px" }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <GlassCard hover={false} style={{ padding: "60px 40px", textAlign: "center", background: "rgba(200,184,154,0.03)", border: "1px solid rgba(200,184,154,0.12)" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(32px, 5vw, 52px)", color: "var(--text-primary)", marginBottom: "16px" }}>
              Ready to get started?
            </h2>
            <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", marginBottom: "32px", lineHeight: 1.6 }}>
              Book a free 30-minute call. We scope the work together and quote from there.
            </p>
            <Button href="/contact" variant="primary" size="lg">Schedule a Free Consultation</Button>
          </GlassCard>
        </motion.div>
      </section>
    </>
  );
}
