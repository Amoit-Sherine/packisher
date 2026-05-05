"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import MapPinDrop, { LocationValue } from "@/components/MapPinDrop";

const MATERIALS = [
  { id: "Ballast", icon: "🪨", label: "Ballast" },
  { id: "River Sand", icon: "🏖️", label: "River Sand" },
  { id: "Plasta Sand", icon: "🏖️", label: "Plasta Sand" },
  { id: "Murram", icon: "🟤", label: "Murram" },
  { id: "Hardcore", icon: "💪", label: "Hardcore" },
  { id: "Topsoil", icon: "🌿", label: "Topsoil" },
] as const;

type MaterialId = (typeof MATERIALS)[number]["id"] | "Other";
type Urgency = "urgent" | "scheduled" | "flexible";
type TimeWindow = "morning" | "afternoon";

const STEPS = [
  { n: 1, label: "Material" },
  { n: 2, label: "Location" },
  { n: 3, label: "Schedule" },
  { n: 4, label: "Details" },
  { n: 5, label: "Confirm" },
];

const WK_BOUNDS = { sw: { lat: 0.0, lng: 33.5 }, ne: { lat: 1.8, lng: 35.5 } };
const BUSIA_CENTER = { lat: 0.4614, lng: 34.1117 };

const KE_PHONE_RE = /^(?:\+254|254|0)(7\d{8}|1\d{8})$/;

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

const inputStyle: React.CSSProperties = {
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
};

const errorStyle: React.CSSProperties = {
  color: "#c0392b",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "12px",
  marginTop: "6px",
};

function PrimaryButton({ children, disabled, onClick, type = "button" }: { children: React.ReactNode; disabled?: boolean; onClick?: () => void; type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        background: disabled ? "rgba(122,92,56,0.4)" : "var(--accent)",
        color: "var(--bg)",
        border: "none",
        borderRadius: "var(--radius-sm)",
        padding: "14px 28px",
        fontFamily: "var(--font-inter), sans-serif",
        fontWeight: 700,
        fontSize: "15px",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        width: "100%",
        minHeight: "48px",
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </button>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        color: "var(--text-muted)",
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: "14px",
        cursor: "pointer",
        padding: "8px 0",
        marginBottom: "16px",
        alignSelf: "flex-start",
      }}
    >
      ← Back
    </button>
  );
}

function ProgressIndicator({ current }: { current: number }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      {/* Mobile: simple text + bar */}
      <div className="progress-mobile" style={{ display: "none" }}>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
          Step {current} of {STEPS.length} · {STEPS[current - 1]?.label}
        </p>
        <div style={{ height: "4px", background: "rgba(122,92,56,0.15)", borderRadius: "999px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(current / STEPS.length) * 100}%`, background: "var(--accent)", transition: "width 0.3s ease" }} />
        </div>
      </div>

      {/* Desktop: stepper */}
      <div className="progress-desktop" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {STEPS.map((s, i) => {
          const active = s.n === current;
          const completed = s.n < current;
          return (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: "8px", flex: i === STEPS.length - 1 ? "0 0 auto" : "1 1 0" }}>
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: active ? "var(--accent)" : completed ? "rgba(122,92,56,0.5)" : "transparent",
                  border: `2px solid ${active || completed ? "var(--accent)" : "var(--glass-border)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: active || completed ? "var(--bg)" : "var(--text-muted)",
                  fontSize: "12px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {completed ? "✓" : s.n}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "13px",
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--accent)" : "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />}
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .progress-mobile { display: block !important; }
          .progress-desktop { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── Step 1: Material + quantity ──────────────────────────────
function Step1({ material, quantity, otherMaterial, onChange, onOtherChange, onNext }: {
  material: MaterialId | null;
  quantity: number;
  otherMaterial: string;
  onChange: (m: MaterialId | null, q: number) => void;
  onOtherChange: (v: string) => void;
  onNext: () => void;
}) {
  const canNext = material !== null && (material !== "Other" || otherMaterial.trim().length > 0);

  return (
    <>
      <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "24px" }}>
        What do you need?
      </h2>

      <div style={{ marginBottom: material === "Other" ? "16px" : "32px" }}>
        <label style={labelStyle}>Material</label>
        <select
          value={material ?? ""}
          onChange={(e) => onChange((e.target.value || null) as MaterialId | null, quantity)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="" disabled>Select a material…</option>
          {MATERIALS.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
          <option value="Other">Other</option>
        </select>
      </div>

      {material === "Other" && (
        <div style={{ marginBottom: "32px" }}>
          <label style={labelStyle}>Describe your material</label>
          <input
            value={otherMaterial}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="e.g. Gravel, clay, aggregate…"
            style={inputStyle}
          />
        </div>
      )}

      <div style={{ marginBottom: "32px" }}>
        <label style={labelStyle}>Number of trucks</label>
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", marginBottom: "12px" }}>
          Each truck carries ~22 tonnes
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
          <button
            type="button"
            onClick={() => onChange(material, Math.max(1, quantity - 1))}
            aria-label="Decrease trucks"
            style={{ width: "48px", height: "48px", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "20px", color: "var(--accent)", fontWeight: 700 }}
          >
            −
          </button>
          <div style={{ minWidth: "72px", textAlign: "center", fontFamily: "var(--font-barlow), sans-serif", fontSize: "32px", fontWeight: 800, color: "var(--text-primary)" }}>
            {quantity}
          </div>
          <button
            type="button"
            onClick={() => onChange(material, Math.min(10, quantity + 1))}
            aria-label="Increase trucks"
            style={{ width: "48px", height: "48px", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "20px", color: "var(--accent)", fontWeight: 700 }}
          >
            +
          </button>
        </div>
      </div>

      <PrimaryButton disabled={!canNext} onClick={onNext}>Next →</PrimaryButton>
    </>
  );
}

// ── Step 2: Location with map ───────────────────────────────
function Step2({ value, onChange, onNext, onBack }: {
  value: { lat: number | null; lng: number | null; address: string };
  onChange: (v: { lat: number | null; lng: number | null; address: string }) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const locValue: LocationValue | null =
    value.lat !== null && value.lng !== null
      ? { lat: value.lat, lng: value.lng, address: value.address }
      : null;

  const handleChange = (v: LocationValue | null) => {
    onChange(v ? { lat: v.lat, lng: v.lng, address: v.address } : { lat: null, lng: null, address: "" });
  };

  return (
    <>
      <BackLink onClick={onBack} />
      <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "12px" }}>
        Where is your site?
      </h2>
      <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.6, marginBottom: "16px" }}>
        Drag the pin to your delivery location. We deliver across Western Kenya including Busia, Kakamega, Kisumu, Mumias and surrounding areas.
      </p>

      <MapPinDrop
        defaultCenter={BUSIA_CENTER}
        defaultZoom={10}
        value={locValue}
        onChange={handleChange}
        bounds={WK_BOUNDS}
        outOfBoundsMessage="We currently serve Western Kenya. Drag the pin within the highlighted area."
        height="300px"
      />

      <div style={{ marginTop: "20px" }}>
        <PrimaryButton disabled={!value.address} onClick={onNext}>Next →</PrimaryButton>
      </div>
    </>
  );
}

// ── Step 3: Schedule ────────────────────────────────────────
function Step3({ urgency, preferredDate, timeWindow, onChange, onNext, onBack }: {
  urgency: Urgency | null;
  preferredDate: string;
  timeWindow: TimeWindow | null;
  onChange: (v: { urgency: Urgency | null; preferredDate: string; timeWindow: TimeWindow | null }) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const tomorrow = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();

  const tiles: { id: Urgency; icon: string; title: string; body: string; badge: string; badgeBg: string; badgeColor: string; activeColor: string }[] = [
    { id: "urgent",    icon: "⚡", title: "Urgent",    body: "We will do our best to deliver same day. Next day delivery guaranteed. Priority handling fee applies.", badge: "Extra cost",     badgeBg: "rgba(217,119,6,0.12)",   badgeColor: "#b45309", activeColor: "#d97706" },
    { id: "scheduled", icon: "📅", title: "Scheduled", body: "Choose your preferred delivery date. Standard rate applies.",                                          badge: "Standard rate",  badgeBg: "rgba(122,92,56,0.10)",   badgeColor: "var(--accent)", activeColor: "var(--accent)" },
    { id: "flexible",  icon: "🗓️", title: "Flexible",  body: "Delivery within the week at a time that suits our schedule. Best rate available.",                    badge: "Best rate",      badgeBg: "rgba(22,163,74,0.10)",   badgeColor: "var(--status-live)", activeColor: "var(--status-live)" },
  ];

  const canNext = urgency !== null && timeWindow !== null && (urgency !== "scheduled" || preferredDate.length > 0);

  return (
    <>
      <BackLink onClick={onBack} />
      <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "20px" }}>
        When do you need it?
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
        {tiles.map((t) => {
          const selected = urgency === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange({ urgency: t.id, preferredDate: t.id === "scheduled" ? preferredDate : "", timeWindow })}
              style={{
                padding: "20px",
                borderRadius: "12px",
                border: `${selected ? "2px" : "1px"} solid ${selected ? t.activeColor : "var(--glass-border)"}`,
                background: selected ? "rgba(122,92,56,0.06)" : "rgba(245,242,236,0.6)",
                cursor: "pointer",
                minHeight: "88px",
                width: "100%",
                textAlign: "left",
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
                fontFamily: "var(--font-inter), sans-serif",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: "24px", flexShrink: 0 }} aria-hidden>{t.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--text-primary)" }}>{t.title}</span>
                  <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "999px", background: t.badgeBg, color: t.badgeColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.badge}</span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.55 }}>{t.body}</p>
              </div>
            </button>
          );
        })}
      </div>

      {urgency === "scheduled" && (
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Preferred date</label>
          <input
            type="date"
            min={tomorrow}
            value={preferredDate}
            onChange={(e) => onChange({ urgency, preferredDate: e.target.value, timeWindow })}
            style={inputStyle}
          />
        </div>
      )}

      {urgency && (
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Time window</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {(["morning", "afternoon"] as const).map((w) => {
              const selected = timeWindow === w;
              const icon = w === "morning" ? "🌅" : "☀️";
              const title = w === "morning" ? "Morning" : "Afternoon";
              const range = w === "morning" ? "7am to 11am" : "12pm to 4pm";
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => onChange({ urgency, preferredDate, timeWindow: w })}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border: selected ? "2px solid var(--accent)" : "1px solid var(--glass-border)",
                    background: selected ? "rgba(122,92,56,0.08)" : "rgba(245,242,236,0.6)",
                    cursor: "pointer",
                    fontFamily: "var(--font-inter), sans-serif",
                    minHeight: "76px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  <span style={{ fontSize: "20px" }} aria-hidden>{icon}</span>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>{title}</span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{range}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <PrimaryButton disabled={!canNext} onClick={onNext}>Next →</PrimaryButton>
    </>
  );
}

// ── Step 4: Details ─────────────────────────────────────────
function Step4({ summary, fullName, phone, email, notes, onChange, onSubmit, onBack, isSubmitting, errorMessage }: {
  summary: { material: string; quantity: number; address: string; scheduleSummary: string; timeWindowLabel: string };
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  onChange: (v: { fullName: string; phone: string; email: string; notes: string }) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  errorMessage: string;
}) {
  const [touched, setTouched] = useState({ fullName: false, phone: false, email: false });

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/[^\d+]/g, "");
    if (digits.startsWith("+254")) return digits.slice(0, 13);
    if (digits.startsWith("254")) return `+${digits}`.slice(0, 13);
    if (digits.startsWith("07") || digits.startsWith("01")) return `+254${digits.slice(1)}`.slice(0, 13);
    if (digits.startsWith("7") || digits.startsWith("1")) return `+254${digits}`.slice(0, 13);
    return digits.slice(0, 13);
  };

  const phoneValid = KE_PHONE_RE.test(phone.replace(/\s+/g, ""));
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const nameValid = fullName.trim().length >= 2;
  const allValid = phoneValid && emailValid && nameValid;

  return (
    <>
      <BackLink onClick={onBack} />
      <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "20px" }}>
        Almost done.
      </h2>

      <div style={{ background: "rgba(245,242,236,0.7)", border: "1px solid var(--glass-border)", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px" }}>
        <SummaryRow k="Material" v={summary.material} />
        <SummaryRow k="Trucks" v={String(summary.quantity)} />
        <SummaryRow k="Location" v={summary.address} />
        <SummaryRow k="Date" v={summary.scheduleSummary} />
        <SummaryRow k="Time" v={summary.timeWindowLabel} last />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (allValid && !isSubmitting) onSubmit(); }}
        style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "200px" }}
      >
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input
            value={fullName}
            onChange={(e) => onChange({ fullName: e.target.value, phone, email, notes })}
            onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
            placeholder="John Otieno"
            style={inputStyle}
            autoComplete="name"
          />
          {touched.fullName && !nameValid && <p style={errorStyle}>Please enter your full name</p>}
        </div>

        <div>
          <label style={labelStyle}>Phone / WhatsApp *</label>
          <input
            value={phone}
            onChange={(e) => onChange({ fullName, phone: formatPhone(e.target.value), email, notes })}
            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            placeholder="+254 700 000 000"
            inputMode="tel"
            style={inputStyle}
            autoComplete="tel"
          />
          {touched.phone && !phoneValid && <p style={errorStyle}>Please enter a valid Kenyan phone number</p>}
        </div>

        <div>
          <label style={labelStyle}>Email *</label>
          <input
            value={email}
            onChange={(e) => onChange({ fullName, phone, email: e.target.value, notes })}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="john@example.com"
            type="email"
            inputMode="email"
            style={inputStyle}
            autoComplete="email"
          />
          {touched.email && !emailValid && <p style={errorStyle}>Please enter a valid email address</p>}
        </div>

        <div>
          <label style={labelStyle}>Additional Notes <span style={{ opacity: 0.5, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
          <textarea
            value={notes}
            onChange={(e) => onChange({ fullName, phone, email, notes: e.target.value.slice(0, 500) })}
            placeholder="Site access instructions, landmarks, gate code…"
            style={{ ...inputStyle, resize: "vertical", minHeight: "96px", fontFamily: "var(--font-inter), sans-serif" }}
          />
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", color: "var(--text-muted)", marginTop: "6px", textAlign: "right" }}>
            {notes.length} / 500
          </p>
        </div>

        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ padding: "14px 18px", background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.2)", borderLeft: "3px solid #c0392b", borderRadius: "var(--radius-sm)" }}
            >
              <p style={{ color: "#c0392b", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px" }}>{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <PrimaryButton type="submit" disabled={!allValid || isSubmitting}>
          {isSubmitting ? "Submitting…" : "Submit Booking"}
        </PrimaryButton>
      </form>
    </>
  );
}

function SummaryRow({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "6px 0", borderBottom: last ? "none" : "1px solid rgba(122,92,56,0.08)" }}>
      <span style={{ color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.04em" }}>{k}</span>
      <span style={{ color: "var(--text-primary)", fontWeight: 500, textAlign: "right", maxWidth: "60%", wordBreak: "break-word" }}>{v}</span>
    </div>
  );
}

// ── Step 5: Confirmation ────────────────────────────────────
function Step5({ summary, reference, onReset }: {
  summary: { material: string; quantity: number; address: string; scheduleSummary: string; timeWindowLabel: string };
  reference: string;
  onReset: () => void;
}) {
  const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const waLink = waNum ? `https://wa.me/${waNum.replace(/\D/g, "")}` : "#";

  return (
    <div style={{ textAlign: "center" }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
        style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(122,92,56,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="5 12 10 17 19 7" />
        </svg>
      </motion.div>

      <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "24px" }}>
        Booking received.
      </h2>

      <div style={{ background: "rgba(245,242,236,0.7)", border: "1px solid var(--glass-border)", borderRadius: "12px", padding: "20px 24px", marginBottom: "24px", textAlign: "left", fontFamily: "var(--font-inter), sans-serif" }}>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px", textAlign: "center" }}>Packisher Trucks</p>
        <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "26px", color: "var(--accent)", textAlign: "center", marginBottom: "16px" }}>{reference}</p>
        <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "12px", fontSize: "13px" }}>
          <SummaryRow k="Material" v={summary.material} />
          <SummaryRow k="Trucks" v={String(summary.quantity)} />
          <SummaryRow k="Location" v={summary.address} />
          <SummaryRow k="Date" v={summary.scheduleSummary} />
          <SummaryRow k="Time" v={summary.timeWindowLabel} />
          <SummaryRow k="Status" v="Pending confirmation" last />
        </div>
      </div>

      <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", lineHeight: 1.6, marginBottom: "24px" }}>
        Our team will contact you on WhatsApp within 2 hours to confirm your booking and discuss payment.
      </p>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Packisher on WhatsApp"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          padding: "14px 22px",
          border: "1px solid var(--accent)",
          borderRadius: "var(--radius-sm)",
          color: "var(--accent)",
          textDecoration: "none",
          fontFamily: "var(--font-inter), sans-serif",
          fontWeight: 600,
          fontSize: "15px",
          minHeight: "48px",
          marginBottom: "20px",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.46 0 .12 5.34.12 11.92c0 2.1.55 4.16 1.6 5.97L0 24l6.27-1.65a11.9 11.9 0 0 0 5.77 1.47h.01c6.58 0 11.92-5.34 11.92-11.92 0-3.18-1.24-6.17-3.45-8.42zM12.05 21.8h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.72.98 1-3.62-.23-.37a9.83 9.83 0 0 1-1.51-5.28c0-5.45 4.43-9.88 9.88-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.43 9.87-9.88 9.87zm5.41-7.39c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.45 0 1.45 1.06 2.85 1.21 3.05.15.2 2.09 3.19 5.06 4.47.71.3 1.26.49 1.69.62.71.22 1.35.19 1.86.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
        </svg>
        Chat with us on WhatsApp
      </a>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
        <button
          type="button"
          onClick={onReset}
          style={{ background: "none", border: "none", color: "var(--accent)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer", padding: "8px" }}
        >
          Book another truck
        </button>
        <Link href="/" style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", textDecoration: "none", padding: "8px" }}>
          Back to home
        </Link>
      </div>
    </div>
  );
}

// ── Wizard root ─────────────────────────────────────────────
export default function TipperBookingWizard() {
  const [step, setStep] = useState(1);
  const [material, setMaterial] = useState<MaterialId | null>(null);
  const [otherMaterial, setOtherMaterial] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState<{ lat: number | null; lng: number | null; address: string }>({ lat: null, lng: null, address: "" });
  const [urgency, setUrgency] = useState<Urgency | null>(null);
  const [preferredDate, setPreferredDate] = useState("");
  const [timeWindow, setTimeWindow] = useState<TimeWindow | null>(null);
  const [details, setDetails] = useState({ fullName: "", phone: "", email: "", notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reference, setReference] = useState("");

  const scheduleSummary =
    urgency === "scheduled" && preferredDate
      ? preferredDate
      : urgency === "urgent"
      ? "Urgent"
      : urgency === "flexible"
      ? "Flexible"
      : "—";
  const timeWindowLabel = timeWindow === "morning" ? "Morning 7am–11am" : timeWindow === "afternoon" ? "Afternoon 12pm–4pm" : "—";

  const summary = {
    material: material === "Other" ? (otherMaterial || "Other") : (material ?? "—"),
    quantity,
    address: location.address || "—",
    scheduleSummary,
    timeWindowLabel,
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material: material === "Other" ? otherMaterial : material,
          quantity,
          deliveryLocation: location.address,
          deliveryLat: location.lat,
          deliveryLng: location.lng,
          urgency,
          preferredDate: urgency === "scheduled" ? preferredDate : undefined,
          timeWindow,
          fullName: details.fullName,
          phone: details.phone,
          email: details.email,
          notes: details.notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }
      setReference(data.bookingReference);
      setStep(5);
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1);
    setMaterial(null);
    setOtherMaterial("");
    setQuantity(1);
    setLocation({ lat: null, lng: null, address: "" });
    setUrgency(null);
    setPreferredDate("");
    setTimeWindow(null);
    setDetails({ fullName: "", phone: "", email: "", notes: "" });
    setErrorMessage("");
    setReference("");
  };

  return (
    <div style={{ maxWidth: "680px", width: "100%", margin: "0 auto", padding: "0 16px", display: "flex", flexDirection: "column" }}>
      <ProgressIndicator current={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          {step === 1 && (
            <Step1
              material={material}
              quantity={quantity}
              otherMaterial={otherMaterial}
              onChange={(m, q) => { setMaterial(m); setQuantity(q); }}
              onOtherChange={setOtherMaterial}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2
              value={location}
              onChange={setLocation}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Step3
              urgency={urgency}
              preferredDate={preferredDate}
              timeWindow={timeWindow}
              onChange={(v) => { setUrgency(v.urgency); setPreferredDate(v.preferredDate); setTimeWindow(v.timeWindow); }}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <Step4
              summary={summary}
              fullName={details.fullName}
              phone={details.phone}
              email={details.email}
              notes={details.notes}
              onChange={setDetails}
              onSubmit={handleSubmit}
              onBack={() => setStep(3)}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
            />
          )}
          {step === 5 && (
            <Step5 summary={summary} reference={reference} onReset={reset} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
