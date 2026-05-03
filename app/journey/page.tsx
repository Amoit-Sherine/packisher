"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { fadeUp, staggerContainer } from "@/lib/animations";

type CardStatus = "founded" | "live" | "development" | "launching" | "soon";

interface JourneyCard {
  status: CardStatus;
  statusLabel: string;
  subtitle: string;
  title: string;
  body: string;
  tags?: string[];
  statusPill?: string;
  cta?: { label: string; href: string; external?: boolean };
}

function StatusBadge({ status, label }: { status: CardStatus; label: string }) {
  const styles: Record<CardStatus, React.CSSProperties> = {
    founded: { background: "rgba(200,184,154,0.18)", color: "var(--accent)", border: "1px solid rgba(200,184,154,0.35)" },
    live: { background: "rgba(74,222,128,0.12)", color: "var(--status-live)", border: "1px solid rgba(74,222,128,0.25)" },
    development: { background: "rgba(155,145,212,0.12)", color: "var(--status-soon-text)", border: "1px solid var(--card-soon-border)" },
    launching: { background: "rgba(155,145,212,0.12)", color: "var(--status-soon-text)", border: "1px solid var(--card-soon-border)" },
    soon: { background: "rgba(155,145,212,0.12)", color: "var(--status-soon-text)", border: "1px solid var(--card-soon-border)" },
  };
  return (
    <span style={{ ...styles[status], padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", display: "inline-block", fontFamily: "var(--font-inter), sans-serif" }}>
      {label}
    </span>
  );
}

const cards: JourneyCard[] = [
  {
    status: "founded",
    statusLabel: "Founded",
    subtitle: "Packisher · Nairobi, Kenya",
    title: "We saw the gap.",
    body: "Packisher was founded to fix the logistics problem small businesses in Kenya face every day. Unreliable riders, no documentation, no accountability. We started with a simple idea: build a delivery operation that actually works. Everything follows from that.",
  },
  {
    status: "live",
    statusLabel: "Live",
    subtitle: "Packisher Tipper · Busia County and Western Kenya",
    title: "Packisher Tipper launches.",
    body: "Construction material logistics across Western Kenya. Sand, ballast, murram, and hardcore delivered to your site. Book online, pay via Mpesa, and receive driver contact and ETA on WhatsApp. Vetted truck operators on every job.",
    tags: ["Next.js 14", "Supabase", "Mpesa", "Google Maps", "Twilio"],
    statusPill: "Book Now",
    cta: { label: "Book a Tipper", href: "/tipper#booking" },
  },
  {
    status: "launching",
    statusLabel: "Launching",
    subtitle: "Packisher Parcels · Nairobi",
    title: "Packisher Parcels launches in Nairobi.",
    body: "Last mile parcel delivery and errands across Nairobi. Trained riders handle pickups, drops, bus station handoffs, and business errands. Full WhatsApp notifications, Mpesa receipts, and photo documentation on every job.",
    tags: ["Flutter", "Supabase", "Mpesa", "Twilio", "Google Maps"],
    statusPill: "Launching 2026",
    cta: { label: "Join the Waitlist", href: "/parcels#waitlist" },
  },
  {
    status: "development",
    statusLabel: "In Development",
    subtitle: "Packisher Parcels · Android and iOS",
    title: "Packisher Parcels App.",
    body: "The full Packisher Parcels mobile app. Book, track, and pay from your phone. Built for individual senders and Nairobi businesses shipping regularly. Scan at pickup, signature at delivery, receipt in seconds.",
    tags: ["Flutter", "Dart", "Supabase", "Google Maps", "Mpesa"],
    statusPill: "In Development",
    cta: { label: "Join the Waitlist", href: "/parcels#waitlist" },
  },
  {
    status: "soon",
    statusLabel: "Coming Soon",
    subtitle: "Packisher · Kenya",
    title: "Expanding across Kenya.",
    body: "Packisher Tipper expanding beyond Western Kenya. Packisher Parcels scaling across Nairobi and into other counties. More routes, more operators, more coverage. The infrastructure for logistics that works the way Kenya works.",
    statusPill: "2026 and beyond",
  },
];

function TimelineCard({ card, side }: { card: JourneyCard; side: "left" | "right" }) {
  const fromX = side === "left" ? -40 : 40;
  const isLive = card.status === "live";

  return (
    <motion.div
      className="timeline-card-wrapper"
      initial={{ x: fromX, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <GlassCard
        hover={card.status !== "development" && card.status !== "soon"}
        glow={isLive}
        style={{ padding: "28px 30px", display: "flex", flexDirection: "column" }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "14px", flexWrap: "wrap" }}>
          <StatusBadge status={card.status} label={card.statusLabel} />
          <span style={{ color: "var(--text-muted)", fontSize: "12px", fontFamily: "var(--font-inter), sans-serif" }}>
            {card.subtitle}
          </span>
        </div>

        <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "21px", color: "var(--text-primary)", marginBottom: "10px", lineHeight: 1.3 }}>
          {card.title}
        </h2>

        <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.75, fontFamily: "var(--font-inter), sans-serif", marginBottom: "16px", flex: 1 }}>
          {card.body}
        </p>

        {card.tags && card.tags.length > 0 && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            {card.tags.map((t) => (
              <Badge key={t} variant="tech">{t}</Badge>
            ))}
          </div>
        )}

        {card.statusPill && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "5px 12px", background: "rgba(122, 92, 56, 0.08)", borderRadius: "99px", border: "1px solid rgba(122, 92, 56, 0.15)", alignSelf: "flex-start", marginBottom: card.cta ? "16px" : 0 }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 600, color: "var(--accent)", letterSpacing: "0.06em" }}>
              {card.statusPill}
            </span>
          </div>
        )}

        {card.cta && (
          <Button
            href={card.cta.href}
            variant={card.status === "live" ? "primary" : "outline"}
            size="sm"
            external={card.cta.external}
          >
            {card.cta.label}
          </Button>
        )}
      </GlassCard>
    </motion.div>
  );
}

export default function JourneyPage() {
  return (
    <div style={{ paddingTop: "96px", minHeight: "100vh" }}>
      <style>{`
        .portfolio-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px 100px; }
        .timeline-wrapper { position: relative; }
        .timeline-line {
          position: absolute; left: 50%; transform: translateX(-50%);
          top: 0; width: 1px; background: var(--glass-border); z-index: 0;
          transform-origin: top center;
        }
        .timeline-row {
          display: grid; grid-template-columns: 1fr 56px 1fr;
          align-items: start; margin-bottom: 80px; position: relative; z-index: 1;
        }
        .timeline-card-wrapper { max-width: 480px; width: 100%; }
        .timeline-card-left { display: flex; justify-content: flex-end; }
        .timeline-card-right { display: flex; justify-content: flex-start; }
        .timeline-connector {
          display: flex; align-items: flex-start; justify-content: center;
          padding-top: 28px; position: relative;
        }
        .timeline-dot {
          width: 11px; height: 11px; border-radius: 50%;
          background: var(--accent); border: 2px solid var(--bg);
          flex-shrink: 0; position: relative; z-index: 2;
        }
        @media (max-width: 768px) {
          .timeline-wrapper { display: none; }
          .mobile-timeline { display: block !important; }
        }
        .mobile-timeline { display: none; }
        .mobile-timeline-inner {
          padding-left: 44px; position: relative;
        }
        .mobile-timeline-inner::before {
          content: ''; position: absolute; left: 20px; top: 0; bottom: 0;
          width: 1px; background: var(--glass-border);
        }
        .mobile-item { position: relative; margin-bottom: 40px; }
        .mobile-item::before {
          content: ''; position: absolute; left: -35px; top: 28px;
          width: 11px; height: 11px; border-radius: 50%;
          background: var(--accent); border: 2px solid var(--bg); z-index: 2;
        }
      `}</style>

      <div className="portfolio-inner">
        {/* ── Header ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ marginBottom: "64px" }}
        >
          <motion.p
            variants={fadeUp}
            style={{ fontFamily: "var(--font-inter), sans-serif", color: "var(--text-muted)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}
          >
            Packisher · The Journey
          </motion.p>
          <motion.h1
            variants={fadeUp}
            style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(48px, 7vw, 80px)", color: "var(--text-primary)", marginBottom: "12px" }}
          >
            Where we started.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "17px", marginBottom: "8px" }}
          >
            The honest record of what we have built, what we have launched, and what is coming next.
          </motion.p>
        </motion.div>

        {/* ── Desktop Timeline ── */}
        <div className="timeline-wrapper">
          <motion.div
            className="timeline-line"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ height: "100%" }}
          />

          {cards.map((card, i) => {
            const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
            return (
              <div key={card.title} className="timeline-row">
                <div className="timeline-card-left">
                  {side === "left" && <TimelineCard card={card} side="left" />}
                </div>
                <div className="timeline-connector">
                  <div className="timeline-dot" />
                </div>
                <div className="timeline-card-right">
                  {side === "right" && <TimelineCard card={card} side="right" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Mobile Timeline ── */}
        <div className="mobile-timeline">
          <div className="mobile-timeline-inner">
            {cards.map((card) => (
              <div key={`m-${card.title}`} className="mobile-item">
                <TimelineCard card={card} side="right" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ marginTop: "48px" }}
        >
          <GlassCard hover={false} style={{ padding: "48px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", color: "var(--text-primary)", marginBottom: "16px" }}>
              Want to be part of it?
            </h2>
            <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", lineHeight: 1.6, marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
              We are looking for business partners, early clients, and riders to join the Packisher Parcels network in Nairobi.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Button href="/parcels#waitlist" variant="outline" size="md">Join Parcels Waitlist</Button>
              <Button href="/tipper#booking" variant="primary" size="md">Book a Tipper</Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
