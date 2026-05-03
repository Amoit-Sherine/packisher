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
        <div style={{ display: "flex", gap: "3px" }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
        </div>
        <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", pointerEvents: "none" }}>
            PARCEL SERVICES→
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
        <div style={{ display: "flex", gap: "3px" }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
        </div>
        <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", pointerEvents: "none" }}>
            TRUCK SERVICES→
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

function MobilePipeCards({ isTablet }: { isTablet: boolean }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const parcelsRef = useRef<HTMLDivElement | null>(null);
  const tipperRef = useRef<HTMLDivElement | null>(null);

  const [geo, setGeo] = useState<null | {
    width: number;
    height: number;
    path: string;
    joints: { x: number; y: number }[];
    caps: { x: number; y: number }[];
    originDot: { x: number; y: number };
  }>(null);

  useEffect(() => {
    const compute = () => {
      const section = sectionRef.current;
      const parcels = parcelsRef.current;
      const tipper = tipperRef.current;
      if (!section || !parcels || !tipper) return;
      const s = section.getBoundingClientRect();
      const p = parcels.getBoundingClientRect();
      const t = tipper.getBoundingClientRect();

      if (isTablet) {
        // ── TABLET: center drop to arch, then split L/R into each card ──
        const cx = s.width / 2;
        const pipeStartY = 0;
        const leftCardCx = (p.left + p.right) / 2 - s.left;
        const rightCardCx = (t.left + t.right) / 2 - s.left;
        const leftCardTopY = p.top - s.top;
        const rightCardTopY = t.top - s.top;
        const archPeakY = leftCardTopY - 32;

        const tabletPath = [
          `M ${cx} ${pipeStartY}`,
          `L ${cx} ${archPeakY}`,
          `M ${cx} ${archPeakY}`,
          `L ${leftCardCx} ${archPeakY}`,
          `L ${leftCardCx} ${leftCardTopY}`,
          `M ${cx} ${archPeakY}`,
          `L ${rightCardCx} ${archPeakY}`,
          `L ${rightCardCx} ${rightCardTopY}`,
        ].join(" ");

        setGeo({
          width: s.width,
          height: Math.max(leftCardTopY, rightCardTopY) + 20,
          path: tabletPath,
          joints: [
            { x: cx, y: archPeakY },
            { x: leftCardCx, y: archPeakY },
            { x: rightCardCx, y: archPeakY },
          ],
          caps: [
            { x: leftCardCx, y: leftCardTopY },
            { x: rightCardCx, y: rightCardTopY },
          ],
          originDot: { x: cx, y: pipeStartY },
        });
      } else {
        // ── MOBILE: left-rail pipe with right branches into card title bars ──
        const railX = 18;
        const parcelsTopY = p.top - s.top;
        const tipperTopY = t.top - s.top;
        const tipperBottomY = t.bottom - s.top;
        const branch1Y = parcelsTopY + 16;
        const branch2Y = tipperTopY + 16;
        const cardLeft = p.left - s.left;

        const mobilePath = [
          `M ${s.width / 2} 0`,
          `L ${railX} 0`,
          `L ${railX} ${branch1Y}`,
          `L ${cardLeft} ${branch1Y}`,
          `M ${railX} ${branch1Y}`,
          `L ${railX} ${branch2Y}`,
          `L ${cardLeft} ${branch2Y}`,
          `M ${railX} ${branch2Y}`,
          `L ${railX} ${tipperBottomY + 32}`,
        ].join(" ");

        setGeo({
          width: s.width,
          height: tipperBottomY + 48,
          path: mobilePath,
          joints: [
            { x: railX, y: branch1Y },
            { x: railX, y: branch2Y },
          ],
          caps: [
            { x: cardLeft, y: branch1Y },
            { x: cardLeft, y: branch2Y },
            { x: railX, y: tipperBottomY + 32 },
          ],
          originDot: { x: s.width / 2, y: 0 },
        });
      }
    };

    const t = setTimeout(compute, 80);
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && sectionRef.current) {
      ro = new ResizeObserver(compute);
      ro.observe(sectionRef.current);
    }
    window.addEventListener("resize", compute);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", compute);
      ro?.disconnect();
    };
  }, [isTablet]);

  const sectionStyle: React.CSSProperties = isTablet
    ? {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        position: "relative",
        paddingTop: "52px",
        paddingLeft: "16px",
        paddingRight: "16px",
        maxWidth: "600px",
        margin: "40px auto 0",
        width: "100%",
        zIndex: 1,
        overflow: "visible",
      }
    : {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        position: "relative",
        paddingTop: "16px",
        paddingLeft: "0",
        paddingRight: "16px",
        maxWidth: "560px",
        marginLeft: "0",
        margin: "32px auto 0",
        width: "100%",
        zIndex: 1,
        overflow: "visible",
      };

  // Mobile-only card wrapper offset so the left rail is visible
  const cardWrapperExtra: React.CSSProperties = isTablet
    ? {}
    : {
        marginLeft: "40px",
        marginRight: "auto",
        width: "calc(100% - 56px)",
        maxWidth: "320px",
      };

  return (
    <section ref={sectionRef} style={sectionStyle}>
      {geo && (
        <motion.svg
          width={geo.width}
          height={geo.height}
          aria-hidden
          style={{ position: "absolute", top: 0, left: 0, zIndex: 0, pointerEvents: "none", overflow: "visible" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.path
            d={geo.path}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity={0.7}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          <motion.circle
            cx={geo.originDot.x}
            cy={geo.originDot.y}
            r={4}
            fill="var(--accent)"
            fillOpacity={0.6}
            variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
            transition={{ duration: 0.25, delay: 0.5, ease: "easeOut" }}
            style={{ transformOrigin: `${geo.originDot.x}px ${geo.originDot.y}px` }}
          />
          {geo.joints.map((j, i) => (
            <motion.circle
              key={`mjoint-${i}`}
              cx={j.x}
              cy={j.y}
              r={4}
              fill="var(--accent)"
              fillOpacity={0.85}
              variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
              transition={{ duration: 0.25, delay: 0.6 + i * 0.3, ease: "easeOut" }}
              style={{ transformOrigin: `${j.x}px ${j.y}px` }}
            />
          ))}
          {geo.caps.map((cap, i) => (
            <motion.circle
              key={`mcap-${i}`}
              cx={cap.x}
              cy={cap.y}
              r={3}
              fill="var(--accent)"
              variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
              transition={{ duration: 0.25, delay: 0.9 + i * 0.15, ease: "easeOut" }}
              style={{ transformOrigin: `${cap.x}px ${cap.y}px` }}
            />
          ))}
        </motion.svg>
      )}

      <motion.div
        ref={parcelsRef}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
        style={{ position: "relative", zIndex: 2, width: "100%", ...cardWrapperExtra }}
      >
        <Link
          href="/parcels"
          aria-label="Packisher Parcels — same day parcel delivery and courier service in Nairobi"
          style={{ textDecoration: "none", display: "block" }}
        >
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2, ease: "easeOut" }} style={{ ...macCardStyle, padding: 0 }}>
            <ParcelsCardBody />
          </motion.div>
        </Link>
      </motion.div>

      <motion.div
        ref={tipperRef}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, delay: 1.0, ease: "easeOut" }}
        style={{ position: "relative", zIndex: 2, width: "100%", ...cardWrapperExtra }}
      >
        <Link
          href="/tipper"
          aria-label="Packisher Tipper — construction material delivery and tipper truck hire in Western Kenya"
          style={{ textDecoration: "none", display: "block" }}
        >
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2, ease: "easeOut" }} style={{ ...macCardStyle, padding: 0 }}>
            <TipperCardBody />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}

export default function HomePage() {
  const downloadHref = useOsHref();
  const mode = useViewportMode();
  const showSideCards = mode === "desktop" || mode === "tablet-landscape";
  const showMobileStacked = mode === "tablet-portrait" || mode === "mobile";
  const cardScale = mode === "tablet-landscape" ? 0.85 : 1;
  const isMobile = mode === "mobile";
  const isTablet = mode === "tablet-portrait";

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

      const isTabletLandscape = heroWidth >= 1024 && heroWidth < 1280;

      // Pipe Y — just above headline vertical center
      const pipeY = (c.top - heroTop) + (c.height * 0.35);

      // Center origin X
      const cx = heroWidth / 2;

      // Drop points closer to center
      const spread = isTabletLandscape ? heroWidth * 0.32 : heroWidth * 0.28;
      const leftDropX = cx - spread;
      const rightDropX = cx + spread;

      // On tablet-landscape, place cards BELOW the entire hero content
      // block (no overlap possible). On desktop, keep them staggered
      // beside the hero glass.
      const heroContentBottom = (c.top - heroTop) + c.height;
      const leftCardTop = isTabletLandscape ? heroContentBottom + 40 : pipeY + 20;
      const rightCardTop = isTabletLandscape ? heroContentBottom + 80 : pipeY + 60;

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
        className="hero-section hero-section-root"
        style={{
          minHeight:
            mode === "tablet-landscape"
              ? "auto"
              : mode === "desktop"
              ? "100vh"
              : "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: (isTablet || isMobile) ? "flex-start" : "center",
          position: "relative",
          paddingTop: isMobile ? "100px" : isTablet ? "120px" : "64px",
          paddingBottom: mode === "tablet-landscape" ? "320px" : "0px",
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
              <Link
                href="/parcels"
                aria-label="Packisher Parcels — same day parcel delivery and courier service in Nairobi"
                style={{ textDecoration: "none", display: "block" }}
              >
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
              <Link
                href="/tipper"
                aria-label="Packisher Tipper — construction material delivery and tipper truck hire in Western Kenya"
                style={{ textDecoration: "none", display: "block" }}
              >
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
              padding: isMobile ? "36px 24px 32px" : isTablet ? "44px 36px" : "52px 44px",
              background: isMobile
                ? "rgba(245, 242, 236, 0.92)"
                : isTablet
                ? "rgba(245, 242, 236, 0.88)"
                : "rgba(245, 242, 236, 0.85)",
              backdropFilter: isMobile ? "blur(8px)" : "blur(16px)",
              WebkitBackdropFilter: isMobile ? "blur(8px)" : "blur(16px)",
              borderRadius: "var(--radius-lg)",
              border: isMobile
                ? "1px solid rgba(255,255,255,0.5)"
                : "1px solid rgba(255, 255, 255, 0.68)",
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

            {/* SEO: visually-hidden semantic content for indexing */}
            <span
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: 0,
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0,0,0,0)",
                whiteSpace: "nowrap",
                border: 0,
              }}
            >
              Packisher offers same day courier services, last mile parcel delivery, and errand services in Nairobi Kenya. We also provide tipper truck hire and construction material delivery including sand, ballast, and murram across Western Kenya and Busia County.
            </span>

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
                aria-label="Download the Packisher app for parcel delivery and courier services in Nairobi"
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

        {showSideCards && (
          <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", animation: "scrollBounce 2s ease-in-out infinite", color: "var(--text-muted)", zIndex: 1 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        )}

        <style>{`
          .download-app-btn:hover {
            background: rgba(122, 92, 56, 0.08) !important;
            box-shadow: 0 0 16px rgba(122, 92, 56, 0.12);
          }
          @media (max-width: 767px) {
            .hero-section-root .download-btn-wrap { margin-bottom: 0 !important; }
            .hero-section-root .download-app-btn { width: 100%; }
          }
        `}</style>
      </section>

      {/* ── Vertical pipe + two spouts (<1024px) ── */}
      {showMobileStacked && <MobilePipeCards isTablet={isTablet} />}

      {/* ── WHAT WE DO ── */}
      <section className="what-we-do-section" style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <GlassCard
          hover={false}
          className="what-we-do-card"
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
              Truck Services
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
              gap: 32px !important;
            }
            .what-we-do-divider {
              display: none !important;
            }
            .what-we-do-section {
              padding: 48px 16px !important;
              margin-top: 48px;
            }
            .what-we-do-card {
              padding: 28px 20px !important;
            }
          }
        `}</style>
      </section>

      {/* ── WHY PACKISHER ── */}
      <section className="built-different-section" style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
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
          className="built-different-grid"
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
              <GlassCard hover className="built-different-card" style={{ padding: "32px", height: "100%" }}>
                <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--text-primary)", marginBottom: "10px" }}>{item.title}</h3>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.6 }}>{item.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
        <style>{`
          @media (max-width: 767px) {
            .built-different-section { padding: 48px 16px !important; }
            .built-different-grid { gap: 16px !important; }
            .built-different-card { padding: 24px 20px !important; }
          }
        `}</style>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="footer-cta-section" style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto 40px" }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <GlassCard hover={false} className="footer-cta-card" style={{ padding: "60px 40px", textAlign: "center", background: "rgba(122, 92, 56, 0.03)", border: "1px solid rgba(122, 92, 56, 0.12)" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(32px, 5vw, 52px)", color: "var(--text-primary)", marginBottom: "16px" }}>
              Ready to move something?
            </h2>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginTop: "32px" }}>
              <Button
                href="/parcels"
                variant="outline"
                size="md"
                aria-label="Open Packisher Parcels — courier and parcel delivery in Nairobi"
              >
                Packisher Parcels
              </Button>
              <Button
                href="/tipper"
                variant="primary"
                size="md"
                aria-label="Book a tipper truck for construction material delivery in Western Kenya"
              >
                Book a Truck Service
              </Button>
            </div>
          </GlassCard>
        </motion.div>
        <style>{`
          @media (max-width: 767px) {
            .footer-cta-section { padding: 48px 16px 40px !important; }
            .footer-cta-card { padding: 36px 24px !important; }
          }
        `}</style>
      </section>
    </>
  );
}
