"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { fadeUp, staggerContainer } from "@/lib/animations";
import HeroSketches from "@/components/HeroSketches";
import { listings } from "@/data/listings";

function ListingImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div style={{ height: "200px", background: "linear-gradient(160deg, rgba(200,184,154,0.18) 0%, rgba(200,184,154,0.07) 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, gap: "10px" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "rgba(200,184,154,0.55)" }}>
          <path d="M2 20l6-8 4 5 3-3 5 6H2z" />
          <circle cx="18" cy="6" r="2" />
        </svg>
        <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", opacity: 0.7 }}>Photo coming soon</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      style={{ width: "100%", height: "200px", objectFit: "cover", display: "block", flexShrink: 0 }}
    />
  );
}

export default function VenturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section" style={{ position: "relative", paddingTop: "96px", paddingBottom: "64px" }}>
        <HeroSketches page="ventures" />
        <div
          className="ventures-hero-row"
          style={{ position: "relative", zIndex: 1, maxWidth: "1120px", margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", gap: "40px", width: "100%" }}
        >
          {/* Left: text card */}
          <div className="hero-glass" style={{ flex: 1, minWidth: 0, background: "rgba(245, 242, 236, 0.82)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: "var(--radius-md)", padding: "40px 48px", border: "1px solid rgba(255, 255, 255, 0.68)" }}>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.p variants={fadeUp} style={{ fontFamily: "var(--font-inter), sans-serif", color: "var(--text-muted)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>
                Packisher · Ventures
              </motion.p>
              <motion.h1 variants={fadeUp} style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 6vw, 60px)", color: "var(--text-primary)", marginBottom: "32px", lineHeight: 1.1 }}>
                Property. Investment. Builds.
              </motion.h1>
              <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {[
                  "Packisher Ventures is our property and investment arm, operating on the ground in Kenya. We manage rental properties, support land and property acquisition, and oversee construction projects for clients in Kenya and the diaspora.",
                  "If you own property in Kenya and need someone reliable to manage it, we handle everything. Tenant coordination, rent collection via M-Pesa, maintenance, and monthly reporting. Our team is based in Nairobi and reachable every day.",
                  "If you want to buy land, build a home, or invest in Kenyan property from abroad, we manage the full process for you. Title verification, contractor sourcing, site supervision, and documentation from start to finish.",
                ].map((para, i) => (
                  <p key={i} style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "17px", lineHeight: 1.75 }}>
                    {para}
                  </p>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right: property dashboard window */}
          <div className="ventures-hero-window" style={{ flexShrink: 0 }}>
            <div style={{
              width: "280px",
              background: "rgba(245, 242, 236, 0.88)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              overflow: "hidden",
              fontFamily: "var(--font-inter), sans-serif",
            }}>
              {/* Title bar */}
              <div style={{ background: "rgba(200,184,154,0.18)", padding: "9px 14px", display: "flex", alignItems: "center", gap: "7px", borderBottom: "1px solid rgba(200,184,154,0.2)" }}>
                <div style={{ display: "flex", gap: "5px" }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f57" }} />
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ffbd2e" }} />
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#28c840" }} />
                </div>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 500, marginLeft: "4px" }}>Packisher Properties</span>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840", marginLeft: "auto" }} />
              </div>
              {/* Property rows */}
              <div style={{ padding: "10px" }}>
                {[
                  { name: "Kilimani Studio", location: "Nairobi, Kilimani", status: "Occupied", rent: "KES 32,000" },
                  { name: "Westlands 2BR", location: "Westlands, Nairobi", status: "Occupied", rent: "KES 55,000" },
                  { name: "South C Plot", location: "South C, Nairobi", status: "Available", rent: "KES 28,500" },
                ].map((prop, i) => (
                  <div key={i} style={{ padding: "9px 11px", marginBottom: i < 2 ? "6px" : 0, background: "rgba(255,255,255,0.52)", borderRadius: "8px", border: "1px solid rgba(200,184,154,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "4px" }}>
                      <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-primary)" }}>{prop.name}</p>
                      <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--accent)", whiteSpace: "nowrap" }}>{prop.rent}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>{prop.location}</span>
                      <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "4px", fontWeight: 600, background: prop.status === "Occupied" ? "rgba(40,200,64,0.12)" : "rgba(200,184,154,0.22)", color: prop.status === "Occupied" ? "#1a9e32" : "var(--accent)" }}>{prop.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 960px) {
            .ventures-hero-row {
              flex-direction: column;
              align-items: stretch;
              max-width: 700px !important;
              gap: 28px !important;
            }
            .ventures-hero-row .hero-glass {
              width: 100%;
            }
          }
        `}</style>
      </section>

      {/* Rest of content */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Status card */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "48px" }}>
          <GlassCard hover={false} style={{ padding: "24px 28px", borderLeft: "3px solid var(--accent-2)" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
              <Badge variant="soon">Active</Badge>
              <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px" }}>Kenya operations</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.6 }}>
              Property management · Land acquisition · Construction contracting
            </p>
          </GlassCard>
        </motion.div>

        {/* Info cards */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            <GlassCard hover style={{ padding: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--text-primary)", marginBottom: "12px" }}>
                Property Management
              </h3>
              <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.7 }}>
                We manage rental properties in Kenya on behalf of owners, handling tenant coordination, maintenance, and collections. If you own property in Kenya and need a reliable local presence, reach out.
              </p>
            </GlassCard>

            <GlassCard hover style={{ padding: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--text-primary)", marginBottom: "12px" }}>
                Acquisition and Diaspora Builds
              </h3>
              <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.7 }}>
                We help people acquire land and property in Kenya and manage construction projects on their behalf. This is particularly useful for Kenyans abroad who want to build or invest at home without relying on people they cannot properly vet from outside the country.
              </p>
            </GlassCard>

            <GlassCard hover style={{ padding: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--text-primary)", marginBottom: "12px" }}>
                Construction Contracting
              </h3>
              <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.7 }}>
                We hold and execute construction contracts in Kenya, including school infrastructure and government-tendered projects. Track record in western Kenya and active contracts currently running.
              </p>
            </GlassCard>
          </div>
        </motion.div>

        {/* Land for Sale */}
        <motion.div id="marketplace" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", color: "var(--text-primary)", marginBottom: "8px" }}>
            Land for Sale
          </h2>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", marginBottom: "4px", lineHeight: 1.6 }}>
            Listings verified by our team on the ground in Kenya. Contact us to arrange a viewing or find out more.
          </p>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", fontStyle: "italic", marginBottom: "28px" }}>
            All listings are reviewed by Packisher Ventures before being posted.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "28px" }}>
            {listings.slice(0, 3).map((listing) => (
              <GlassCard key={listing.id} hover glow style={{ padding: 0, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                <ListingImage src={listing.images[0]} alt={listing.title} />
                <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ color: "var(--accent-2)", fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {listing.county}
                  </p>
                  <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--text-primary)", lineHeight: 1.3 }}>
                    {listing.title}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                    <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "12px" }}>
                      {listing.size} · Ref {listing.ref}
                    </p>
                    <p style={{ color: "var(--accent)", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "14px", whiteSpace: "nowrap" }}>
                      {listing.price}
                    </p>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", lineHeight: 1.55, flex: 1 }}>
                    {listing.description}
                  </p>
                  <Button
                    href={`/contact?service=land-listing&ref=${encodeURIComponent(listing.ref)}&plot=${encodeURIComponent(listing.title)}`}
                    variant="primary"
                    size="sm"
                  >
                    Enquire About This Plot
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <Button href="/ventures/marketplace" variant="outline" size="sm">See More Listings →</Button>
            <Button href="/contact" variant="outline" size="sm">List with us</Button>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "16px" }}>
          <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", color: "var(--text-primary)", marginBottom: "8px" }}>
            How it works
          </h2>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", marginBottom: "28px" }}>
            For clients based outside Kenya.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                step: "01",
                title: "Initial call",
                body: "We have a 30-minute call to understand what you need. We ask the right questions and tell you honestly if we are the right fit.",
              },
              {
                step: "02",
                title: "Scope and agreement",
                body: "We send a written scope covering what we will do, the timeline, the cost, and how we communicate. You approve before anything starts.",
              },
              {
                step: "03",
                title: "On the ground",
                body: "Our team in Nairobi handles the work. You get regular updates with photos, documents, and clear status reports.",
              },
              {
                step: "04",
                title: "Handover",
                body: "Full documentation at project end. For ongoing management we send monthly reports and are reachable on WhatsApp whenever you need us.",
              },
            ].map((s) => (
              <GlassCard key={s.step} hover={false} style={{ padding: "24px 28px", borderLeft: "3px solid var(--accent-2)" }}>
                <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>
                  Step {s.step}
                </p>
                <h3 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--text-primary)", marginBottom: "8px" }}>
                  {s.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.65 }}>
                  {s.body}
                </p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginTop: "48px" }}>
          <GlassCard hover={false} style={{ padding: "52px 40px", textAlign: "center", background: "rgba(200,184,154,0.03)", border: "1px solid rgba(200,184,154,0.12)" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 42px)", color: "var(--text-primary)", marginBottom: "14px" }}>
              Ready to invest in Kenya?
            </h2>
            <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", lineHeight: 1.65, marginBottom: "32px", maxWidth: "560px", margin: "0 auto 32px" }}>
              Whether you want to buy land, build a home, or have your property managed properly, we are the local team you can actually trust. Kenyan-owned, professionally run, and accountable from start to finish.
            </p>
            <Button href="/contact" variant="primary" size="lg">Start a Conversation</Button>
          </GlassCard>
        </motion.div>

      </div>
    </>
  );
}
