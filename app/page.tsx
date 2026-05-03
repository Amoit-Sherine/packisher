"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { fadeUp, staggerContainer } from "@/lib/animations";

function useOsHref() {
  const [href, setHref] = useState("/parcels#download");
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) {
      setHref("https://play.google.com/store/apps/details?id=com.packisher");
    } else if (/iphone|ipad|ipod/i.test(ua)) {
      setHref("https://apps.apple.com/app/packisher/id0000000000");
    } else {
      setHref("/parcels#download");
    }
  }, []);
  return href;
}

export default function HomePage() {
  const downloadHref = useOsHref();

  return (
    <>
      {/* ── HERO ── */}
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
        }}
      >
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1000px", width: "100%", padding: "0 24px" }}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="hero-glass"
            style={{
              padding: "52px 44px",
              background: "rgba(245, 242, 236, 0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid rgba(255, 255, 255, 0.68)",
              textAlign: "center",
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
              Packisher Logistics
            </motion.p>

            <motion.h1
              variants={fadeUp}
              style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, lineHeight: 1.05, marginBottom: "8px", textTransform: "uppercase" }}
            >
              <span style={{ display: "block", fontSize: "clamp(38px, 5.5vw, 72px)", color: "var(--text-primary)" }}>
                You send it,
              </span>
              <span style={{ display: "block", fontSize: "clamp(38px, 5.5vw, 72px)", color: "var(--accent)" }}>
                We run it.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "1.25rem",
                letterSpacing: "0.2em",
                color: "var(--text-muted)",
                marginTop: "0.5rem",
                marginBottom: "1rem",
                fontWeight: 500,
              }}
            >
              Tutume.
            </motion.p>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "var(--text-secondary)",
                fontSize: "17px",
                lineHeight: 1.65,
                margin: "16px auto 32px",
                maxWidth: "560px",
              }}
            >
              Send anything across Kenya without leaving your seat.<br />
              Need a truck for your build in Western Kenya? We have that too.
            </motion.p>

            {/* OS-detect download button */}
            <motion.div variants={fadeUp} style={{ marginBottom: "40px" }} className="download-btn-wrap">
              <a
                href={downloadHref}
                className="download-app-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 28px",
                  minHeight: "48px",
                  border: "1px solid var(--accent)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--accent)",
                  fontSize: "15px",
                  fontWeight: 600,
                  fontFamily: "var(--font-inter), sans-serif",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.02em",
                }}
              >
                Download App
              </a>
            </motion.div>

            {/* Two macOS window service cards */}
            <motion.div
              variants={staggerContainer}
              className="hero-service-cards"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
            >
              {/* ── Parcels macOS window ── */}
              <motion.div variants={fadeUp} className="parcels-card-wrap">
                <Link href="/parcels" style={{ textDecoration: "none", display: "block" }}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: "rgba(245, 242, 236, 0.55)",
                      backdropFilter: "blur(20px) saturate(160%)",
                      WebkitBackdropFilter: "blur(20px) saturate(160%)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.4)",
                      boxShadow: "0 12px 36px rgba(0,0,0,0.10)",
                      overflow: "hidden",
                      cursor: "pointer",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    {/* Title bar */}
                    <div style={{ position: "relative", padding: "10px 14px", background: "rgba(122, 92, 56, 0.08)", borderBottom: "1px solid rgba(122,92,56,0.12)", display: "flex", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
                        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E" }} />
                        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
                      </div>
                      <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", pointerEvents: "none" }}>
                        PARCEL SERVICES
                      </span>
                    </div>
                    {/* Content */}
                    <div style={{ padding: "1.5rem", textAlign: "left" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
                        <span style={{ color: "#e74c3c", fontSize: "16px", marginTop: "2px" }}>📍</span>
                        <div>
                          <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px", fontWeight: 600 }}>Pick Up</p>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Your location, Nairobi</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
                        <span style={{ color: "#22c55e", fontSize: "16px", marginTop: "2px" }}>📍</span>
                        <div>
                          <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px", fontWeight: 600 }}>Drop Off</p>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Anywhere in Kenya</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                        <span style={{ fontSize: "16px" }}>🏍️</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px", fontWeight: 600 }}>Rider</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Assigned and on the way</span>
                            <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "99px", background: "rgba(40,200,64,0.14)", color: "#1a9e32", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Live</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ paddingTop: "12px", borderTop: "1px solid rgba(122,92,56,0.10)" }}>
                        <span
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = "/parcels#download"; }}
                          style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}
                        >
                          → Download App
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>

              {/* ── Tipper macOS window ── */}
              <motion.div variants={fadeUp} className="tipper-card-wrap">
                <Link href="/tipper" style={{ textDecoration: "none", display: "block" }}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: "rgba(245, 242, 236, 0.55)",
                      backdropFilter: "blur(20px) saturate(160%)",
                      WebkitBackdropFilter: "blur(20px) saturate(160%)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.4)",
                      boxShadow: "0 12px 36px rgba(0,0,0,0.10)",
                      overflow: "hidden",
                      cursor: "pointer",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    {/* Title bar */}
                    <div style={{ position: "relative", padding: "10px 14px", background: "rgba(122, 92, 56, 0.08)", borderBottom: "1px solid rgba(122,92,56,0.12)", display: "flex", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
                        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E" }} />
                        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
                      </div>
                      <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", pointerEvents: "none" }}>
                        CONSTRUCTION TRUCKS
                      </span>
                    </div>
                    {/* Content */}
                    <div style={{ padding: "1.5rem", textAlign: "left" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
                        <span style={{ fontSize: "16px", marginTop: "2px" }}>🪨</span>
                        <div>
                          <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px", fontWeight: 600 }}>Material</p>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Ballast</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
                        <span style={{ color: "#7A5C38", fontSize: "16px", marginTop: "2px" }}>📍</span>
                        <div>
                          <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px", fontWeight: 600 }}>Location</p>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Busia County</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "16px" }}>
                        <span style={{ fontSize: "16px", marginTop: "2px" }}>📅</span>
                        <div>
                          <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px", fontWeight: 600 }}>Date</p>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Today</p>
                        </div>
                      </div>
                      <div style={{ paddingTop: "12px", borderTop: "1px solid rgba(122,92,56,0.10)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                        <span style={{ fontSize: "9px", padding: "3px 8px", borderRadius: "99px", background: "rgba(40,200,64,0.14)", color: "#1a9e32", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Confirmed</span>
                        <span
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = "/tipper#booking"; }}
                          style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}
                        >
                          → Book a Truck Service
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", animation: "scrollBounce 2s ease-in-out infinite", color: "var(--text-muted)", zIndex: 1 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>

        <style>{`
          .download-app-btn:hover {
            background: rgba(122, 92, 56, 0.08) !important;
            box-shadow: 0 0 16px rgba(122, 92, 56, 0.12);
          }
          @media (max-width: 560px) {
            .hero-service-cards {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* ── TWO SERVICES ── */}
      <section style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 56px)", color: "var(--text-primary)", marginBottom: "8px" }}>
            Our Services.
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}
        >
          <motion.div variants={fadeUp}>
            <GlassCard hover glow style={{ padding: "32px", height: "100%", display: "flex", flexDirection: "column", gap: "14px" }}>
              <Badge variant="active">Nairobi</Badge>
              <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "26px", color: "var(--text-primary)", letterSpacing: "0.04em" }}>
                Parcel Services
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.7, fontFamily: "var(--font-inter), sans-serif", flex: 1 }}>
                Parcel pickup and drop off across Nairobi. Trained riders handle your deliveries, errands, and bus station drops. Every step documented. Pay via Mpesa.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", background: "rgba(82, 72, 160, 0.08)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(82, 72, 160, 0.15)", alignSelf: "flex-start" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-2)", display: "inline-block" }} />
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 600, color: "var(--accent-2)", letterSpacing: "0.08em", textTransform: "uppercase" }}>App Launching Soon</span>
              </div>
              <Button href="/parcels" variant="outline" size="sm" style={{ alignSelf: "flex-start" } as React.CSSProperties}>
                Learn More
              </Button>
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeUp}>
            <GlassCard hover glow style={{ padding: "32px", height: "100%", display: "flex", flexDirection: "column", gap: "14px" }}>
              <Badge variant="live">Western Kenya</Badge>
              <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "26px", color: "var(--text-primary)", letterSpacing: "0.04em" }}>
                Construction Trucks
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.7, fontFamily: "var(--font-inter), sans-serif", flex: 1 }}>
                Sand, ballast, murram and hardcore delivered to your construction site. Book a Truck Service online, confirm with Mpesa, and get your materials on site.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", background: "rgba(22, 163, 74, 0.08)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(22, 163, 74, 0.18)", alignSelf: "flex-start" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--status-live)", display: "inline-block" }} />
                <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 600, color: "var(--status-live)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Book Now</span>
              </div>
              <Button href="/tipper" variant="primary" size="sm" style={{ alignSelf: "flex-start" } as React.CSSProperties}>
                Book a Truck Service
              </Button>
            </GlassCard>
          </motion.div>
        </motion.div>
      </section>

      {/* ── WHY PACKISHER ── */}
      <section style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 56px)", color: "var(--text-primary)", marginBottom: "8px" }}>
            Built different.
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}
        >
          {[
            {
              title: "Vetted and trained",
              desc: "Every Packisher rider and truck operator is personally vetted and trained. No random contractors, no brokers.",
            },
            {
              title: "Every job documented",
              desc: "Photo proof at pickup. Delivery confirmation. Mpesa receipts. Every single job.",
            },
            {
              title: "Built for businesses",
              desc: "Individual senders and businesses both welcome. Business accounts include monthly invoicing and priority booking.",
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

      {/* ── JOURNEY TEASER ── */}
      <section style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <GlassCard hover={false} style={{ padding: "52px 44px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", color: "var(--text-muted)", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "20px" }}>
              The Story
            </p>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", color: "var(--text-primary)", marginBottom: "20px" }}>
              How we got here.
            </h2>
            <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "17px", lineHeight: 1.75, marginBottom: "32px", maxWidth: "600px", margin: "0 auto 32px" }}>
              Packisher started as a technology company. We saw the logistics gap in Kenya. We built the infrastructure to fill it.
            </p>
            <Button href="/journey" variant="outline" size="md">Read The Journey</Button>
          </GlassCard>
        </motion.div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto 40px" }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <GlassCard hover={false} style={{ padding: "60px 40px", textAlign: "center", background: "rgba(122, 92, 56, 0.03)", border: "1px solid rgba(122, 92, 56, 0.12)" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(32px, 5vw, 52px)", color: "var(--text-primary)", marginBottom: "16px" }}>
              Ready to move something?
            </h2>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginTop: "32px" }}>
              <Button href="/parcels" variant="outline" size="md">Packisher Parcels</Button>
              <Button href="/tipper" variant="primary" size="md">Book a Truck Service</Button>
            </div>
          </GlassCard>
        </motion.div>
      </section>
    </>
  );
}
