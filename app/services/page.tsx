"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { fadeUp, staggerContainer } from "@/lib/animations";
import HeroSketches from "@/components/HeroSketches";

const services = [
  {
    id: "website-standard",
    name: "Business Website",
    tagline: "A clean, fast, mobile-first website for your business. No templates, built from scratch.",
    deliverables: [
      "Up to 5 pages (Home, About, Services, Gallery/Menu, Contact)",
      "Mobile-responsive design",
      "Contact form with email notifications",
      "Google Maps embed",
      "Basic SEO setup (meta tags, sitemap, robots.txt)",
      "Deployed to custom domain (client provides domain)",
      "1 round of revisions included",
      "Handoff: client edits text via simple CMS (Notion or Sanity)",
    ],
    stack: "Next.js 14, Tailwind CSS, Vercel, Resend",
  },
  {
    id: "website-ecommerce",
    name: "Business Website (E-Commerce)",
    tagline: "Sell products or services online. Square or M-Pesa supported.",
    deliverables: [
      "Everything in Standard tier",
      "Product catalog with categories and search",
      "Square payments and/or M-Pesa STK Push",
      "Order confirmation emails",
      "Basic inventory management",
      "Order history for customers",
      "Admin panel, no code required",
      "SSL, security headers, rate limiting",
    ],
    stack: "Next.js 14, Square API, M-Pesa Daraja API, Vercel Postgres, Resend",
  },
  {
    id: "google-workspace",
    name: "Google Workspace Setup & Migration",
    tagline: "Move off personal Gmail into a professional, organized workspace.",
    deliverables: [
      "Google Workspace account setup (Business Starter)",
      "Custom domain email (you@yourbusiness.co.ke)",
      "Existing email migration from personal Gmail",
      "Google Drive folder structure for the team",
      "Shared calendars and meeting scheduling",
      "Team onboarding up to 5 users via video call",
      "2 weeks post-setup WhatsApp support",
    ],
    stack: "Google Workspace Admin, Google Migration Tool",
  },
  {
    id: "square-pos",
    name: "Square POS Setup",
    tagline: "Take card payments professionally, including tap-to-pay on mobile.",
    deliverables: [
      "Square account creation and verification",
      "Product/menu catalog setup (up to 50 items)",
      "Square POS app configured on client device",
      "Receipt customization (logo, thank-you message)",
      "Staff PINs and role permissions",
      "Basic sales reporting walkthrough",
      "30-day WhatsApp support",
    ],
    stack: "Square Dashboard, Square POS App",
  },
  {
    id: "mpesa-integration",
    name: "M-Pesa Business Integration",
    tagline: "Accept M-Pesa payments on your website or app via Daraja API.",
    deliverables: [
      "Safaricom Daraja API setup and verification",
      "STK Push (customer phone → M-Pesa prompt → payment)",
      "Payment confirmation webhooks with automatic order updates",
      "Transaction logs stored in database",
      "Integration into existing codebase",
      "End-to-end sandbox + live testing",
      "Documentation handoff",
    ],
    stack: "Safaricom Daraja API, Next.js API Routes or Node.js",
  },
  {
    id: "business-digitization",
    name: "Business Digitization",
    tagline: "Stop using notebooks and WhatsApp for operations. Go digital properly.",
    deliverables: [
      "Operations audit (video call + questionnaire)",
      "Tool recommendation for your business type",
      "Setup of chosen tools (Notion, Airtable, Google Sheets, or Jotform)",
      "Data migration up to 500 rows",
      "Staff training session, up to 3 staff via video call",
      "30-day support package",
      "Written operations guide (English + Swahili available)",
    ],
    stack: "Notion, Airtable, Google Workspace, Jotform, Zapier",
  },
  {
    id: "automation",
    name: "App & Tool Integration (Automation)",
    tagline: "Connect your existing tools so they talk to each other automatically.",
    deliverables: [
      "Discovery call to map current workflow",
      "Zapier or Make automation setup",
      "Up to 5 automated workflows",
      "Examples: form → WhatsApp alert, payment → invoice email, order → spreadsheet",
      "Testing and documentation",
      "30-day monitoring and adjustment window",
    ],
    stack: "Zapier, Make, Jotform, Google Sheets, WhatsApp Business API, Resend",
  },
  {
    id: "seo-setup",
    name: "SEO and Google Business Setup",
    tagline: "Get found on Google by people already searching for what you do.",
    deliverables: [
      "Google Business Profile setup and verification",
      "On-page SEO: titles, meta descriptions, heading structure",
      "Google Search Console and Analytics setup",
      "Sitemap and robots.txt",
      "Basic keyword targeting for your market",
      "1 month post-setup support",
    ],
    stack: "Google Business, Search Console, Analytics, Next.js",
  },
  {
    id: "social-setup",
    name: "Social Media Business Setup",
    tagline: "Properly set up business profiles across the platforms your customers are actually using.",
    deliverables: [
      "Instagram, Facebook, and/or LinkedIn business account setup",
      "Profile optimisation: bio, logo, contact info, link in bio",
      "Branded cover images and profile photo setup",
      "WhatsApp Business account setup with auto-reply configuration",
      "Content calendar template (Notion or Google Sheets)",
      "1 onboarding call to walk through the posting workflow",
    ],
    stack: "Meta Business Suite, WhatsApp Business, Canva, Notion",
  },
  {
    id: "custom-app",
    name: "Custom App or Internal Tool",
    tagline: "A web app built for a specific workflow that off-the-shelf tools cannot handle.",
    deliverables: [
      "Discovery call to define scope and user flows",
      "Custom web application (Next.js and TypeScript)",
      "User authentication with role-based access",
      "Database setup (Supabase or Vercel Postgres)",
      "Admin panel for non-technical management",
      "Deployed on Vercel with your domain",
      "Full codebase and documentation handoff",
      "Examples: booking systems, chama/ROSCA tools, staff portals, inventory managers",
    ],
    stack: "Next.js 14, TypeScript, Supabase, Vercel, Resend",
  },
  {
    id: "whatsapp-setup",
    name: "WhatsApp Business Setup",
    tagline: "Set up WhatsApp Business properly so your customers can find, message, and buy from you.",
    deliverables: [
      "WhatsApp Business account setup and verification",
      "Business profile: name, description, address, hours, website",
      "Product or service catalogue setup (up to 20 items)",
      "Auto-reply and away message configuration",
      "Quick replies for common questions",
      "WhatsApp link and QR code for marketing materials",
      "30-day support",
    ],
    stack: "WhatsApp Business App, WhatsApp Business API where applicable",
  },
  {
    id: "booking-system",
    name: "Booking and Appointment System",
    tagline: "Let customers book time with you online without the back-and-forth messages.",
    deliverables: [
      "Custom booking page on your website or as a standalone link",
      "Service and staff scheduling setup",
      "Automated confirmation and reminder emails or SMS",
      "Calendar sync (Google Calendar)",
      "Payment collection at booking (optional)",
      "Admin dashboard to manage appointments",
      "Mobile-friendly for clients booking on phone",
    ],
    stack: "Cal.com or Calendly integration, Next.js, Resend, Google Calendar API",
  },
  {
    id: "domain-email-hosting",
    name: "Domain, Email and Hosting Setup",
    tagline: "Get your business online with a proper domain, professional email, and reliable hosting.",
    deliverables: [
      "Domain registration or transfer guidance",
      "Professional email setup on your domain (you@yourbusiness.co.ke or .ca)",
      "DNS configuration and verification",
      "Website hosting deployment on Vercel",
      "SSL certificate setup",
      "Email forwarding and alias configuration",
      "Walkthrough and handoff documentation",
    ],
    stack: "IONOS, Google Workspace, Vercel, Cloudflare DNS",
  },
  {
    id: "digital-catalogue",
    name: "Online Menu or Digital Catalogue",
    tagline: "Give customers a clean way to browse what you offer, from their phone, without downloading anything.",
    deliverables: [
      "Mobile-first menu or catalogue page",
      "Categories and item photos",
      "QR code that opens the menu (printable for tables or counters)",
      "Optional: WhatsApp order button per item",
      "Easy to update (admin panel or simple CMS)",
      "No app download required for customers",
    ],
    stack: "Next.js, Sanity or Notion CMS, Vercel",
  },
  {
    id: "retainer",
    name: "Monthly Tech Support Retainer",
    tagline: "An ongoing tech partner, without the overhead of a full-time hire.",
    badge: "retainer" as const,
    deliverables: [
      "Up to 10 hours support per month",
      "Website updates, bug fixes, content changes",
      "Tool troubleshooting (Google Workspace, Square, M-Pesa, etc.)",
      "Monthly 30-min check-in call",
      "Priority response within 4 business hours (weekdays)",
      "Rollover: unused hours carry 1 month",
      "Cancel anytime, no lock-in",
    ],
    stack: "Varies by client stack",
  },
];

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Packisher Technology Services",
  url: "https://packisher.com/services",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Business Website",
      description:
        "Custom-built, mobile-first website for your business. No templates, deployed live within 7 days.",
      url: "https://packisher.com/services",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "M-Pesa Business Integration",
      description:
        "Accept M-Pesa payments on your website or app via the Safaricom Daraja API with full STK Push setup.",
      url: "https://packisher.com/services",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Custom App or Internal Tool",
      description:
        "A web app built for a specific workflow that off-the-shelf tools cannot handle.",
      url: "https://packisher.com/services",
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      {/* Hero */}
      <section className="hero-section" style={{ position: "relative", paddingTop: "96px", paddingBottom: "48px" }}>
        <HeroSketches page="technology" />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "880px", margin: "0 auto", padding: "0 32px", width: "100%" }}>
          <div className="hero-glass" style={{ width: "100%", background: "rgba(245, 242, 236, 0.82)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: "var(--radius-md)", padding: "40px 48px", border: "1px solid rgba(255, 255, 255, 0.68)" }}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={fadeUp}
              style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(48px, 7vw, 80px)", color: "var(--text-primary)", marginBottom: "12px" }}
            >
              Services
            </motion.h1>
            <motion.p variants={fadeUp} style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", marginBottom: "32px" }}>
              Kenya and Canada · Remote delivery · Get a quote after a free call
            </motion.p>
            <motion.div variants={fadeUp}>
              <GlassCard hover={false} style={{ padding: "16px 20px", borderLeft: "3px solid var(--accent-2)" }}>
                <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", lineHeight: 1.6 }}>
                  <span style={{ color: "var(--accent-2)", fontWeight: 600 }}>ℹ</span> Book a free 30-minute call first. We scope the work together and quote from there.
                </p>
              </GlassCard>
            </motion.div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px" }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}
        >
          {services.map((svc) => (
            <motion.div key={svc.id} variants={fadeUp}>
              <GlassCard hover glow style={{ padding: "28px", height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Service name + badge */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                  <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--text-primary)", lineHeight: 1.2 }}>
                    {svc.name}
                  </h2>
                  {svc.badge && <Badge variant={svc.badge}>Retainer</Badge>}
                </div>

                {/* Tagline */}
                <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px", fontStyle: "italic", marginBottom: "12px", lineHeight: 1.5 }}>
                  {svc.tagline}
                </p>

                <div style={{ height: "1px", background: "var(--glass-border)", marginBottom: "16px" }} />

                {/* Deliverables */}
                <p style={{ color: "var(--text-primary)", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", fontWeight: 600, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Deliverables
                </p>
                <ul style={{ paddingLeft: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px", flex: 1 }}>
                  {svc.deliverables.map((d, i) => (
                    <li key={i} style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", lineHeight: 1.5, display: "flex", gap: "8px", alignItems: "flex-start" }}>
                      <span style={{ color: "var(--accent)", marginTop: "2px", flexShrink: 0 }}>—</span>
                      {d}
                    </li>
                  ))}
                </ul>

                {/* Stack */}
                <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", fontStyle: "italic", marginBottom: "20px" }}>
                  Stack: {svc.stack}
                </p>

                {/* CTA */}
                <div>
                  <Button href={`/contact?service=${svc.id}`} variant="primary" size="sm">Get Started</Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
