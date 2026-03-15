"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const SERVICE_IDS = [
  "website-standard",
  "website-ecommerce",
  "google-workspace",
  "square-pos",
  "mpesa-integration",
  "business-digitization",
  "automation",
  "seo-setup",
  "social-setup",
  "custom-app",
  "whatsapp-setup",
  "booking-system",
  "domain-email-hosting",
  "digital-catalogue",
  "retainer",
  "land-listing",
  "other",
] as const;

type ServiceId = (typeof SERVICE_IDS)[number];

const serviceOptions: { value: ServiceId; label: string }[] = [
  { value: "website-standard", label: "Business Website" },
  { value: "website-ecommerce", label: "Business Website (E-Commerce)" },
  { value: "google-workspace", label: "Google Workspace Setup & Migration" },
  { value: "square-pos", label: "Square POS Setup" },
  { value: "mpesa-integration", label: "M-Pesa Business Integration" },
  { value: "business-digitization", label: "Business Digitization" },
  { value: "automation", label: "App & Tool Integration (Automation)" },
  { value: "seo-setup", label: "SEO and Google Business Setup" },
  { value: "social-setup", label: "Social Media Business Setup" },
  { value: "custom-app", label: "Custom App or Internal Tool" },
  { value: "whatsapp-setup", label: "WhatsApp Business Setup" },
  { value: "booking-system", label: "Booking and Appointment System" },
  { value: "domain-email-hosting", label: "Domain, Email and Hosting Setup" },
  { value: "digital-catalogue", label: "Online Menu or Digital Catalogue" },
  { value: "retainer", label: "Monthly Tech Support Retainer" },
  { value: "land-listing", label: "Land or Property Enquiry" },
  { value: "other", label: "Not sure yet" },
];

const referralSources = ["Referral", "Google", "LinkedIn", "Social Media", "Other"] as const;

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  businessName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  serviceInterested: z.enum(SERVICE_IDS, {
    message: "Please select a service",
  }),
  message: z.string().min(20, "Please tell us a bit more (at least 20 characters)"),
  referralSource: z.enum(referralSources, {
    message: "Please tell us how you found us",
  }),
  ref: z.string().optional(),
  plot: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
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
  fontSize: "13px",
  fontWeight: 500,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  marginBottom: "8px",
};

const errorStyle: React.CSSProperties = {
  color: "#f87171",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "12px",
  marginTop: "6px",
};

export default function ContactForm({ defaultService }: { defaultService?: string }) {
  const searchParams = useSearchParams();
  const urlService = searchParams.get("service") ?? defaultService ?? "";
  const urlRef = searchParams.get("ref") ?? "";
  const urlPlot = searchParams.get("plot") ?? "";

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const serviceDefault = SERVICE_IDS.find((v) => v === urlService) ?? undefined;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceInterested: serviceDefault,
      ref: urlRef || undefined,
      plot: urlPlot || undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError("");
    try {
      const payload = {
        ...data,
        ref: urlRef || undefined,
        plot: urlPlot || undefined,
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 429) {
          setSubmitError("Too many submissions. Please wait before trying again.");
        } else {
          setSubmitError(body.error || "Something went wrong. Please try again.");
        }
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
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>✓</div>
          <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "24px", color: "var(--text-primary)", marginBottom: "12px" }}>
            Message received.
          </h3>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", lineHeight: 1.6 }}>
            We&apos;ll be in touch within 1 business day.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Property enquiry banner — shown when ref is present in URL */}
      {urlRef && (
        <div style={{ padding: "12px 16px", background: "rgba(200,184,154,0.10)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(200,184,154,0.25)" }}>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", lineHeight: 1.5 }}>
            Regarding: <strong style={{ color: "var(--text-primary)" }}>{urlPlot || urlRef}</strong>{urlPlot ? ` — Ref ${urlRef}` : ""}
          </p>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label style={labelStyle}>Full Name *</label>
        <input {...register("fullName")} placeholder="Jane Smith" className="glass-input-field" style={inputStyle} />
        {errors.fullName && <p style={errorStyle}>{errors.fullName.message}</p>}
      </div>

      {/* Business Name */}
      <div>
        <label style={labelStyle}>Business Name <span style={{ opacity: 0.5 }}>(optional)</span></label>
        <input {...register("businessName")} placeholder="Acme Enterprises" className="glass-input-field" style={inputStyle} />
      </div>

      {/* Email + Phone row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Email Address *</label>
          <input {...register("email")} type="email" placeholder="you@yourbusiness.com" className="glass-input-field" style={inputStyle} />
          {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>Phone / WhatsApp <span style={{ opacity: 0.5 }}>(optional)</span></label>
          <input {...register("phone")} placeholder="+1 555 000 0000" className="glass-input-field" style={inputStyle} />
        </div>
      </div>

      {/* Service */}
      <div>
        <label style={labelStyle}>Service Interested In *</label>
        <select {...register("serviceInterested")} className="glass-input-field" style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}>
          <option value="">Select a service…</option>
          {serviceOptions.map((s) => (
            <option key={s.value} value={s.value} style={{ background: "#1a1a2e", color: "var(--text-primary)" }}>{s.label}</option>
          ))}
        </select>
        {errors.serviceInterested && <p style={errorStyle}>{errors.serviceInterested.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label style={labelStyle}>Tell us about your business and what you need *</label>
        <textarea
          {...register("message")}
          rows={5}
          placeholder="We run a small retail business and are looking to build an online presence and accept payments on our website…"
          className="glass-input-field"
          style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
        />
        {errors.message && <p style={errorStyle}>{errors.message.message}</p>}
      </div>

      {/* Referral source */}
      <div>
        <label style={labelStyle}>How did you hear about Packisher? *</label>
        <select {...register("referralSource")} className="glass-input-field" style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}>
          <option value="">Select…</option>
          {referralSources.map((s) => (
            <option key={s} value={s} style={{ background: "#1a1a2e", color: "var(--text-primary)" }}>{s}</option>
          ))}
        </select>
        {errors.referralSource && <p style={errorStyle}>{errors.referralSource.message}</p>}
      </div>

      {/* Hidden ref/plot fields */}
      <input type="hidden" {...register("ref")} />
      <input type="hidden" {...register("plot")} />

      {/* Error toast */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: "14px 18px",
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.3)",
              borderLeft: "3px solid #f87171",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <p style={{ color: "#f87171", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px" }}>{submitError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          background: isSubmitting ? "rgba(200,184,154,0.5)" : "#C8B89A",
          color: "#0A0A0F",
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
            <span style={{ width: "16px", height: "16px", border: "2px solid rgba(10,10,15,0.3)", borderTop: "2px solid #0A0A0F", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
            Sending…
          </>
        ) : (
          "Send Message"
        )}
      </button>

      <style>{`
        .glass-input-field:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 2px rgba(200,184,154,0.15) !important;
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
