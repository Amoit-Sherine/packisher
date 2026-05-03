"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import ParcelsWaitlistForm from "@/components/ParcelsWaitlistForm";
import { fadeUp, staggerContainer } from "@/lib/animations";

const whatWeHandle = [
  {
    icon: "📦",
    title: "Parcels",
    desc: "Picked up from your location, delivered to the receiver anywhere in Nairobi. Both parties notified throughout.",
  },
  {
    icon: "🚌",
    title: "Bus Station Drops",
    desc: "We pick up your parcel, go to Easy Coach, Modern Coast, or Guardian, pay the shipping on your behalf, and send you the receipt.",
  },
  {
    icon: "🏦",
    title: "Business Errands",
    desc: "Bank deposits, document runs, supplier pickups, government office visits. We handle it so you don't have to commute.",
  },
  {
    icon: "🏪",
    title: "Stock Movement",
    desc: "Moving goods between your shop, warehouse, or supplier within Nairobi. Same day or scheduled.",
  },
];

const steps = [
  "Open the app and drop your pickup pin",
  "Enter receiver details and parcel info",
  "Choose urgent, scheduled, or same day",
  "See your price and pay via Mpesa",
  "Your Packisher rider is assigned",
  "Receiver gets a WhatsApp notification on arrival",
];

export default function ParcelsPage() {
  return (
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
              Packisher Parcels · Nairobi
            </motion.p>
            <motion.h1 variants={fadeUp} style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(40px, 6vw, 72px)", color: "var(--text-primary)", marginBottom: "20px", lineHeight: 1.05 }}>
              Your delivery.<br />
              <span style={{ color: "var(--accent)" }}>Handled.</span>
            </motion.h1>
            <motion.p variants={fadeUp} style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "17px", lineHeight: 1.7, marginBottom: "32px" }}>
              Parcels, errands, and bus station drops across Nairobi. Picked up, delivered, and documented by trained Packisher riders.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button href="#download" variant="primary" size="md">Download App</Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── WHAT WE HANDLE ── */}
        <section style={{ marginBottom: "80px" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "40px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", color: "var(--text-primary)", marginBottom: "8px" }}>
              What we move.
            </h2>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}
          >
            {whatWeHandle.map((item) => (
              <motion.div key={item.title} variants={fadeUp}>
                <GlassCard hover style={{ padding: "28px", height: "100%" }}>
                  <div style={{ fontSize: "28px", marginBottom: "14px" }}>{item.icon}</div>
                  <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--text-primary)", marginBottom: "8px" }}>{item.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.7 }}>{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ marginBottom: "80px" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "40px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", color: "var(--text-primary)", marginBottom: "8px" }}>
              Six steps. Done.
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

        {/* ── APP DOWNLOAD ── */}
        <section id="download" style={{ marginBottom: "80px", scrollMarginTop: "80px" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <GlassCard hover={false} style={{ padding: "48px" }}>
              <div className="app-download-inner" style={{ display: "flex", alignItems: "center", gap: "48px" }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 42px)", color: "var(--text-primary)", marginBottom: "16px" }}>
                    Download Packisher Parcels.
                  </h2>
                  <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", lineHeight: 1.7, marginBottom: "24px" }}>
                    Available on Android and iOS. Scan the QR code on desktop or join the waitlist to be notified at launch.
                  </p>
                  <div className="mobile-waitlist-btn">
                    <Button href="#waitlist" variant="primary" size="md">Join the Waitlist</Button>
                  </div>
                </div>

                {/* QR code — desktop only */}
                <div className="qr-desktop-block" style={{ flexShrink: 0, textAlign: "center" }}>
                  <div style={{ width: "160px", height: "160px", background: "white", borderRadius: "12px", border: "1px solid var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", margin: "0 auto 12px" }}>
                    <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="10" y="10" width="40" height="40" rx="4" fill="#1A1814"/>
                      <rect x="16" y="16" width="28" height="28" rx="2" fill="white"/>
                      <rect x="22" y="22" width="16" height="16" rx="1" fill="#1A1814"/>
                      <rect x="90" y="10" width="40" height="40" rx="4" fill="#1A1814"/>
                      <rect x="96" y="16" width="28" height="28" rx="2" fill="white"/>
                      <rect x="102" y="22" width="16" height="16" rx="1" fill="#1A1814"/>
                      <rect x="10" y="90" width="40" height="40" rx="4" fill="#1A1814"/>
                      <rect x="16" y="96" width="28" height="28" rx="2" fill="white"/>
                      <rect x="22" y="102" width="16" height="16" rx="1" fill="#1A1814"/>
                      {[60,66,72,78,84].map((x) => [60,66,72,78,84].map((y) => (
                        Math.sin(x * y) > 0.2 ? <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" fill="#1A1814"/> : null
                      )))}
                      {[56,62,68,74,80,86,92,98,104,110,116].map((x) => [56,62,68,74,80,86,92,98,104,110,116].map((y) => (
                        (x < 50 || x > 80 || y < 50 || y > 80) && Math.cos(x + y) > 0.3 ? <rect key={`d${x}-${y}`} x={x} y={y} width="4" height="4" fill="#1A1814"/> : null
                      )))}
                      <rect x="58" y="58" width="24" height="24" rx="4" fill="white" stroke="#1A1814" strokeWidth="1.5"/>
                      <text x="65" y="75" fontFamily="serif" fontWeight="bold" fontSize="16" fill="#1A1814">P</text>
                    </svg>
                  </div>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.06em" }}>Scan to join waitlist</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
          <style>{`
            .mobile-waitlist-btn { display: none; }
            @media (max-width: 640px) {
              .app-download-inner { flex-direction: column !important; }
              .qr-desktop-block { display: none !important; }
              .mobile-waitlist-btn { display: block !important; }
            }
          `}</style>
        </section>

        {/* ── FOR BUSINESSES ── */}
        <section style={{ marginBottom: "80px" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <GlassCard hover style={{ padding: "40px 44px" }}>
              <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", color: "var(--text-primary)", marginBottom: "16px" }}>
                Sending regularly?
              </h2>
              <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", lineHeight: 1.75, marginBottom: "28px", maxWidth: "600px" }}>
                Instagram boutiques, hardware shops, pharmacies, and Jumia sellers use Packisher Parcels as their logistics team. Business accounts include monthly invoicing, priority dispatch, and a dedicated operations contact.
              </p>
              <Button href="/contact?enquiry=business-account" variant="outline" size="md">
                Enquire About a Business Account
              </Button>
            </GlassCard>
          </motion.div>
        </section>

        {/* ── WAITLIST FORM ── */}
        <section id="waitlist" style={{ scrollMarginTop: "80px" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", color: "var(--text-primary)", marginBottom: "12px" }}>
              Be first when we launch.
            </h2>
            <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", lineHeight: 1.6 }}>
              Drop your details and we will notify you the moment Packisher Parcels goes live in your area.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <GlassCard hover={false} style={{ padding: "36px" }}>
              <ParcelsWaitlistForm />
            </GlassCard>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
