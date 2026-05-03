"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Parcels", href: "/parcels" },
  { label: "Tipper", href: "/tipper" },
  { label: "The Journey", href: "/journey" },
  { label: "About", href: "/about" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled
            ? "rgba(245, 242, 236, 0.96)"
            : "rgba(245, 242, 236, 0.85)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          borderBottom: "1px solid transparent",
          transition: "background 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/packisher-logo-light.svg" alt="" width={36} height={36} style={{ borderRadius: "8px", display: "block", flexShrink: 0 }} className="logo-light" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/packisher-logo-dark.svg" alt="" width={36} height={36} style={{ borderRadius: "8px", display: "none", flexShrink: 0 }} className="logo-dark" />
            <span
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 800,
                fontSize: "20px",
                color: "var(--accent)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              PACKISHER
            </span>
          </Link>

          {/* Desktop links */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: "none",
                  color: isActive(link.href) ? "var(--accent)" : "var(--text-muted)",
                  fontSize: "15px",
                  fontWeight: 500,
                  fontFamily: "var(--font-inter), sans-serif",
                  borderBottom: isActive(link.href) ? "1px solid var(--accent)" : "1px solid transparent",
                  paddingBottom: "2px",
                  transition: "color 0.2s ease",
                }}
                className="nav-link"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/tipper#booking"
              style={{
                padding: "8px 18px",
                border: "1px solid var(--accent)",
                borderRadius: "var(--radius-sm)",
                color: "var(--accent)",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "var(--font-inter), sans-serif",
                textDecoration: "none",
                transition: "all 0.2s ease",
                letterSpacing: "0.02em",
              }}
              className="book-btn"
            >
              Book a Tipper
            </Link>

            <style>{`
              .book-btn:hover {
                background: rgba(122, 92, 56, 0.1) !important;
                box-shadow: 0 0 16px rgba(122, 92, 56, 0.12);
              }
              .nav-link:hover {
                color: var(--text-primary) !important;
              }
              [data-theme=dark] .logo-light { display: none !important; }
              [data-theme=dark] .logo-dark  { display: block !important; }
              @media (max-width: 768px) {
                .desktop-nav { display: none !important; }
              }
            `}</style>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              color: "var(--text-primary)",
              display: "none",
            }}
            aria-label="Toggle menu"
          >
            <div style={{ width: "22px", display: "flex", flexDirection: "column", gap: "5px" }}>
              <span style={{ height: "2px", background: menuOpen ? "var(--accent)" : "var(--text-primary)", transition: "all 0.3s ease", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none", display: "block" }} />
              <span style={{ height: "2px", background: menuOpen ? "var(--accent)" : "var(--text-primary)", transition: "all 0.3s ease", opacity: menuOpen ? 0 : 1, display: "block" }} />
              <span style={{ height: "2px", background: menuOpen ? "var(--accent)" : "var(--text-primary)", transition: "all 0.3s ease", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none", display: "block" }} />
            </div>
            <style>{`
              @media (max-width: 768px) {
                .hamburger { display: block !important; }
              }
            `}</style>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              background: "rgba(245, 242, 236, 0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
            }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={link.href}
                  style={{
                    textDecoration: "none",
                    color: isActive(link.href) ? "var(--accent)" : "var(--text-primary)",
                    fontSize: "28px",
                    fontFamily: "var(--font-barlow), sans-serif",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.07 }}
            >
              <Link
                href="/tipper#booking"
                style={{
                  padding: "14px 32px",
                  border: "1px solid var(--accent)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--accent)",
                  fontSize: "16px",
                  fontWeight: 700,
                  fontFamily: "var(--font-barlow), sans-serif",
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Book a Tipper
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
