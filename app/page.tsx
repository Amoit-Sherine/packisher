"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
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

type ViewportMode = "desktop" | "tablet-landscape" | "tablet-portrait" | "mobile";

function useViewportMode(): ViewportMode {
  const [mode, setMode] = useState<ViewportMode>("mobile");
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setMode("desktop");
      else if (w >= 1024) setMode("tablet-landscape");
      else if (w >= 768) setMode("tablet-portrait");
      else setMode("mobile");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return mode;
}

const macCardStyle: React.CSSProperties = {
  background: "rgba(245, 242, 236, 0.55)",
  backdropFilter: "blur(20px) saturate(160%)",
  WebkitBackdropFilter: "blur(20px) saturate(160%)",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.4)",
  boxShadow: "0 12px 36px rgba(0,0,0,0.10)",
  overflow: "hidden",
  cursor: "pointer",
  fontFamily: "var(--font-inter), sans-serif",
  width: "100%",
};

function ParcelsCardBody() {
  return (
    <>
      <div style={{ position: "relative", padding: "10px 14px", background: "rgba(122, 92, 56, 0.08)", borderBottom: "1px solid rgba(122,92,56,0.12)", display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
        </div>
        <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", pointerEvents: "none" }}>
          PARCEL SERVICES →
        </span>
      </div>
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "16px" }}>🏍️</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px", fontWeight: 600 }}>Rider</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Assigned and on the way</span>
              <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "99px", background: "rgba(40,200,64,0.14)", color: "#1a9e32", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Live</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TipperCardBody() {
  return (
    <>
      <div style={{ position: "relative", padding: "10px 14px", background: "rgba(122, 92, 56, 0.08)", borderBottom: "1px solid rgba(122,92,56,0.12)", display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
        </div>
        <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", pointerEvents: "none" }}>
          TRUCK SERVICES →
        </span>
      </div>
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
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
          <span style={{ fontSize: "16px", marginTop: "2px" }}>📅</span>
          <div>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px", fontWeight: 600 }}>Date</p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Today</p>
          </div>
        </div>
        <div>
          <span style={{ display: "inline-block", fontSize: "9px", padding: "3px 8px", borderRadius: "99px", background: "rgba(40,200,64,0.14)", color: "#1a9e32", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Confirmed</span>
        </div>
      </div>
    </>
  );
}

export default function HomePage() {
  const downloadHref = useOsHref();
  const mode = useViewportMode();
  const showSideCards = mode === "desktop" || mode === "tablet-landscape";
  const showMobileStacked = mode === "tablet-portrait" || mode === "mobile";
  const cardScale = mode === "tablet-landscape" ? 0.85 : 1;

  const heroRef = useRef<HTMLElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const leftCardRef = useRef<HTMLDivElement | null>(null);
  const rightCardRef = useRef<HTMLDivElement | null>(null);

  const [pipeGeo, setPipeGeo] = useState<null | {
    width: number; height: number;
    leftPath: string; rightPath: string;
    fullPipePath: string;
    leftJoint: { x: number; y: number };
    rightJoint: { x: number; y: number };
    leftCap: { x: number; y: number };
    rightCap: { x: number; y: number };
    leftCardTop: number;
    rightCardTop: number;
    cx: number;
    pipeY: number;
  }>(null);

  useEffect(() => {
    if (!showSideCards) { setPipeGeo(null); return; }

    const compute = () => {
      const hero = heroRef.current;
      const center = centerRef.current;
      if (!hero || !center) return;
      const h = hero.getBoundingClientRect();
      const c = center.getBoundingClientRect();

      const heroTop = h.top;
      const heroWidth = h.width;
      const heroHeight = h.height;

      // Pipe Y — just above headline vertical center
      const pipeY = (c.top - heroTop) + (c.height * 0.35);

      // Center origin X
      const cx = heroWidth / 2;

      // Drop points closer to center
      const spread = heroWidth * 0.28;
      const leftDropX = cx - spread;
      const rightDropX = cx + spread;

      // Staggered card tops
      const leftCardTop = pipeY + 20;
      const rightCardTop = pipeY + 60;

      // Short vertical drop lengths
      const leftDropLength = 80;
      const rightDropLength = 120;

      const leftPath = [
        `M ${cx} ${pipeY}`,
        `L ${leftDropX} ${pipeY}`,
        `L ${leftDropX} ${leftCardTop + leftDropLength}`,
      ].join(" ");

      const rightPath = [
        `M ${cx} ${pipeY}`,
        `L ${rightDropX} ${pipeY}`,
        `L ${rightDropX} ${rightCardTop + rightDropLength}`,
      ].join(" ");

      const fullPipePath = `M ${leftDropX - 16} ${pipeY} L ${rightDropX + 16} ${pipeY}`;

      setPipeGeo({
        width: heroWidth,
        height: heroHeight,
        leftPath,
        rightPath,
        fullPipePath,
        leftJoint: { x: leftDropX, y: pipeY },
        rightJoint: { x: rightDropX, y: pipeY },
        leftCap: { x: leftDropX, y: leftCardTop + leftDropLength },
        rightCap: { x: rightDropX, y: rightCardTop + rightDropLength },
        leftCardTop,
        rightCardTop,
        cx,
        pipeY,
      });
    };

    const t = setTimeout(compute, 120);
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && heroRef.current) {
      ro = new ResizeObserver(compute);
      ro.observe(heroRef.current);
    }
    window.addEventListener("resize", compute);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", compute);
      ro?.disconnect();
    };
  }, [showSideCards, cardScale]);

  return (
    <>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="hero-section"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          paddingTop: "64px",
          overflow: "hidden",
        }}
      >
        {/* ── Pipeline SVG (≥1024px only) ── */}
        {showSideCards && pipeGeo && (
          <svg
            width={pipeGeo.width}
            height={pipeGeo.height}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }}
            aria-hidden
          >
            {/* Full horizontal background pipe */}
            <motion.path
              d={pipeGeo.fullPipePath}
              fill="none"
              stroke="var(--accent)"
              strokeOpacity={0.25}
              strokeWidth={2}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
            />

            {/* Left path — horizontal from center, then drop to card */}
            <motion.path
              d={pipeGeo.leftPath}
              fill="none"
              stroke="var(--accent)"
              strokeOpacity={0.7}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 0.7, ease: "easeInOut" }}
            />

            {/* Right path — mirror */}
            <motion.path
              d={pipeGeo.rightPath}
              fill="none"
              stroke="var(--accent)"
              strokeOpacity={0.7}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 0.7, ease: "easeInOut" }}
            />

            {/* Center origin dot */}
            <motion.circle
              cx={pipeGeo.cx}
              cy={pipeGeo.pipeY}
              r={4}
              fill="var(--accent)"
              fillOpacity={0.6}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.65, ease: "easeOut" }}
              style={{ transformOrigin: `${pipeGeo.cx}px ${pipeGeo.pipeY}px` }}
            />

            {/* T-junction joint dots */}
            {[pipeGeo.leftJoint, pipeGeo.rightJoint].map((j, i) => (
              <motion.circle
                key={`joint-${i}`}
                cx={j.x}
                cy={j.y}
                r={5}
                fill="var(--accent)"
                fillOpacity={0.9}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, delay: 1.1, ease: "easeOut" }}
                style={{ transformOrigin: `${j.x}px ${j.y}px` }}
              />
            ))}

            {/* End caps — small dot where pipe meets card top */}
            {[pipeGeo.leftCap, pipeGeo.rightCap].map((cap, i) => (
              <motion.circle
                key={`cap-${i}`}
                cx={cap.x}
                cy={cap.y}
                r={3}
                fill="var(--accent)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, delay: 1.5, ease: "easeOut" }}
                style={{ transformOrigin: `${cap.x}px ${cap.y}px` }}
              />
            ))}
          </svg>
        )}

        {/* ── Side cards (≥1024px) ── */}
        {showSideCards && (
          <>
            <motion.div
              className="hero-side-card hero-side-left"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.6, ease: "easeOut" }}
              style={{ position: "absolute", left: "clamp(24px, 8vw, 120px)", top: pipeGeo ? pipeGeo.leftCardTop : "50%", width: "240px", zIndex: 2 }}
            >
              <Link href="/parcels" style={{ textDecoration: "none", display: "block" }}>
                <motion.div
                  ref={leftCardRef}
                  whileHover={{ scale: 1.02 * cardScale }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ ...macCardStyle, transform: `scale(${cardScale})`, transformOrigin: "top left" }}
                >
                  <ParcelsCardBody />
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              className="hero-side-card hero-side-right"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.6, ease: "easeOut" }}
              style={{ position: "absolute", right: "clamp(24px, 8vw, 120px)", top: pipeGeo ? pipeGeo.rightCardTop : "55%", width: "240px", zIndex: 2 }}
            >
              <Link href="/tipper" style={{ textDecoration: "none", display: "block" }}>
                <motion.div
                  ref={rightCardRef}
                  whileHover={{ scale: 1.02 * cardScale }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ ...macCardStyle, transform: `scale(${cardScale})`, transformOrigin: "top right" }}
                >
                  <TipperCardBody />
                </motion.div>
              </Link>
            </motion.div>
          </>
        )}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "640px", width: "100%", padding: "0 24px" }}>
          <motion.div
            ref={centerRef}
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
        `}</style>
      </section>

      {/* ── Stacked cards (<1024px) ── */}
      {showMobileStacked && (
        <section style={{ padding: "48px 24px 24px", maxWidth: "560px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link href="/parcels" style={{ textDecoration: "none", display: "block" }}>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2, ease: "easeOut" }} style={macCardStyle}>
                <ParcelsCardBody />
              </motion.div>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <Link href="/tipper" style={{ textDecoration: "none", display: "block" }}>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2, ease: "easeOut" }} style={macCardStyle}>
                <TipperCardBody />
              </motion.div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* ── WHAT WE DO ── */}
      <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <GlassCard
          hover={false}
          style={{
            padding: "52px 44px",
            background: "rgba(245, 242, 236, 0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.68)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "40px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 56px)", color: "var(--text-primary)", marginBottom: "8px" }}>
              What we do.
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="what-we-do-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: "48px", alignItems: "start" }}
          >
          {/* ── Parcels column ── */}
          <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontSize: "32px" }}>📦</div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Nairobi &amp; Across Kenya
            </p>
            <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "28px", color: "var(--text-primary)", lineHeight: 1.15 }}>
              Parcel Delivery
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "Pickup from your door",
                "Delivered across Nairobi or any bus station countrywide",
                "Every delivery documented with photo proof and Mpesa receipt",
              ].map((b) => (
                <li key={b} style={{ display: "flex", gap: "10px", color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", lineHeight: 1.65 }}>
                  <span style={{ color: "var(--accent)", flexShrink: 0 }}>•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: "rgba(82, 72, 160, 0.08)", borderRadius: "999px", border: "1px solid rgba(82, 72, 160, 0.15)", alignSelf: "flex-start", marginTop: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-2)" }} />
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 600, color: "var(--accent-2)", letterSpacing: "0.08em", textTransform: "uppercase" }}>App Coming Soon</span>
            </div>
            <div style={{ marginTop: "8px" }}>
              <Button href="/parcels#download" variant="outline" size="md">Download App</Button>
            </div>
          </motion.div>

          {/* ── Divider ── */}
          <div className="what-we-do-divider" style={{ width: "1px", background: "var(--glass-border)", alignSelf: "stretch", minHeight: "300px" }} />

          {/* ── Tipper column ── */}
          <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontSize: "32px" }}>🚛</div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Western Kenya
            </p>
            <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "28px", color: "var(--text-primary)", lineHeight: 1.15 }}>
              Trucks Services
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "Sand, ballast, murram and hardcore",
                "Book online in under 5 minutes",
                "Pay deposit via Mpesa, truck dispatched same day",
              ].map((b) => (
                <li key={b} style={{ display: "flex", gap: "10px", color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", lineHeight: 1.65 }}>
                  <span style={{ color: "var(--accent)", flexShrink: 0 }}>•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: "rgba(22, 163, 74, 0.08)", borderRadius: "999px", border: "1px solid rgba(22, 163, 74, 0.18)", alignSelf: "flex-start", marginTop: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--status-live)" }} />
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 600, color: "var(--status-live)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Book Now</span>
            </div>
            <div style={{ marginTop: "8px" }}>
              <Button href="/tipper#booking" variant="primary" size="md">Book a Truck</Button>
            </div>
          </motion.div>
          </motion.div>
        </GlassCard>

        <style>{`
          @media (max-width: 768px) {
            .what-we-do-grid {
              grid-template-columns: 1fr !important;
              gap: 48px !important;
            }
            .what-we-do-divider {
              display: none !important;
            }
          }
        `}</style>
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
