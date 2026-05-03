"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const MATERIALS = ["Ballast", "River Sand", "Plasta Sand", "Murram", "Hardcore", "Topsoil"] as const;
const QUANTITIES = ["1 Truck", "2 Trucks", "3 Trucks", "4+ Trucks"] as const;
const TIME_WINDOWS = ["Morning 7am to 11am", "Afternoon 12pm to 4pm"] as const;

const schema = z.object({
  material: z.enum(MATERIALS, { message: "Please select a material" }),
  quantity: z.enum(QUANTITIES, { message: "Please select a quantity" }),
  deliveryLocation: z.string().min(5, "Please enter a delivery location in Western Kenya"),
  preferredDate: z.string().min(1, "Please select a delivery date"),
  timeWindow: z.enum(TIME_WINDOWS, { message: "Please select a time window" }),
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(9, "Please enter a valid phone or WhatsApp number"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.55)",
  border: "1px solid var(--glass-border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--text-primary)",
  padding: "12px 16px",
  width: "100%",
  outline: "none",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "15px",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
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

const errorStyle: React.CSSProperties = {
  color: "#c0392b",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "12px",
  marginTop: "6px",
};

function LocationAutocomplete({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: string, lat?: number, lng?: number) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [localVal, setLocalVal] = useState(value);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMaps = () => {
      if (window.google?.maps?.places) {
        setMapsLoaded(true);
        return true;
      }
      return false;
    };

    if (checkMaps()) return;

    const interval = setInterval(() => {
      if (checkMaps()) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mapsLoaded || !inputRef.current || autocompleteRef.current) return;

    const westernKenyaBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-0.5, 33.8),
      new google.maps.LatLng(1.2, 35.0)
    );

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      bounds: westernKenyaBounds,
      strictBounds: false,
      componentRestrictions: { country: "ke" },
      types: ["geocode", "establishment"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current!.getPlace();
      if (place.formatted_address) {
        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();
        setLocalVal(place.formatted_address);
        onChange(place.formatted_address, lat, lng);
      }
    });
  }, [mapsLoaded, onChange]);

  return (
    <div>
      <label style={labelStyle}>Delivery Location (Western Kenya) *</label>
      <input
        ref={inputRef}
        value={localVal}
        onChange={(e) => {
          setLocalVal(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="e.g. Busia Town, Busia County"
        className="glass-input-field"
        style={inputStyle}
        autoComplete="off"
      />
      {!mapsLoaded && (
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", marginTop: "4px" }}>
          Type your delivery location in Western Kenya
        </p>
      )}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

export default function TipperBookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [locationLat, setLocationLat] = useState<number | undefined>();
  const [locationLng, setLocationLng] = useState<number | undefined>();

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleLocationChange = (val: string, lat?: number, lng?: number) => {
    setValue("deliveryLocation", val, { shouldValidate: true });
    if (lat !== undefined) setLocationLat(lat);
    if (lng !== undefined) setLocationLng(lng);
  };

  const locationValue = watch("deliveryLocation") ?? "";

  const onSubmit = async (data: FormData) => {
    setSubmitError("");
    try {
      const payload = { ...data, deliveryLat: locationLat, deliveryLng: locationLng };
      const res = await fetch("/api/tipper-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSubmitError(body.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    }
  };

  if (submitted) {
    return (
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <div
          style={{
            padding: "48px 32px",
            textAlign: "center",
            background: "rgba(34,197,94,0.05)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "16px" }}>✓</div>
          <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "24px", color: "var(--text-primary)", marginBottom: "12px" }}>
            Booking received.
          </h3>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", lineHeight: 1.6 }}>
            Check your phone for the Mpesa payment prompt to confirm your booking. We will send your driver&apos;s contact and ETA on WhatsApp.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Material Type *</label>
          <select {...register("material")} className="glass-input-field" style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}>
            <option value="">Select material…</option>
            {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.material && <p style={errorStyle}>{errors.material.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>Quantity *</label>
          <select {...register("quantity")} className="glass-input-field" style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}>
            <option value="">Select quantity…</option>
            {QUANTITIES.map((q) => <option key={q} value={q}>{q}</option>)}
          </select>
          {errors.quantity && <p style={errorStyle}>{errors.quantity.message}</p>}
        </div>
      </div>

      <LocationAutocomplete
        value={locationValue}
        onChange={handleLocationChange}
        error={errors.deliveryLocation?.message}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Preferred Delivery Date *</label>
          <input
            type="date"
            min={today}
            {...register("preferredDate")}
            className="glass-input-field"
            style={inputStyle}
          />
          {errors.preferredDate && <p style={errorStyle}>{errors.preferredDate.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>Preferred Time Window *</label>
          <select {...register("timeWindow")} className="glass-input-field" style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}>
            <option value="">Select time…</option>
            {TIME_WINDOWS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.timeWindow && <p style={errorStyle}>{errors.timeWindow.message}</p>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input {...register("fullName")} placeholder="John Otieno" className="glass-input-field" style={inputStyle} />
          {errors.fullName && <p style={errorStyle}>{errors.fullName.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>Phone / WhatsApp *</label>
          <input {...register("phone")} placeholder="+254 700 000 000" className="glass-input-field" style={inputStyle} />
          {errors.phone && <p style={errorStyle}>{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Additional Notes <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span></label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Site access instructions, landmarks, special requirements…"
          className="glass-input-field"
          style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
        />
      </div>

      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: "14px 18px",
              background: "rgba(192,57,43,0.06)",
              border: "1px solid rgba(192,57,43,0.2)",
              borderLeft: "3px solid #c0392b",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <p style={{ color: "#c0392b", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px" }}>{submitError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          background: isSubmitting ? "rgba(122, 92, 56, 0.5)" : "var(--accent)",
          color: "var(--bg)",
          border: "none",
          borderRadius: "var(--radius-sm)",
          padding: "14px 28px",
          fontFamily: "var(--font-inter), sans-serif",
          fontWeight: 700,
          fontSize: "15px",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          alignSelf: "flex-start",
        }}
      >
        {isSubmitting ? (
          <>
            <span style={{ width: "16px", height: "16px", border: "2px solid rgba(245,242,236,0.3)", borderTop: "2px solid var(--bg)", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
            Submitting…
          </>
        ) : (
          "Get Quote and Book"
        )}
      </button>

      <style>{`
        .glass-input-field:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 2px rgba(122, 92, 56, 0.12) !important;
          outline: none;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
