"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import LocationSearch, { LocationValue } from "@/components/LocationSearch";
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
  "Fill in the booking form or WhatsApp us",
  "Enter receiver details and parcel info",
  "Choose urgent, scheduled, or same day",
  "See your price and pay via Mpesa",
  "Your Packisher rider is assigned",
  "Receiver gets a WhatsApp notification on arrival",
];

const fieldStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.6)",
  border: "1px solid var(--glass-border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--text-primary)",
  padding: "12px 16px",
  width: "100%",
  outline: "none",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "16px",
  minHeight: "48px",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "var(--text-muted)",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "8px",
};

const sectionLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--text-muted)",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  paddingBottom: "10px",
  borderBottom: "1px solid var(--glass-border)",
  marginBottom: "16px",
};


const revealVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

function ParcelsBookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);

  // Contact
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  // Locations
  const [pickupLocation, setPickupLocation] = useState<LocationValue | null>(null);
  const [pickupNotes, setPickupNotes] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState<LocationValue | null>(null);
  const [dropoffNotes, setDropoffNotes] = useState("");

  // Item
  const [itemDesc, setItemDesc] = useState("");
  const [fragility, setFragility] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");

  // Delivery
  const [timing, setTiming] = useState("");
  const [notes, setNotes] = useState("");

  // Progressive reveal conditions
  const showDropoff = !!pickupLocation?.address;
  const showItemDetails = showDropoff && !!dropoffLocation?.address;
  const showReceiverTiming = showItemDetails && !!itemDesc.trim() && !!fragility;

  const canSubmit =
    senderName.trim() &&
    senderPhone.trim() &&
    receiverName.trim() &&
    receiverPhone.trim() &&
    pickupLocation?.address &&
    dropoffLocation?.address &&
    itemDesc.trim() &&
    fragility &&
    timing;

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(122,92,56,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="5 12 10 17 19 7" />
          </svg>
        </div>
        <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--text-primary)", marginBottom: "12px" }}>
          Booking received.
        </p>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.6 }}>
          We will confirm via WhatsApp within 15 minutes.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (canSubmit) setSubmitted(true); }}
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      {/* ── Sender ── always visible */}
      <div>
        <p style={sectionLabelStyle}>Sender</p>
        <div className="parcels-form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Jane Wanjiku"
              style={fieldStyle}
              autoComplete="name"
            />
          </div>
          <div>
            <label style={labelStyle}>Phone / WhatsApp *</label>
            <input
              required
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="+254 700 000 000"
              inputMode="tel"
              style={fieldStyle}
              autoComplete="tel"
            />
          </div>
        </div>
      </div>

      {/* ── Pickup Location ── always visible */}
      <div>
        <p style={sectionLabelStyle}>Pickup Location</p>
        <LocationSearch
          value={pickupLocation}
          onChange={setPickupLocation}
          placeholder="Search pickup address…"
          notesValue={pickupNotes}
          onNotesChange={setPickupNotes}
          notesPlaceholder="e.g. 2nd floor, use main entrance, next to KFC"
        />
      </div>

      {/* ── Drop-off Location ── revealed after pickup */}
      <AnimatePresence>
        {showDropoff && (
          <motion.div key="dropoff" variants={revealVariants} initial="hidden" animate="visible" exit="exit">
            <p style={sectionLabelStyle}>Drop-off Location</p>
            <LocationSearch
              value={dropoffLocation}
              onChange={setDropoffLocation}
              placeholder="Search drop-off address…"
              notesValue={dropoffNotes}
              onNotesChange={setDropoffNotes}
              notesPlaceholder="e.g. Gate B, call receiver on arrival, Westgate Mall"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Item Details ── revealed after drop-off */}
      <AnimatePresence>
        {showItemDetails && (
          <motion.div key="item-details" variants={revealVariants} initial="hidden" animate="visible" exit="exit">
            <p style={sectionLabelStyle}>Item Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Item Description *</label>
                <input
                  required
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="e.g. A4 documents in an envelope"
                  style={fieldStyle}
                />
              </div>
              <div className="parcels-form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Fragility *</label>
                  <select
                    required
                    value={fragility}
                    onChange={(e) => setFragility(e.target.value)}
                    style={{ ...fieldStyle, cursor: "pointer" }}
                  >
                    <option value="" disabled>Select…</option>
                    <option value="Not Fragile">Not Fragile</option>
                    <option value="Handle with Care">Handle with Care</option>
                    <option value="Fragile">Fragile</option>
                    <option value="Very Fragile">Very Fragile</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>
                    Estimated Value (KES){" "}
                    <span style={{ opacity: 0.5, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                  </label>
                  <input
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                    placeholder="e.g. 2500"
                    inputMode="numeric"
                    style={fieldStyle}
                  />
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.55, marginTop: "-4px" }}>
                Items above KES 10,000 are carried at the sender&apos;s own risk. Packisher is not liable for loss or damage above this value.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Receiver + Timing ── revealed after item details are filled */}
      <AnimatePresence>
        {showReceiverTiming && (
          <motion.div key="receiver-timing" variants={revealVariants} initial="hidden" animate="visible" exit="exit" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <p style={sectionLabelStyle}>Receiver</p>
              <div className="parcels-form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    required
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="Peter Kamau"
                    style={fieldStyle}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone / WhatsApp *</label>
                  <input
                    required
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    placeholder="+254 700 000 000"
                    inputMode="tel"
                    style={fieldStyle}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Timing *</label>
              <select
                required
                value={timing}
                onChange={(e) => setTiming(e.target.value)}
                style={{ ...fieldStyle, cursor: "pointer" }}
              >
                <option value="" disabled>Select timing…</option>
                <option value="Urgent">Urgent</option>
                <option value="Same Day">Same Day</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Additional Notes ── always visible, collapsed by default */}
      <div>
        <button
          type="button"
          onClick={() => setNotesExpanded((v) => !v)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--accent)",
            cursor: "pointer",
            letterSpacing: "0.02em",
          }}
        >
          {notesExpanded ? "— Hide special instructions" : "+ Add special instructions"}
        </button>
        <AnimatePresence>
          {notesExpanded && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <label style={labelStyle}>
                Additional Notes{" "}
                <span style={{ opacity: 0.5, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any other special instructions…"
                style={{ ...fieldStyle, resize: "vertical", minHeight: "96px" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Submit + WhatsApp ── button appears only when all required fields are complete */}
      <AnimatePresence>
        {canSubmit && (
          <motion.div key="submit" variants={revealVariants} initial="hidden" animate="visible" exit="exit">
            <button
              type="submit"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "14px 28px",
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                width: "100%",
                minHeight: "48px",
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
              }}
            >
              Request Pickup
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", color: "var(--text-muted)", textAlign: "center" }}>
        Or{" "}
        <a
          href="https://wa.me/254141005375"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
        >
          WhatsApp us directly
        </a>
      </p>

      <style>{`
        @media (max-width: 640px) {
          .parcels-form-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}

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
              <Button href="#booking" variant="primary" size="md">Book a Delivery</Button>
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

        {/* ── BOOKING FORM ── */}
        <section id="booking" style={{ scrollMarginTop: "80px" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", color: "var(--text-primary)", marginBottom: "12px" }}>
              Book a Delivery.
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <GlassCard hover={false} style={{ padding: "36px" }}>
              <ParcelsBookingForm />
            </GlassCard>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
