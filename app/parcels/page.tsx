"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import LocationSearch, { LocationValue } from "@/components/LocationSearch";
import { fadeUp, staggerContainer } from "@/lib/animations";

// ─── constants ───────────────────────────────────────────────

const whatWeHandle = [
  { icon: "📦", title: "Parcels",          desc: "Picked up from your location, delivered to the receiver anywhere in Nairobi. Both parties notified throughout." },
  { icon: "🚌", title: "Bus Station Drops", desc: "We pick up your parcel, go to Easy Coach, Modern Coast, or Guardian, pay the shipping on your behalf, and send you the receipt." },
  { icon: "🏦", title: "Business Errands", desc: "Bank deposits, document runs, supplier pickups, government office visits. We handle it so you don't have to commute." },
  { icon: "🏪", title: "Stock Movement",   desc: "Moving goods between your shop, warehouse, or supplier within Nairobi. Same day or scheduled." },
];

const steps = [
  "Fill in the booking form or WhatsApp us",
  "Enter receiver details and parcel info",
  "Choose urgent, scheduled, or same day",
  "See your price and pay via Mpesa",
  "Your Packisher rider is assigned",
  "Receiver gets a WhatsApp notification on arrival",
];

// ─── shared styles ────────────────────────────────────────────

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

const FRAGILITY_LABELS: Record<string, string> = {
  not_fragile:      "Not Fragile",
  handle_with_care: "Handle with Care",
  fragile:          "Fragile",
  very_fragile:     "Very Fragile",
};

const revealVariants: Variants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

// ─── utility components ───────────────────────────────────────

function SummaryRow({ label, value, highlight, last }: { label: string; value: string; highlight?: boolean; last?: boolean }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", gap: "12px", padding: "8px 0",
      borderBottom: last ? "none" : "1px solid rgba(122,92,56,0.08)",
    }}>
      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.04em", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: highlight ? "#15803d" : "var(--text-primary)", fontWeight: highlight ? 600 : 500, textAlign: "right", wordBreak: "break-word" }}>
        {value}
      </span>
    </div>
  );
}

function QuoteCard({ price, distanceKm, runMessage, eligible, fetching }: {
  price: number | null;
  distanceKm: number | null;
  runMessage: string | null;
  eligible: boolean;
  fetching: boolean;
}) {
  if (!fetching && price === null) return null;

  return (
    <div style={{
      padding: "16px 20px",
      background: "rgba(122,92,56,0.06)",
      border: "1px solid rgba(122,92,56,0.18)",
      borderRadius: "12px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: runMessage ? "10px" : 0 }}>
        <div>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
            Estimated Cost
          </p>
          {fetching ? (
            <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "24px", color: "var(--text-muted)" }}>
              Calculating…
            </p>
          ) : (
            <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "24px", color: "#15803d" }}>
              KES {price?.toLocaleString() ?? "—"}
            </p>
          )}
        </div>
        {distanceKm !== null && !fetching && (
          <div style={{ padding: "6px 14px", background: "rgba(122,92,56,0.08)", border: "1px solid rgba(122,92,56,0.15)", borderRadius: "999px", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600, whiteSpace: "nowrap" }}>
            ~{distanceKm} km
          </div>
        )}
      </div>
      {runMessage && !fetching && (
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", color: eligible ? "var(--text-muted)" : "#b45309", fontWeight: eligible ? 400 : 600 }}>
          {eligible ? "" : "⚠ "}{runMessage}
        </p>
      )}
    </div>
  );
}

// ─── Timing tiles data ────────────────────────────────────────

const TIMING_TILES = [
  {
    id: "urgent" as const,
    icon: "⚡",
    label: "Urgent",
    badge: "1.8× rate",
    badgeBg: "rgba(217,119,6,0.12)",
    badgeColor: "#b45309",
    activeColor: "#d97706",
  },
  {
    id: "same_day" as const,
    icon: "🏃",
    label: "Same Day",
    badge: "Standard rate",
    badgeBg: "rgba(122,92,56,0.10)",
    badgeColor: "var(--accent)",
    activeColor: "var(--accent)",
  },
  {
    id: "scheduled" as const,
    icon: "📅",
    label: "Scheduled",
    badge: "0.85× rate",
    badgeBg: "rgba(22,163,74,0.10)",
    badgeColor: "#15803d",
    activeColor: "#16a34a",
  },
];

// ─── Main booking form ────────────────────────────────────────

function ParcelsBookingForm() {
  const [submitted,    setSubmitted]    = useState(false);
  const [reference,    setReference]    = useState("");
  const [runMessage,   setRunMessage]   = useState<string | null>(null);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError,  setSubmitError]  = useState("");
  const [notesExpanded, setNotesExpanded] = useState(false);

  // Contact
  const [senderName,    setSenderName]    = useState("");
  const [senderPhone,   setSenderPhone]   = useState("");
  const [receiverName,  setReceiverName]  = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  // Locations
  const [pickupLocation,  setPickupLocation]  = useState<LocationValue | null>(null);
  const [pickupNotes,     setPickupNotes]     = useState("");
  const [dropoffLocation, setDropoffLocation] = useState<LocationValue | null>(null);
  const [dropoffNotes,    setDropoffNotes]    = useState("");

  // Item
  const [itemDesc,       setItemDesc]       = useState("");
  const [fragility,      setFragility]      = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");

  // Vehicle + Timing
  const [vehicleType,   setVehicleType]   = useState<"boda" | "car">("boda");
  const [timing,        setTiming]        = useState<"urgent" | "same_day" | "scheduled" | "">("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredRun,  setPreferredRun]  = useState<"morning" | "evening" | "">("");

  // Additional notes
  const [notes, setNotes] = useState("");

  // Quote state — price and run info come from API, not config/rates
  const [distanceKm,    setDistanceKm]    = useState<number | null>(null);
  const [quotePrice,    setQuotePrice]    = useState<number | null>(null);
  const [quoteRunMsg,   setQuoteRunMsg]   = useState<string | null>(null);
  const [eligible,      setEligible]      = useState(true);
  const [quoteFetching, setQuoteFetching] = useState(false);

  // Progressive reveal
  const showDropoff         = !!pickupLocation?.address;
  const showVehicleTiming   = showDropoff && !!dropoffLocation?.address;
  const showItemDetails     = showVehicleTiming;
  const showReceiverSection = showItemDetails && !!itemDesc.trim() && !!fragility;

  const canSubmit =
    !!senderName.trim() &&
    !!senderPhone.trim() &&
    !!receiverName.trim() &&
    !!receiverPhone.trim() &&
    !!pickupLocation?.address &&
    !!dropoffLocation?.address &&
    !!itemDesc.trim() &&
    !!fragility &&
    !!timing &&
    eligible &&
    (timing !== "scheduled" || (!!preferredDate && !!preferredRun));

  // Fetch quote — runs whenever locations, timing, or vehicleType change
  useEffect(() => {
    if (!pickupLocation || !dropoffLocation) {
      setDistanceKm(null);
      setQuotePrice(null);
      setQuoteRunMsg(null);
      setEligible(true);
      return;
    }
    if (!timing) return;

    setQuoteFetching(true);
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          pickupLat:   String(pickupLocation.lat),
          pickupLng:   String(pickupLocation.lng),
          dropoffLat:  String(dropoffLocation.lat),
          dropoffLng:  String(dropoffLocation.lng),
          timing,
          vehicleType,
          service:     "parcels",
        });
        const res  = await fetch(`/api/quote?${params}`);
        const data = await res.json();
        if (res.ok) {
          setDistanceKm(typeof data.distanceKm === "number" ? data.distanceKm : null);
          setQuotePrice(typeof data.price      === "number" ? data.price      : null);
          setQuoteRunMsg(data.runMessage ?? null);
          setEligible(data.eligible ?? true);
        }
      } catch {
        // Non-fatal
      } finally {
        setQuoteFetching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupLocation?.lat, pickupLocation?.lng, dropoffLocation?.lat, dropoffLocation?.lng, timing, vehicleType]);

  const handleConfirmedSubmit = async () => {
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings/parcels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_name:      senderName,
          sender_phone:     senderPhone,
          receiver_name:    receiverName,
          receiver_phone:   receiverPhone,
          pickup_address:   pickupLocation!.address,
          pickup_lat:       pickupLocation!.lat,
          pickup_lng:       pickupLocation!.lng,
          pickup_notes:     pickupNotes  || undefined,
          dropoff_address:  dropoffLocation!.address,
          dropoff_lat:      dropoffLocation!.lat,
          dropoff_lng:      dropoffLocation!.lng,
          dropoff_notes:    dropoffNotes || undefined,
          item_description: itemDesc,
          fragility,
          estimated_value:  estimatedValue ? parseFloat(estimatedValue) : undefined,
          vehicle_type:     vehicleType,
          timing,
          preferred_date:   timing === "scheduled" ? preferredDate : undefined,
          preferred_run:    timing === "scheduled" ? preferredRun  : undefined,
          additional_notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmitError(data.message ?? "Something went wrong. Please try again.");
        return;
      }
      setReference(data.reference);
      setRunMessage(data.runMessage ?? null);
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success ───────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(122,92,56,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="5 12 10 17 19 7" />
          </svg>
        </div>
        <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--text-primary)", marginBottom: "8px" }}>
          Booking confirmed.
        </p>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", color: "var(--accent)", fontWeight: 700, marginBottom: "8px" }}>
          Reference: {reference}
        </p>
        {runMessage && (
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
            {runMessage}
          </p>
        )}
        <p style={{ fontFamily: "var(--font-inter), sans-serif", color: "var(--text-secondary)", fontSize: "15px", lineHeight: 1.6, marginBottom: "20px" }}>
          We will confirm via WhatsApp within 15 minutes.
        </p>
        <a
          href="https://wa.me/254141005375"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--accent)", fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}
        >
          WhatsApp us directly →
        </a>
      </div>
    );
  }

  // ── Confirmation step ─────────────────────────────────────
  if (showConfirm) {
    const timingLabel =
      timing === "urgent"   ? "Urgent" :
      timing === "same_day" ? "Same Day" :
      timing === "scheduled" ? `Scheduled · ${preferredDate}` : timing;

    const runLabel =
      timing === "scheduled" && preferredRun ? preferredRun.charAt(0).toUpperCase() + preferredRun.slice(1) + " run" :
      quoteRunMsg ?? "—";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--text-primary)", marginBottom: "4px" }}>
            Review your booking.
          </p>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", color: "var(--text-muted)" }}>
            Check the details below before confirming.
          </p>
        </div>

        <div style={{ background: "rgba(245,242,236,0.7)", border: "1px solid var(--glass-border)", borderRadius: "12px", padding: "16px 20px" }}>
          <SummaryRow label="Service"  value={`Parcel Delivery — ${vehicleType === "boda" ? "Boda" : "Car"}`} />
          <SummaryRow label="Pickup"   value={pickupLocation?.address ?? "—"} />
          {pickupNotes  && <SummaryRow label=""         value={pickupNotes} />}
          <SummaryRow label="Drop-off" value={dropoffLocation?.address ?? "—"} />
          {dropoffNotes && <SummaryRow label=""         value={dropoffNotes} />}
          {distanceKm !== null && <SummaryRow label="Distance" value={`~${distanceKm} km`} />}
          <SummaryRow label="Item"     value={`${itemDesc} · ${FRAGILITY_LABELS[fragility] ?? fragility}`} />
          <SummaryRow label="Timing"   value={timingLabel} />
          <SummaryRow label="Run"      value={runLabel} />
          {quotePrice !== null && (
            <SummaryRow label="Total"  value={`KES ${quotePrice.toLocaleString()}`} highlight last />
          )}
        </div>

        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ padding: "14px 18px", background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.2)", borderLeft: "3px solid #c0392b", borderRadius: "var(--radius-sm)" }}
            >
              <p style={{ color: "#c0392b", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px" }}>
                {submitError}{" "}
                <a href="https://wa.me/254141005375" target="_blank" rel="noopener noreferrer" style={{ color: "#c0392b", fontWeight: 700 }}>
                  WhatsApp us directly.
                </a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleConfirmedSubmit}
            disabled={isSubmitting}
            style={{ flex: 1, background: isSubmitting ? "rgba(122,92,56,0.4)" : "var(--accent)", color: "var(--bg)", border: "none", borderRadius: "var(--radius-sm)", padding: "14px 28px", fontFamily: "var(--font-inter), sans-serif", fontWeight: 700, fontSize: "15px", cursor: isSubmitting ? "not-allowed" : "pointer", minHeight: "48px", transition: "all 0.2s ease" }}
          >
            {isSubmitting ? "Confirming…" : "Confirm & Book"}
          </button>
          <button
            type="button"
            onClick={() => { setShowConfirm(false); setSubmitError(""); }}
            disabled={isSubmitting}
            style={{ background: "transparent", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", padding: "14px 20px", fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: "15px", color: "var(--text-secondary)", cursor: "pointer", minHeight: "48px", whiteSpace: "nowrap" }}
          >
            ← Edit
          </button>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (canSubmit) setShowConfirm(true); }}
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      {/* Sender — always visible */}
      <div>
        <p style={sectionLabelStyle}>Sender</p>
        <div className="parcels-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input required value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Jane Wanjiku" style={fieldStyle} autoComplete="name" />
          </div>
          <div>
            <label style={labelStyle}>Phone / WhatsApp *</label>
            <input required value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} placeholder="+254 700 000 000" inputMode="tel" style={fieldStyle} autoComplete="tel" />
          </div>
        </div>
      </div>

      {/* Pickup — always visible */}
      <div>
        <p style={sectionLabelStyle}>Pickup Location</p>
        <LocationSearch value={pickupLocation} onChange={setPickupLocation} placeholder="Search pickup address…" notesValue={pickupNotes} onNotesChange={setPickupNotes} notesPlaceholder="e.g. 2nd floor, main entrance, next to KFC" />
      </div>

      {/* Drop-off — after pickup */}
      <AnimatePresence>
        {showDropoff && (
          <motion.div key="dropoff" variants={revealVariants} initial="hidden" animate="visible" exit="exit">
            <p style={sectionLabelStyle}>Drop-off Location</p>
            <LocationSearch value={dropoffLocation} onChange={setDropoffLocation} placeholder="Search drop-off address…" notesValue={dropoffNotes} onNotesChange={setDropoffNotes} notesPlaceholder="e.g. Gate B, call receiver on arrival, Westgate Mall" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vehicle type + Timing — after both locations */}
      <AnimatePresence>
        {showVehicleTiming && (
          <motion.div key="vehicle-timing" variants={revealVariants} initial="hidden" animate="visible" exit="exit" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Vehicle type toggle */}
            <div>
              <p style={sectionLabelStyle}>Vehicle Type</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {([
                  { id: "boda" as const, icon: "🏍️", label: "Boda", sub: "Motorbike — faster, lower cost" },
                  { id: "car"  as const, icon: "🚗", label: "Car",  sub: "For larger or fragile items" },
                ] as const).map((v) => {
                  const sel = vehicleType === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicleType(v.id)}
                      style={{ padding: "14px 16px", borderRadius: "12px", border: `${sel ? "2px" : "1px"} solid ${sel ? "var(--accent)" : "var(--glass-border)"}`, background: sel ? "rgba(122,92,56,0.06)" : "rgba(245,242,236,0.6)", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-inter), sans-serif", transition: "all 0.15s ease" }}
                    >
                      <span style={{ fontSize: "20px", display: "block", marginBottom: "6px" }} aria-hidden>{v.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)", display: "block", marginBottom: "2px" }}>{v.label}</span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{v.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timing tiles */}
            <div>
              <p style={sectionLabelStyle}>Timing</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {TIMING_TILES.map((t) => {
                  const sel = timing === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTiming(t.id);
                        if (t.id !== "scheduled") { setPreferredDate(""); setPreferredRun(""); }
                      }}
                      style={{ padding: "16px 20px", borderRadius: "12px", border: `${sel ? "2px" : "1px"} solid ${sel ? t.activeColor : "var(--glass-border)"}`, background: sel ? "rgba(122,92,56,0.06)" : "rgba(245,242,236,0.6)", cursor: "pointer", width: "100%", textAlign: "left", fontFamily: "var(--font-inter), sans-serif", transition: "all 0.15s ease" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: sel ? "10px" : 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "20px" }} aria-hidden>{t.icon}</span>
                          <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "17px", color: "var(--text-primary)" }}>{t.label}</span>
                        </div>
                        <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "999px", background: t.badgeBg, color: t.badgeColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.badge}</span>
                      </div>

                      {/* Urgent sub-content */}
                      {sel && t.id === "urgent" && (
                        <div>
                          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>
                            Within 1 hour
                          </p>
                          {quoteRunMsg ? (
                            <p style={{ fontSize: "12px", color: eligible ? "var(--text-muted)" : "#b45309", fontWeight: eligible ? 400 : 600 }}>
                              {eligible ? "" : "⚠ "}{quoteRunMsg}
                            </p>
                          ) : (
                            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>No delivery guarantee. Best effort basis.</p>
                          )}
                        </div>
                      )}

                      {/* Same Day sub-content */}
                      {sel && t.id === "same_day" && (
                        <div>
                          {quoteFetching ? (
                            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "var(--text-muted)" }}>Checking availability…</p>
                          ) : quoteRunMsg ? (
                            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: eligible ? "var(--text-primary)" : "#b45309", fontWeight: eligible ? 500 : 600 }}>
                              {eligible ? "✓ " : "⚠ "}{quoteRunMsg}
                            </p>
                          ) : null}
                        </div>
                      )}

                      {/* Scheduled sub-content */}
                      {sel && t.id === "scheduled" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} onClick={(e) => e.stopPropagation()}>
                          <div>
                            <label style={{ ...labelStyle, marginBottom: "6px" }}>Preferred Date</label>
                            <input
                              type="date"
                              value={preferredDate}
                              min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                              max={new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]}
                              onChange={(e) => setPreferredDate(e.target.value)}
                              style={{ ...fieldStyle, fontSize: "15px", maxWidth: "220px" }}
                            />
                            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                              Mon–Sat only, up to 2 weeks ahead. No Sundays.
                            </p>
                          </div>
                          <div>
                            <label style={{ ...labelStyle, marginBottom: "6px" }}>Run Preference</label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                              {(["morning", "evening"] as const).map((r) => {
                                const rSel = preferredRun === r;
                                return (
                                  <button
                                    key={r}
                                    type="button"
                                    onClick={() => setPreferredRun(r)}
                                    style={{ padding: "12px", borderRadius: "10px", border: `${rSel ? "2px" : "1px"} solid ${rSel ? "var(--accent)" : "var(--glass-border)"}`, background: rSel ? "rgba(122,92,56,0.08)" : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "var(--font-inter), sans-serif", textAlign: "center" }}
                                  >
                                    <span style={{ display: "block", fontSize: "18px", marginBottom: "4px" }} aria-hidden>{r === "morning" ? "🌅" : "🌆"}</span>
                                    <span style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-primary)", display: "block" }}>{r === "morning" ? "Morning" : "Evening"}</span>
                                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{r === "morning" ? "10:00am dispatch" : "5:30pm dispatch"}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote card — after both locations + timing */}
      <AnimatePresence>
        {showVehicleTiming && timing && (quoteFetching || quotePrice !== null) && (
          <motion.div key="quote" variants={revealVariants} initial="hidden" animate="visible" exit="exit">
            <QuoteCard
              price={quotePrice}
              distanceKm={distanceKm}
              runMessage={quoteRunMsg}
              eligible={eligible}
              fetching={quoteFetching}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item Details — after both locations */}
      <AnimatePresence>
        {showItemDetails && (
          <motion.div key="item-details" variants={revealVariants} initial="hidden" animate="visible" exit="exit">
            <p style={sectionLabelStyle}>Item Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Item Description *</label>
                <input required value={itemDesc} onChange={(e) => setItemDesc(e.target.value)} placeholder="e.g. A4 documents in an envelope" style={fieldStyle} />
              </div>
              <div className="parcels-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Fragility *</label>
                  <select required value={fragility} onChange={(e) => setFragility(e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>
                    <option value="" disabled>Select…</option>
                    <option value="not_fragile">Not Fragile</option>
                    <option value="handle_with_care">Handle with Care</option>
                    <option value="fragile">Fragile</option>
                    <option value="very_fragile">Very Fragile</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Est. Value (KES) <span style={{ opacity: 0.5, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                  <input value={estimatedValue} onChange={(e) => setEstimatedValue(e.target.value)} placeholder="e.g. 2500" inputMode="numeric" style={fieldStyle} />
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.55 }}>
                Items above KES 10,000 are carried at the sender&apos;s own risk. Packisher is not liable for loss or damage above this value.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receiver — after item details */}
      <AnimatePresence>
        {showReceiverSection && (
          <motion.div key="receiver" variants={revealVariants} initial="hidden" animate="visible" exit="exit">
            <p style={sectionLabelStyle}>Receiver</p>
            <div className="parcels-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input required value={receiverName} onChange={(e) => setReceiverName(e.target.value)} placeholder="Peter Kamau" style={fieldStyle} autoComplete="off" />
              </div>
              <div>
                <label style={labelStyle}>Phone / WhatsApp *</label>
                <input required value={receiverPhone} onChange={(e) => setReceiverPhone(e.target.value)} placeholder="+254 700 000 000" inputMode="tel" style={fieldStyle} autoComplete="off" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Eligibility warning */}
      <AnimatePresence>
        {!eligible && timing && (
          <motion.div key="ineligible" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: "14px 18px", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.25)", borderLeft: "3px solid #d97706", borderRadius: "var(--radius-sm)" }}
          >
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "#92400e", fontWeight: 600 }}>
              {quoteRunMsg ?? "This timing option is not available right now. Please choose another."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Additional notes */}
      <div>
        <button
          type="button"
          onClick={() => setNotesExpanded((v) => !v)}
          style={{ background: "none", border: "none", padding: 0, fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--accent)", cursor: "pointer", letterSpacing: "0.02em" }}
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
              <label style={labelStyle}>Additional Notes <span style={{ opacity: 0.5, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any other special instructions…" style={{ ...fieldStyle, resize: "vertical", minHeight: "96px" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit */}
      <AnimatePresence>
        {canSubmit && (
          <motion.div key="submit" variants={revealVariants} initial="hidden" animate="visible" exit="exit">
            <button
              type="submit"
              style={{ background: "var(--accent)", color: "var(--bg)", border: "none", borderRadius: "var(--radius-sm)", padding: "14px 28px", fontFamily: "var(--font-inter), sans-serif", fontWeight: 700, fontSize: "15px", cursor: "pointer", width: "100%", minHeight: "48px", letterSpacing: "0.02em", transition: "all 0.2s ease" }}
            >
              Review Booking
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", color: "var(--text-muted)", textAlign: "center" }}>
        Or{" "}
        <a href="https://wa.me/254141005375" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
          WhatsApp us directly
        </a>
      </p>

      <style>{`
        @media (max-width: 640px) {
          .parcels-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function ParcelsPage() {
  return (
    <div style={{ paddingTop: "96px", minHeight: "100vh" }}>
      {/* HERO */}
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

        {/* WHAT WE HANDLE */}
        <section style={{ marginBottom: "80px" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "40px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", color: "var(--text-primary)" }}>
              What we move.
            </h2>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
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

        {/* HOW IT WORKS */}
        <section style={{ marginBottom: "80px" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "40px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", color: "var(--text-primary)" }}>
              Six steps. Done.
            </h2>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp}>
                <GlassCard hover={false} style={{ padding: "20px 28px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                    <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "28px", color: "var(--accent)", lineHeight: 1, flexShrink: 0, minWidth: "32px" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", lineHeight: 1.6, paddingTop: "4px" }}>{step}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FOR BUSINESSES */}
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

        {/* BOOKING FORM */}
        <section id="booking" style={{ scrollMarginTop: "80px" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", color: "var(--text-primary)" }}>
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
