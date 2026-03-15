"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

// ─── Project data ────────────────────────────────────────────────────────────

type ProjectStatus = "live" | "development" | "active";
type ProjectCategory = "Digital" | "Physical";

interface Project {
  category: ProjectCategory;
  status: ProjectStatus;
  title: string;
  client: string;
  location: string;
  logo?: string;
  description: string;
  tech?: string[];
  note?: string;
  button: {
    label: string;
    href?: string;
    external?: boolean;
    variant: "primary" | "outline";
    disabled?: boolean;
  };
}

const projects: Project[] = [
  {
    category: "Digital",
    status: "live",
    title: "Secwepemc Sisters Sacred Thread",
    client: "Secwepemc Sisters",
    location: "Kamloops, BC",
    logo: "/portfolio/sacred-thread-logo.png",
    description:
      "Indigenous, queer, sister-operated craft e-commerce store. Built with a glassmorphism UI, Square payment integration with live catalog inventory, and Vercel Postgres for order persistence. Designed and built in close collaboration with the founders.",
    tech: ["Next.js 14", "TypeScript", "Square", "Framer Motion", "Vercel Postgres", "Resend"],
    button: {
      label: "View Live Site",
      href: "https://ssst.packisher.com",
      external: true,
      variant: "primary",
    },
  },
  {
    category: "Digital",
    status: "live",
    title: "Packisher.com",
    client: "Internal",
    location: "Kamloops, BC and Nairobi, Kenya",
    description:
      "Company website for Packisher Technology Services and Ventures. Custom logo mark with braille P detail, glassmorphism design system, land listings, and structured data for SEO. Built and maintained in-house.",
    tech: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"],
    button: {
      label: "View Live Site",
      href: "https://packisher.com",
      external: true,
      variant: "primary",
    },
  },
  {
    category: "Digital",
    status: "development",
    title: "ROSCA App",
    client: "Internal",
    location: "Kenya and Canada",
    description:
      "A rotating savings and credit (ROSCA/chama) app for savings groups in Kenya and Canada. Tracks contribution cycles, member payouts, and missed payments. Supports M-Pesa and Interac notifications. Publishing in 2026 on Android and IOS.",
    tech: ["Flutter", "Dart", "Supabase", "M-Pesa Daraja", "Twilio"],
    button: { label: "Coming Soon", variant: "outline", disabled: true },
  },
  {
    category: "Digital",
    status: "development",
    title: "Athletic Dugout",
    client: "The Athletic Dugout",
    location: "Nairobi, Kenya",
    description:
      "Website and event booking platform for a Nairobi-based fitness and culture brand. Session scheduling, event listings, merchandise, and community features. Athletic Dugout redefines fitness experiences and culture in Nairobi.",
    tech: ["Next.js 14", "Supabase", "Vercel", "Resend"],
    button: { label: "Coming Soon", variant: "outline", disabled: true },
  },
  {
    category: "Physical",
    status: "active",
    title: "Property Management, Nairobi",
    client: "Packisher Ventures",
    location: "Nairobi, Kenya",
    description:
      "Ongoing property management for residential units in Nairobi. Tenant coordination, M-Pesa rent collection, maintenance oversight, and monthly owner reporting. Managed remotely from Canada with on-the-ground operations in Nairobi.",
    note: "Part of Packisher Ventures. Enquire via the Ventures page.",
    button: { label: "Learn More", href: "/ventures", variant: "outline" },
  },
  {
    category: "Physical",
    status: "active",
    title: "Construction Contracting, Western Kenya",
    client: "Packisher Ventures",
    location: "Western Kenya",
    description:
      "Government-tendered construction and school infrastructure projects in western Kenya. Full project management including contractor sourcing, materials procurement, and site supervision.",
    note: "Part of Packisher Ventures. Enquire via the Ventures page.",
    button: { label: "Learn More", href: "/ventures", variant: "outline" },
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProjectLogo({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  if (error) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      style={{
        maxHeight: "40px",
        objectFit: "contain",
        display: "block",
        marginBottom: "14px",
      }}
    />
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  if (status === "live") return <Badge variant="live">Live</Badge>;
  if (status === "development") return <Badge variant="soon">In Development</Badge>;
  return <Badge variant="active">Active</Badge>;
}

function TimelineCard({ project, side }: { project: Project; side: "left" | "right" }) {
  const fromX = side === "left" ? -40 : 40;
  const isLive = project.status === "live";

  return (
    <motion.div
      className="timeline-card-wrapper"
      initial={{ x: fromX, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <GlassCard
        hover={project.status !== "development"}
        glow={isLive}
        style={{ padding: "28px 30px", display: "flex", flexDirection: "column" }}
      >
        {/* Status + client */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "14px",
            flexWrap: "wrap",
          }}
        >
          <StatusBadge status={project.status} />
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {project.client} · {project.location}
          </span>
        </div>

        {/* Logo */}
        {project.logo && <ProjectLogo src={project.logo} alt={`${project.title} logo`} />}

        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontWeight: 800,
            fontSize: "21px",
            color: "var(--text-primary)",
            marginBottom: "10px",
            lineHeight: 1.3,
          }}
        >
          {project.title}
        </h2>

        {/* Description */}
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            lineHeight: 1.75,
            fontFamily: "var(--font-inter), sans-serif",
            marginBottom: project.note ? "10px" : "16px",
            flex: 1,
          }}
        >
          {project.description}
        </p>

        {/* Note */}
        {project.note && (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              fontStyle: "italic",
              fontFamily: "var(--font-inter), sans-serif",
              marginBottom: "16px",
              opacity: 0.7,
            }}
          >
            {project.note}
          </p>
        )}

        {/* Tech badges */}
        {project.tech && project.tech.length > 0 && (
          <div
            style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}
          >
            {project.tech.map((t) => (
              <Badge key={t} variant="tech">
                {t}
              </Badge>
            ))}
          </div>
        )}

        {/* Button */}
        {project.button.disabled ? (
          <Button variant={project.button.variant} size="sm" disabled>
            {project.button.label}
          </Button>
        ) : (
          <Button
            href={project.button.href}
            variant={project.button.variant}
            size="sm"
            external={project.button.external}
          >
            {project.button.label}
          </Button>
        )}
      </GlassCard>
    </motion.div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <motion.div
      className="section-label-row"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="section-label-line" />
      <Badge variant="section">{label}</Badge>
      <div className="section-label-line" />
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  // Build render items: inject section labels before first of each category
  type RenderItem =
    | { type: "label"; label: string; key: string }
    | { type: "project"; project: Project; side: "left" | "right"; key: string };

  const items: RenderItem[] = [];
  let cardIndex = 0;
  let seenDigital = false;
  let seenPhysical = false;

  for (const project of projects) {
    if (project.category === "Digital" && !seenDigital) {
      seenDigital = true;
      items.push({ type: "label", label: "Digital", key: "label-digital" });
    }
    if (project.category === "Physical" && !seenPhysical) {
      seenPhysical = true;
      items.push({ type: "label", label: "Physical", key: "label-physical" });
    }
    const side: "left" | "right" = cardIndex % 2 === 0 ? "left" : "right";
    items.push({ type: "project", project, side, key: project.title });
    cardIndex++;
  }

  return (
    <div style={{ paddingTop: "96px", minHeight: "100vh" }}>
      <style>{`
        /* ── Timeline layout ── */
        .portfolio-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px 100px;
        }
        .timeline-wrapper {
          position: relative;
        }
        /* The animated vertical centre line */
        .timeline-line {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 0;
          width: 1px;
          background: var(--glass-border);
          z-index: 0;
          transform-origin: top center;
        }
        /* Each project row */
        .timeline-row {
          display: grid;
          grid-template-columns: 1fr 56px 1fr;
          align-items: start;
          margin-bottom: 80px;
          position: relative;
          z-index: 1;
        }
        /* Card wrapper — constrain width */
        .timeline-card-wrapper {
          max-width: 480px;
          width: 100%;
        }
        .timeline-card-left { display: flex; justify-content: flex-end; }
        .timeline-card-right { display: flex; justify-content: flex-start; }
        /* Connector column: dot + horizontal line */
        .timeline-connector {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 28px;
          position: relative;
        }
        .timeline-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: var(--accent);
          border: 2px solid var(--bg);
          flex-shrink: 0;
          position: relative;
          z-index: 2;
        }
        /* Section label row */
        .section-label-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 48px;
          position: relative;
          z-index: 1;
        }
        .section-label-line {
          flex: 1;
          height: 1px;
          background: var(--glass-border);
        }
        /* Mobile: line to left edge, all cards stacked right */
        @media (max-width: 768px) {
          .timeline-line {
            left: 20px;
            transform: none;
          }
          .timeline-row {
            grid-template-columns: 44px 1fr;
            margin-bottom: 48px;
          }
          .timeline-card-left,
          .timeline-card-right {
            display: none;
          }
          /* Override: show the card in the second column regardless of side */
          .timeline-row-mobile-card {
            display: flex !important;
            justify-content: flex-start;
          }
          .timeline-card-wrapper {
            max-width: 100%;
          }
          .section-label-row {
            margin-left: 44px;
          }
          .section-label-line:first-child {
            display: none;
          }
        }
      `}</style>

      <div className="portfolio-inner">
        {/* ── Header ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          style={{ marginBottom: "64px" }}
        >
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(48px, 7vw, 80px)",
              color: "var(--text-primary)",
              marginBottom: "12px",
            }}
          >
            Our Work
          </motion.h1>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "17px",
              marginBottom: "8px",
            }}
          >
            Digital products and physical projects across Kenya and Canada.
          </motion.p>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "13px",
              opacity: 0.7,
            }}
          >
            Consent confirmed with all clients before listing.
          </motion.p>
        </motion.div>

        {/* ── Timeline ── */}
        <div className="timeline-wrapper">
          {/* Animated vertical line */}
          <motion.div
            className="timeline-line"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ height: "100%" }}
          />

          {items.map((item) => {
            if (item.type === "label") {
              return <SectionLabel key={item.key} label={item.label} />;
            }

            const { project, side } = item;

            return (
              <div key={item.key} className="timeline-row">
                {/* ── Desktop: left slot ── */}
                <div className="timeline-card-left">
                  {side === "left" && <TimelineCard project={project} side="left" />}
                </div>

                {/* ── Connector dot ── */}
                <div className="timeline-connector">
                  <div className="timeline-dot" />
                </div>

                {/* ── Desktop: right slot ── */}
                <div className="timeline-card-right">
                  {side === "right" && <TimelineCard project={project} side="right" />}
                </div>

                {/* ── Mobile: card always in second column ── */}
                <style>{`
                  @media (max-width: 768px) {
                    .row-${item.key.replace(/[^a-zA-Z0-9]/g, "-")} .timeline-card-left,
                    .row-${item.key.replace(/[^a-zA-Z0-9]/g, "-")} .timeline-card-right {
                      display: none;
                    }
                    .row-${item.key.replace(/[^a-zA-Z0-9]/g, "-")} .mobile-card {
                      display: flex;
                    }
                  }
                `}</style>
              </div>
            );
          })}
        </div>

        {/* ── Mobile-only: stacked cards ── */}
        <div className="mobile-timeline">
          <style>{`
            .mobile-timeline { display: none; }
            @media (max-width: 768px) {
              .desktop-timeline { display: none !important; }
              .mobile-timeline {
                display: block;
                padding-left: 44px;
                position: relative;
              }
              .mobile-timeline::before {
                content: '';
                position: absolute;
                left: 20px;
                top: 0;
                bottom: 0;
                width: 1px;
                background: var(--glass-border);
              }
              .mobile-item {
                position: relative;
                margin-bottom: 48px;
              }
              .mobile-item::before {
                content: '';
                position: absolute;
                left: -35px;
                top: 28px;
                width: 11px;
                height: 11px;
                border-radius: 50%;
                background: var(--accent);
                border: 2px solid var(--bg);
                z-index: 2;
              }
              .mobile-section-label {
                margin-left: -44px;
                margin-bottom: 32px;
                display: flex;
                align-items: center;
                gap: 12px;
              }
              .mobile-section-label .section-label-line:first-child {
                display: none;
              }
            }
          `}</style>

          {items.map((item) => {
            if (item.type === "label") {
              return (
                <div key={`m-${item.key}`} className="mobile-section-label">
                  <div className="section-label-line" />
                  <Badge variant="section">{item.label}</Badge>
                  <div className="section-label-line" />
                </div>
              );
            }
            return (
              <div key={`m-${item.key}`} className="mobile-item">
                <TimelineCard project={item.project} side="right" />
              </div>
            );
          })}
        </div>

        {/* Wrap desktop timeline */}
        <style>{`
          @media (max-width: 768px) {
            .timeline-wrapper { display: none; }
          }
        `}</style>

        {/* ── Footer note ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ marginTop: "24px" }}
        >
          <GlassCard hover={false} style={{ padding: "20px 24px" }}>
            <p
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "14px",
                lineHeight: 1.6,
                textAlign: "center",
              }}
            >
              More projects coming as client work is completed.{" "}
              <a
                href="/contact"
                style={{
                  color: "var(--accent)",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Interested in working with us? Get in touch →
              </a>
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
