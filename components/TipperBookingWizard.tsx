"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import MapPinDrop, { LocationValue } from "@/components/MapPinDrop";

// ─────────────────────────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────────────────────────

type ServiceType  = "material_delivery" | "move_goods";
type PreferredTime = "morning" | "afternoon";
type LocationState = { lat: number | null; lng: number | null; address: string };

const AMAGORO_CENTER = { lat: 0.4936, lng: 34.0597 };
const WK_BOUNDS      = { sw: { lat: 0.0, lng: 33.5 }, ne: { lat: 1.8, lng: 35.5 } };
const KE_PHONE_RE    = /^(?:\+254|254|0)(7\d{8}|1\d{8})$/;
const EMPTY_LOC: LocationState = { lat: null, lng: null, address: "" };

const MATERIAL_GROUPS = [
  {
    group: "Construction",
    items: [
      { id: "river_sand",          label: "River Sand" },
      { id: "plasta_sand",         label: "Plasta Sand" },
      { id: "ballast_machine_cut", label: "Ballast (Machine Cut)" },
      { id: "ballast_manual_cut",  label: "Ballast (Manual Cut)" },
      { id: "murram",              label: "Murram" },
      { id: "hardcore",            label: "Hardcore" },
      { id: "topsoil",             label: "Topsoil" },
      { id: "building_stones",     label: "Building Stones" },
    ],
  },
  {
    group: "Agricultural",
    items: [
      { id: "sugarcane",     label: "Sugarcane" },
      { id: "maize_bulk",    label: "Maize (Bulk)" },
      { id: "other_produce", label: "Other Produce" },
    ],
  },
  {
    group: "Waste & Clearance",
    items: [
      { id: "construction_debris",  label: "Construction Debris" },
      { id: "soil_excavation",      label: "Soil Excavation" },
      { id: "land_clearing_waste",  label: "Land Clearing Waste" },
    ],
  },
  { group: "Other", items: [{ id: "other", label: "Other" }] },
] as const;

const MATERIAL_LABELS: Record<string, string> = Object.fromEntries(
  MATERIAL_GROUPS.flatMap((g) => g.items.map((i) => [i.id, i.label])),
);

const GOODS_OPTIONS = [
  { id: "sugarcane_factory",          label: "Sugarcane (to factory)" },
  { id: "maize_produce_market",       label: "Maize / Produce (to market)" },
  { id: "construction_debris",        label: "Construction Debris" },
  { id: "soil_excavation_waste",      label: "Soil / Excavation Waste" },
  { id: "sand_ballast_sourced",       label: "Sand or Ballast (already sourced)" },
  { id: "building_materials_sourced", label: "Building Materials (already sourced)" },
  { id: "other",                      label: "Other" },
] as const;

const GOODS_LABELS: Record<string, string> = Object.fromEntries(
  GOODS_OPTIONS.map((o) => [o.id, o.label]),
);

function getStepLabel(n: number, serviceType: ServiceType | null): string {
  const labels: Record<number, string> = {
    1: "Service",
    2: "Contact",
    3: serviceType === "move_goods" ? "Goods" : "Materials",
    4: "Location",
    5: "Schedule",
    6: "Confirm",
  };
  return labels[n] ?? "";
}

const STEP_COUNT = 6;

// ─────────────────────────────────────────────────────────────────
// Shared styles
// ─────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────
// Shared UI components
// ─────────────────────────────────────────────────────────────────

function PrimaryButton({ children, disabled, onClick, type = "button" }: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
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

function SummaryRow({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "6px 0", borderBottom: last ? "none" : "1px solid rgba(122,92,56,0.08)" }}>
      <span style={{ color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.04em", flexShrink: 0 }}>{k}</span>
      <span style={{ color: "var(--text-primary)", fontWeight: 500, textAlign: "right", maxWidth: "65%", wordBreak: "break-word" }}>{v}</span>
    </div>
  );
}

function ProgressIndicator({ current, serviceType }: { current: number; serviceType: ServiceType | null }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <div className="progress-mobile" style={{ display: "none" }}>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
          Step {current} of {STEP_COUNT} · {getStepLabel(current, serviceType)}
        </p>
        <div style={{ height: "4px", background: "rgba(122,92,56,0.15)", borderRadius: "999px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(current / STEP_COUNT) * 100}%`, background: "var(--accent)", transition: "width 0.3s ease" }} />
        </div>
      </div>
      <div className="progress-desktop" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {Array.from({ length: STEP_COUNT }, (_, i) => i + 1).map((n, i) => {
          const active    = n === current;
          const completed = n < current;
          const label     = getStepLabel(n, serviceType);
          return (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: "8px", flex: i === STEP_COUNT - 1 ? "0 0 auto" : "1 1 0" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: active ? "var(--accent)" : completed ? "rgba(122,92,56,0.5)" : "transparent", border: `2px solid ${active || completed ? "var(--accent)" : "var(--glass-border)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: active || completed ? "var(--bg)" : "var(--text-muted)", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>
                {completed ? "✓" : n}
              </div>
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", fontWeight: active ? 700 : 500, color: active ? "var(--accent)" : "var(--text-muted)", whiteSpace: "nowrap" }}>
                {label}
              </span>
              {i < STEP_COUNT - 1 && <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />}
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

function TruckCounter({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Decrease trucks"
        style={{ width: "48px", height: "48px", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "20px", color: "var(--accent)", fontWeight: 700 }}
      >−</button>
      <div style={{ minWidth: "72px", textAlign: "center", fontFamily: "var(--font-barlow), sans-serif", fontSize: "32px", fontWeight: 800, color: "var(--text-primary)" }}>
        {value}
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(10, value + 1))}
        aria-label="Increase trucks"
        style={{ width: "48px", height: "48px", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "20px", color: "var(--accent)", fontWeight: 700 }}
      >+</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Step 1 — Service type
// ─────────────────────────────────────────────────────────────────

function Step1({ value, onSelect }: {
  value: ServiceType | null;
  onSelect: (v: ServiceType) => void;
}) {
  const options: { id: ServiceType; icon: string; title: string; body: string }[] = [
    {
      id: "material_delivery",
      icon: "🏗️",
      title: "Deliver Materials to Me",
      body: "We source and deliver materials to your site",
    },
    {
      id: "move_goods",
      icon: "📦",
      title: "Move My Goods",
      body: "You have goods ready, we pick up and deliver to your destination",
    },
  ];

  return (
    <>
      <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "24px" }}>
        What do you need?
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              style={{
                padding: "24px",
                borderRadius: "12px",
                border: `${selected ? "2px" : "1px"} solid ${selected ? "var(--accent)" : "var(--glass-border)"}`,
                background: selected ? "rgba(122,92,56,0.06)" : "rgba(245,242,236,0.6)",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                fontFamily: "var(--font-inter), sans-serif",
                transition: "all 0.15s ease",
                width: "100%",
              }}
            >
              <span style={{ fontSize: "28px", flexShrink: 0 }} aria-hidden>{opt.icon}</span>
              <div>
                <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "18px", color: "var(--text-primary)", marginBottom: "6px" }}>
                  {opt.title}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.55 }}>
                  {opt.body}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Step 2 — Contact info
// ─────────────────────────────────────────────────────────────────

function Step2({ fullName, phone, email, onChange, onNext, onBack }: {
  fullName: string;
  phone: string;
  email: string;
  onChange: (v: { fullName: string; phone: string; email: string }) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [touched, setTouched] = useState({ fullName: false, phone: false });

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/[^\d+]/g, "");
    if (digits.startsWith("+254")) return digits.slice(0, 13);
    if (digits.startsWith("254"))  return `+${digits}`.slice(0, 13);
    if (digits.startsWith("07") || digits.startsWith("01")) return `+254${digits.slice(1)}`.slice(0, 13);
    if (digits.startsWith("7")  || digits.startsWith("1"))  return `+254${digits}`.slice(0, 13);
    return digits.slice(0, 13);
  };

  const nameValid  = fullName.trim().length >= 2;
  const phoneValid = KE_PHONE_RE.test(phone.replace(/\s+/g, ""));
  const canNext    = nameValid && phoneValid;

  return (
    <>
      <BackLink onClick={onBack} />
      <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "24px" }}>
        Your contact details.
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input
            value={fullName}
            onChange={(e) => onChange({ fullName: e.target.value, phone, email })}
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
            onChange={(e) => onChange({ fullName, phone: formatPhone(e.target.value), email })}
            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            placeholder="+254 700 000 000"
            inputMode="tel"
            style={inputStyle}
            autoComplete="tel"
          />
          {touched.phone && !phoneValid && <p style={errorStyle}>Please enter a valid Kenyan phone number</p>}
        </div>
        <div>
          <label style={labelStyle}>Email (optional — if you have one)</label>
          <input
            value={email}
            onChange={(e) => onChange({ fullName, phone, email: e.target.value })}
            placeholder="john@example.com"
            type="email"
            inputMode="email"
            style={inputStyle}
            autoComplete="email"
          />
        </div>
      </div>
      <PrimaryButton disabled={!canNext} onClick={onNext}>Next →</PrimaryButton>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Step 3 — Materials (material_delivery) or Goods (move_goods)
// ─────────────────────────────────────────────────────────────────

function Step3MaterialDelivery({ material, materialOther, quantityTrucks, onChange, onOtherChange, onQuantityChange, onNext, onBack }: {
  material: string;
  materialOther: string;
  quantityTrucks: number;
  onChange: (v: string) => void;
  onOtherChange: (v: string) => void;
  onQuantityChange: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canNext = material !== "" && (material !== "other" || materialOther.trim().length > 0);

  return (
    <>
      <BackLink onClick={onBack} />
      <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "24px" }}>
        What material do you need?
      </h2>

      <div style={{ marginBottom: material === "other" ? "16px" : "28px" }}>
        <label style={labelStyle}>Material *</label>
        <select
          value={material}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="" disabled>Select a material…</option>
          {MATERIAL_GROUPS.map((g) => (
            <optgroup key={g.group} label={g.group}>
              {g.items.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {material === "other" && (
        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>Describe the material *</label>
          <input
            value={materialOther}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="e.g. Gravel, clay, aggregate…"
            style={inputStyle}
          />
        </div>
      )}

      <div style={{ marginBottom: "32px" }}>
        <label style={labelStyle}>Number of trucks *</label>
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", marginBottom: "12px" }}>Each truck carries ~22 tonnes</p>
        <TruckCounter value={quantityTrucks} onChange={onQuantityChange} />
      </div>

      <PrimaryButton disabled={!canNext} onClick={onNext}>Next →</PrimaryButton>
    </>
  );
}

function Step3MoveGoods({ goodsType, goodsOther, quantityTrucks, onChange, onOtherChange, onQuantityChange, onNext, onBack }: {
  goodsType: string;
  goodsOther: string;
  quantityTrucks: number;
  onChange: (v: string) => void;
  onOtherChange: (v: string) => void;
  onQuantityChange: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canNext = goodsType !== "" && (goodsType !== "other" || goodsOther.trim().length > 0);

  return (
    <>
      <BackLink onClick={onBack} />
      <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "24px" }}>
        What are you moving?
      </h2>

      <div style={{ marginBottom: goodsType === "other" ? "16px" : "28px" }}>
        <label style={labelStyle}>Goods type *</label>
        <select
          value={goodsType}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="" disabled>Select what you are moving…</option>
          {GOODS_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      {goodsType === "other" && (
        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>Describe what you are moving *</label>
          <input
            value={goodsOther}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="e.g. Furniture, farm produce…"
            style={inputStyle}
          />
        </div>
      )}

      <div style={{ marginBottom: "32px" }}>
        <label style={labelStyle}>Number of trucks *</label>
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", marginBottom: "12px" }}>Each truck carries ~22 tonnes</p>
        <TruckCounter value={quantityTrucks} onChange={onQuantityChange} />
      </div>

      <PrimaryButton disabled={!canNext} onClick={onNext}>Next →</PrimaryButton>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Step 4 — Location
// ─────────────────────────────────────────────────────────────────

function LocationBlock({ label, sublabel, value, onChange, notes, onNotesChange }: {
  label: string;
  sublabel?: string;
  value: LocationState;
  onChange: (v: LocationState) => void;
  notes: string;
  onNotesChange: (v: string) => void;
}) {
  const locValue: LocationValue | null =
    value.lat !== null && value.lng !== null
      ? { lat: value.lat, lng: value.lng, address: value.address }
      : null;

  const handleChange = (v: LocationValue | null) =>
    onChange(v ? { lat: v.lat, lng: v.lng, address: v.address } : EMPTY_LOC);

  return (
    <div style={{ marginBottom: "24px" }}>
      <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", marginBottom: "6px" }}>
        {label}
      </p>
      {sublabel && (
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", lineHeight: 1.5, marginBottom: "12px" }}>
          {sublabel}
        </p>
      )}
      <MapPinDrop
        defaultCenter={AMAGORO_CENTER}
        defaultZoom={10}
        value={locValue}
        onChange={handleChange}
        bounds={WK_BOUNDS}
        outOfBoundsMessage="We currently serve Western Kenya. Drag the pin within the highlighted area."
        height="280px"
      />
      <div style={{ marginTop: "12px" }}>
        <label style={labelStyle}>Location notes <span style={{ opacity: 0.5, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
        <input
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Landmarks, gate code, access instructions…"
          style={inputStyle}
        />
      </div>
    </div>
  );
}

function Step4({ serviceType, deliveryLocation, deliveryNotes, pickupLocation, pickupNotes, dropoffLocation, dropoffNotes, onDeliveryChange, onDeliveryNotesChange, onPickupChange, onPickupNotesChange, onDropoffChange, onDropoffNotesChange, onNext, onBack }: {
  serviceType: ServiceType;
  deliveryLocation: LocationState;
  deliveryNotes: string;
  pickupLocation: LocationState;
  pickupNotes: string;
  dropoffLocation: LocationState;
  dropoffNotes: string;
  onDeliveryChange: (v: LocationState) => void;
  onDeliveryNotesChange: (v: string) => void;
  onPickupChange: (v: LocationState) => void;
  onPickupNotesChange: (v: string) => void;
  onDropoffChange: (v: LocationState) => void;
  onDropoffNotesChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canNext =
    serviceType === "material_delivery"
      ? !!deliveryLocation.address
      : !!pickupLocation.address && !!dropoffLocation.address;

  return (
    <>
      <BackLink onClick={onBack} />
      <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "24px" }}>
        {serviceType === "material_delivery" ? "Where should we deliver?" : "Where are we picking up and dropping off?"}
      </h2>

      {serviceType === "material_delivery" ? (
        <LocationBlock
          label="Delivery Location"
          sublabel="Drag the pin or tap the map to set your delivery site."
          value={deliveryLocation}
          onChange={onDeliveryChange}
          notes={deliveryNotes}
          onNotesChange={onDeliveryNotesChange}
        />
      ) : (
        <>
          <LocationBlock
            label="Pickup Location"
            sublabel="Where should we collect your goods?"
            value={pickupLocation}
            onChange={onPickupChange}
            notes={pickupNotes}
            onNotesChange={onPickupNotesChange}
          />
          <LocationBlock
            label="Dropoff Location"
            sublabel="Where should we deliver your goods?"
            value={dropoffLocation}
            onChange={onDropoffChange}
            notes={dropoffNotes}
            onNotesChange={onDropoffNotesChange}
          />
        </>
      )}

      <PrimaryButton disabled={!canNext} onClick={onNext}>Next →</PrimaryButton>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Step 5 — Schedule
// ─────────────────────────────────────────────────────────────────

function Step5({ preferredDate, preferredTime, additionalNotes, onChange, onNext, onBack }: {
  preferredDate: string;
  preferredTime: PreferredTime | null;
  additionalNotes: string;
  onChange: (v: { preferredDate: string; preferredTime: PreferredTime | null; additionalNotes: string }) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const tomorrow = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();

  const [dateTouched, setDateTouched] = useState(false);
  const dateIsValid  = preferredDate.length > 0 && new Date(preferredDate + "T00:00:00").getDay() !== 0;
  const canNext      = dateIsValid && preferredTime !== null;

  const timeOptions: { id: PreferredTime; icon: string; title: string; range: string }[] = [
    { id: "morning",   icon: "🌅", title: "Morning",   range: "7am – 12pm" },
    { id: "afternoon", icon: "☀️",  title: "Afternoon", range: "12pm – 5pm" },
  ];

  return (
    <>
      <BackLink onClick={onBack} />
      <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "24px" }}>
        When do you need it?
      </h2>

      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Preferred date * <span style={{ opacity: 0.5, fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: "11px" }}>(Mon – Sat)</span></label>
        <input
          type="date"
          min={tomorrow}
          value={preferredDate}
          onChange={(e) => {
            setDateTouched(true);
            onChange({ preferredDate: e.target.value, preferredTime, additionalNotes });
          }}
          onBlur={() => setDateTouched(true)}
          style={inputStyle}
        />
        {dateTouched && preferredDate && new Date(preferredDate + "T00:00:00").getDay() === 0 && (
          <p style={errorStyle}>Sundays are not available. Please choose Monday – Saturday.</p>
        )}
        {dateTouched && !preferredDate && (
          <p style={errorStyle}>Please select a date.</p>
        )}
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Preferred time *</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {timeOptions.map((opt) => {
            const selected = preferredTime === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ preferredDate, preferredTime: opt.id, additionalNotes })}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: selected ? "2px solid var(--accent)" : "1px solid var(--glass-border)",
                  background: selected ? "rgba(122,92,56,0.08)" : "rgba(245,242,236,0.6)",
                  cursor: "pointer",
                  fontFamily: "var(--font-inter), sans-serif",
                  minHeight: "80px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <span style={{ fontSize: "20px" }} aria-hidden>{opt.icon}</span>
                <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>{opt.title}</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{opt.range}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: "28px" }}>
        <label style={labelStyle}>Additional notes <span style={{ opacity: 0.5, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
        <textarea
          value={additionalNotes}
          onChange={(e) => onChange({ preferredDate, preferredTime, additionalNotes: e.target.value.slice(0, 500) })}
          placeholder="Any other details we should know…"
          style={{ ...inputStyle, resize: "vertical", minHeight: "96px" }}
        />
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", color: "var(--text-muted)", marginTop: "6px", textAlign: "right" }}>
          {additionalNotes.length} / 500
        </p>
      </div>

      <PrimaryButton disabled={!canNext} onClick={onNext}>Next →</PrimaryButton>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Step 6 — Confirm
// ─────────────────────────────────────────────────────────────────

interface ConfirmProps {
  serviceType: ServiceType;
  fullName: string;
  phone: string;
  email: string;
  material: string;
  materialOther: string;
  goodsType: string;
  goodsOther: string;
  quantityTrucks: number;
  deliveryLocation: LocationState;
  deliveryNotes: string;
  pickupLocation: LocationState;
  pickupNotes: string;
  dropoffLocation: LocationState;
  dropoffNotes: string;
  preferredDate: string;
  preferredTime: PreferredTime | null;
  additionalNotes: string;
  isSubmitting: boolean;
  errorMessage: string;
  onSubmit: () => void;
  onBack: () => void;
}

function Step6(props: ConfirmProps) {
  const { serviceType, fullName, phone, email, quantityTrucks, preferredDate, preferredTime, isSubmitting, errorMessage, onSubmit, onBack } = props;

  const timeLabel = preferredTime === "morning" ? "Morning (7am–12pm)" : preferredTime === "afternoon" ? "Afternoon (12pm–5pm)" : "—";

  const materialLabel =
    props.material === "other"
      ? (props.materialOther || "Other")
      : (MATERIAL_LABELS[props.material] ?? props.material) || "—";

  const goodsLabel =
    props.goodsType === "other"
      ? (props.goodsOther || "Other")
      : (GOODS_LABELS[props.goodsType] ?? props.goodsType) || "—";

  return (
    <>
      <BackLink onClick={onBack} />
      <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "8px" }}>
        Review your request.
      </h2>
      <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", marginBottom: "24px" }}>
        Check the details below before sending.
      </p>

      <div style={{ background: "rgba(245,242,236,0.7)", border: "1px solid var(--glass-border)", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px" }}>
        <SummaryRow k="Service" v={serviceType === "material_delivery" ? "Deliver Materials to Me" : "Move My Goods"} />
        <SummaryRow k="Name"    v={fullName} />
        <SummaryRow k="Phone"   v={phone} />
        {email && <SummaryRow k="Email" v={email} />}

        {serviceType === "material_delivery" ? (
          <>
            <SummaryRow k="Material" v={`${materialLabel} × ${quantityTrucks} truck${quantityTrucks > 1 ? "s" : ""}`} />
            <SummaryRow k="Delivery" v={props.deliveryLocation.address || "—"} />
            {props.deliveryNotes && <SummaryRow k="Location notes" v={props.deliveryNotes} />}
          </>
        ) : (
          <>
            <SummaryRow k="Goods"   v={`${goodsLabel} × ${quantityTrucks} truck${quantityTrucks > 1 ? "s" : ""}`} />
            <SummaryRow k="Pickup"  v={props.pickupLocation.address || "—"} />
            {props.pickupNotes && <SummaryRow k="Pickup notes" v={props.pickupNotes} />}
            <SummaryRow k="Dropoff" v={props.dropoffLocation.address || "—"} />
            {props.dropoffNotes && <SummaryRow k="Dropoff notes" v={props.dropoffNotes} />}
          </>
        )}

        <SummaryRow k="Date" v={preferredDate || "—"} />
        <SummaryRow k="Time" v={timeLabel} last={!props.additionalNotes} />
        {props.additionalNotes && <SummaryRow k="Notes" v={props.additionalNotes} last />}
      </div>

      <div style={{ background: "rgba(122,92,56,0.06)", border: "1px solid rgba(122,92,56,0.15)", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px" }}>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
          We will review your request and reach out via WhatsApp with a quote within 2 hours.
        </p>
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ padding: "14px 18px", background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.2)", borderLeft: "3px solid #c0392b", borderRadius: "var(--radius-sm)", marginBottom: "16px" }}
          >
            <p style={{ color: "#c0392b", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", margin: 0 }}>{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <PrimaryButton disabled={isSubmitting} onClick={onSubmit}>
        {isSubmitting ? "Sending…" : "Send Request"}
      </PrimaryButton>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Success screen
// ─────────────────────────────────────────────────────────────────

function SuccessScreen({ reference, phone, onReset }: {
  reference: string;
  phone: string;
  onReset: () => void;
}) {
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

      <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 36px)", color: "var(--text-primary)", marginBottom: "16px" }}>
        Request received.
      </h2>
      <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", lineHeight: 1.65, marginBottom: "28px" }}>
        We will reach out via WhatsApp within 2 hours.
      </p>

      <div style={{ background: "rgba(245,242,236,0.7)", border: "1px solid var(--glass-border)", borderRadius: "12px", padding: "20px 24px", marginBottom: "24px", fontFamily: "var(--font-inter), sans-serif" }}>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>Reference</p>
        <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "26px", color: "var(--accent)", marginBottom: "16px" }}>{reference}</p>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
          We will send your quote to WhatsApp number:<br />
          <strong style={{ color: "var(--text-primary)" }}>{phone}</strong>
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
        <button
          type="button"
          onClick={onReset}
          style={{ background: "none", border: "none", color: "var(--accent)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer", padding: "8px" }}
        >
          Submit another request
        </button>
        <Link href="/" style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", textDecoration: "none", padding: "8px" }}>
          Back to home
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Wizard root
// ─────────────────────────────────────────────────────────────────

export default function TipperBookingWizard() {
  const [step,           setStep]           = useState(1);
  const [submitted,      setSubmitted]      = useState(false);
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [errorMessage,   setErrorMessage]   = useState("");
  const [reference,      setReference]      = useState("");

  // Step 1
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);

  // Step 2
  const [fullName, setFullName] = useState("");
  const [phone,    setPhone]    = useState("");
  const [email,    setEmail]    = useState("");

  // Step 3 — material delivery
  const [material,      setMaterial]      = useState("");
  const [materialOther, setMaterialOther] = useState("");
  // Step 3 — move goods
  const [goodsType,     setGoodsType]     = useState("");
  const [goodsOther,    setGoodsOther]    = useState("");
  // Step 3 — shared
  const [quantityTrucks, setQuantityTrucks] = useState(1);

  // Step 4
  const [deliveryLocation,  setDeliveryLocation]  = useState<LocationState>(EMPTY_LOC);
  const [deliveryNotes,     setDeliveryNotes]     = useState("");
  const [pickupLocation,    setPickupLocation]    = useState<LocationState>(EMPTY_LOC);
  const [pickupNotes,       setPickupNotes]       = useState("");
  const [dropoffLocation,   setDropoffLocation]   = useState<LocationState>(EMPTY_LOC);
  const [dropoffNotes,      setDropoffNotes]      = useState("");

  // Step 5
  const [preferredDate,    setPreferredDate]    = useState("");
  const [preferredTime,    setPreferredTime]    = useState<PreferredTime | null>(null);
  const [additionalNotes,  setAdditionalNotes]  = useState("");

  const reset = () => {
    setStep(1); setSubmitted(false); setIsSubmitting(false);
    setErrorMessage(""); setReference(""); setServiceType(null);
    setFullName(""); setPhone(""); setEmail("");
    setMaterial(""); setMaterialOther("");
    setGoodsType(""); setGoodsOther("");
    setQuantityTrucks(1);
    setDeliveryLocation(EMPTY_LOC); setDeliveryNotes("");
    setPickupLocation(EMPTY_LOC); setPickupNotes("");
    setDropoffLocation(EMPTY_LOC); setDropoffNotes("");
    setPreferredDate(""); setPreferredTime(null); setAdditionalNotes("");
  };

  const handleSubmit = async () => {
    if (!serviceType) return;
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const base = {
        contact_name:    fullName,
        contact_phone:   phone,
        contact_email:   email || undefined,
        quantity_trucks: quantityTrucks,
        preferred_date:  preferredDate,
        preferred_time:  preferredTime!,
        additional_notes: additionalNotes || undefined,
      };

      const payload =
        serviceType === "material_delivery"
          ? {
              ...base,
              service_type:      "material_delivery" as const,
              material,
              material_other:    material === "other" ? materialOther : undefined,
              delivery_address:  deliveryLocation.address,
              delivery_lat:      deliveryLocation.lat!,
              delivery_lng:      deliveryLocation.lng!,
              delivery_notes:    deliveryNotes || undefined,
            }
          : {
              ...base,
              service_type:      "move_goods" as const,
              goods_type:        goodsType,
              goods_other:       goodsType === "other" ? goodsOther : undefined,
              pickup_address:    pickupLocation.address,
              pickup_lat:        pickupLocation.lat!,
              pickup_lng:        pickupLocation.lng!,
              pickup_notes:      pickupNotes || undefined,
              dropoff_address:   dropoffLocation.address,
              dropoff_lat:       dropoffLocation.lat!,
              dropoff_lng:       dropoffLocation.lng!,
              dropoff_notes:     dropoffNotes || undefined,
            };

      const res  = await fetch("/api/bookings/trucks", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message ?? "Something went wrong. Please try again or WhatsApp us directly.");
        return;
      }

      setReference(data.reference);
      setSubmitted(true);
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: "680px", width: "100%", margin: "0 auto", padding: "0 16px" }}>
        <SuccessScreen reference={reference} phone={phone} onReset={reset} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "680px", width: "100%", margin: "0 auto", padding: "0 16px", display: "flex", flexDirection: "column" }}>
      <ProgressIndicator current={step} serviceType={serviceType} />
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
              value={serviceType}
              onSelect={(v) => {
                setServiceType(v);
                setStep(2);
              }}
            />
          )}

          {step === 2 && (
            <Step2
              fullName={fullName}
              phone={phone}
              email={email}
              onChange={(v) => { setFullName(v.fullName); setPhone(v.phone); setEmail(v.email); }}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && serviceType === "material_delivery" && (
            <Step3MaterialDelivery
              material={material}
              materialOther={materialOther}
              quantityTrucks={quantityTrucks}
              onChange={setMaterial}
              onOtherChange={setMaterialOther}
              onQuantityChange={setQuantityTrucks}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}

          {step === 3 && serviceType === "move_goods" && (
            <Step3MoveGoods
              goodsType={goodsType}
              goodsOther={goodsOther}
              quantityTrucks={quantityTrucks}
              onChange={setGoodsType}
              onOtherChange={setGoodsOther}
              onQuantityChange={setQuantityTrucks}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && serviceType !== null && (
            <Step4
              serviceType={serviceType}
              deliveryLocation={deliveryLocation}
              deliveryNotes={deliveryNotes}
              pickupLocation={pickupLocation}
              pickupNotes={pickupNotes}
              dropoffLocation={dropoffLocation}
              dropoffNotes={dropoffNotes}
              onDeliveryChange={setDeliveryLocation}
              onDeliveryNotesChange={setDeliveryNotes}
              onPickupChange={setPickupLocation}
              onPickupNotesChange={setPickupNotes}
              onDropoffChange={setDropoffLocation}
              onDropoffNotesChange={setDropoffNotes}
              onNext={() => setStep(5)}
              onBack={() => setStep(3)}
            />
          )}

          {step === 5 && (
            <Step5
              preferredDate={preferredDate}
              preferredTime={preferredTime}
              additionalNotes={additionalNotes}
              onChange={(v) => { setPreferredDate(v.preferredDate); setPreferredTime(v.preferredTime); setAdditionalNotes(v.additionalNotes); }}
              onNext={() => setStep(6)}
              onBack={() => setStep(4)}
            />
          )}

          {step === 6 && serviceType !== null && (
            <Step6
              serviceType={serviceType}
              fullName={fullName}
              phone={phone}
              email={email}
              material={material}
              materialOther={materialOther}
              goodsType={goodsType}
              goodsOther={goodsOther}
              quantityTrucks={quantityTrucks}
              deliveryLocation={deliveryLocation}
              deliveryNotes={deliveryNotes}
              pickupLocation={pickupLocation}
              pickupNotes={pickupNotes}
              dropoffLocation={dropoffLocation}
              dropoffNotes={dropoffNotes}
              preferredDate={preferredDate}
              preferredTime={preferredTime}
              additionalNotes={additionalNotes}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              onSubmit={handleSubmit}
              onBack={() => setStep(5)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
