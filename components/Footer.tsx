import Link from "next/link";

const navLinks = [
  { label: "Trucks", href: "/tipper" },
  { label: "The Journey", href: "/journey" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 10,
        padding: "48px 24px 32px",
        marginTop: "80px",
        background: "rgba(245, 242, 236, 0.97)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        borderTop: "1px solid rgba(122, 92, 56, 0.12)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Row 1 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "9px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/packisher-logo-light.svg" alt="" width={30} height={30} style={{ borderRadius: "6px", display: "block", flexShrink: 0 }} className="logo-light" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/packisher-logo-dark.svg" alt="" width={30} height={30} style={{ borderRadius: "6px", display: "none", flexShrink: 0 }} className="logo-dark" />
            <span
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 800,
                fontSize: "18px",
                color: "var(--accent)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              PACKISHER
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontFamily: "var(--font-inter), sans-serif",
                  transition: "color 0.2s ease",
                }}
                className="footer-link"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <a
              href="https://www.linkedin.com/company/packisher/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-muted)", transition: "color 0.2s ease" }}
              className="footer-link"
              aria-label="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/packisher/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-muted)", transition: "color 0.2s ease" }}
              className="footer-link"
              aria-label="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>

        {/* Row 2 */}
        <div
          style={{
            borderTop: "1px solid var(--glass-border)",
            paddingTop: "24px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "13px",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          Packisher · Trucks
          <br />
          Nairobi, Kenya
          <br />
          © 2026 Packisher. All rights reserved.
        </div>
      </div>
      <style>{`
        .footer-link:hover { color: var(--text-primary) !important; }
        [data-theme=dark] .logo-light { display: none !important; }
        [data-theme=dark] .logo-dark  { display: block !important; }
      `}</style>
    </footer>
  );
}
