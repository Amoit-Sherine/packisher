"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(9, "Please enter a valid phone or WhatsApp number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  type: z.enum(["individual", "business"], { message: "Please select one" }),
  businessName: z.string().optional(),
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

export default function ParcelsWaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const type = watch("type");

  const onSubmit = async (data: FormData) => {
    setSubmitError("");
    try {
      const res = await fetch("/api/parcels-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
            You are on the list.
          </h3>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", lineHeight: 1.6 }}>
            We will reach you on WhatsApp when we launch.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={labelStyle}>Full Name *</label>
        <input {...register("fullName")} placeholder="Jane Mwangi" className="glass-input-field" style={inputStyle} />
        {errors.fullName && <p style={errorStyle}>{errors.fullName.message}</p>}
      </div>

      <div>
        <label style={labelStyle}>Phone / WhatsApp *</label>
        <input {...register("phone")} placeholder="+254 700 000 000" className="glass-input-field" style={inputStyle} />
        {errors.phone && <p style={errorStyle}>{errors.phone.message}</p>}
      </div>

      <div>
        <label style={labelStyle}>Email <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span></label>
        <input {...register("email")} type="email" placeholder="you@example.com" className="glass-input-field" style={inputStyle} />
        {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
      </div>

      <div>
        <label style={labelStyle}>Individual or Business *</label>
        <div style={{ display: "flex", gap: "12px" }}>
          {(["individual", "business"] as const).map((val) => (
            <label
              key={val}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                border: `1px solid ${type === val ? "var(--accent)" : "var(--glass-border)"}`,
                background: type === val ? "rgba(122, 92, 56, 0.08)" : "rgba(255,255,255,0.55)",
                cursor: "pointer",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: type === val ? "var(--accent)" : "var(--text-muted)",
                transition: "all 0.2s ease",
              }}
            >
              <input type="radio" value={val} {...register("type")} style={{ display: "none" }} />
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </label>
          ))}
        </div>
        {errors.type && <p style={errorStyle}>{errors.type.message}</p>}
      </div>

      {type === "business" && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <label style={labelStyle}>Business Name</label>
          <input {...register("businessName")} placeholder="Acme Enterprises" className="glass-input-field" style={inputStyle} />
        </motion.div>
      )}

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
            Joining…
          </>
        ) : (
          "Join the Waitlist"
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
