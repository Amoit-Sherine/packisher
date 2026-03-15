"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const mainLinks = [
  { label: "Technology", href: "/services" },
];

const venturesLinks = [
  { label: "Overview", href: "/ventures" },
  { label: "Marketplace", href: "/ventures/marketplace" },
];

const companyLinks = [
  { label: "About", href: "/about" },
];

const mobileLinks = [
  { label: "Technology", href: "/services" },
  { label: "Ventures", href: "/ventures" },
  { label: "Marketplace", href: "/ventures/marketplace" },
  { label: "About", href: "/about" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [venturesOpen, setVenturesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
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
            ? "rgba(245, 242, 236, 0.92)"
            : "rgba(245, 242, 236, 0.75)",
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
            <img src="/packisher-logo-dark.svg"  alt="" width={36} height={36} style={{ borderRadius: "8px", display: "none",  flexShrink: 0 }} className="logo-dark"  />
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
          <div
            className="desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: "32px" }}
          >
            {mainLinks.map((link) => (
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

            {/* Ventures dropdown */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setVenturesOpen(true)}
              onMouseLeave={() => setVenturesOpen(false)}
            >
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: isActive("/ventures") ? "var(--accent)" : "var(--text-muted)",
                  fontSize: "15px",
                  fontWeight: 500,
                  fontFamily: "var(--font-inter), sans-serif",
                  padding: "0 0 2px 0",
                  borderBottom: isActive("/ventures") ? "1px solid var(--accent)" : "1px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "color 0.2s ease",
                }}
                className="nav-link"
                aria-haspopup="true"
                aria-expanded={venturesOpen}
              >
                Ventures
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{
                    transition: "transform 0.2s ease",
                    transform: venturesOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path d="M2 4l4 4 4-4" />
                </svg>
              </button>

              <AnimatePresence>
                {venturesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="nav-dropdown"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 12px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      borderRadius: "var(--radius-sm)",
                      padding: "8px",
                      minWidth: "160px",
                      zIndex: 200,
                    }}
                  >
                    {venturesLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Company dropdown */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setCompanyOpen(true)}
              onMouseLeave={() => setCompanyOpen(false)}
            >
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: isActive("/about") ? "var(--accent)" : "var(--text-muted)",
                  fontSize: "15px",
                  fontWeight: 500,
                  fontFamily: "var(--font-inter), sans-serif",
                  padding: "0 0 2px 0",
                  borderBottom: isActive("/about") ? "1px solid var(--accent)" : "1px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "color 0.2s ease",
                }}
                className="nav-link"
                aria-haspopup="true"
                aria-expanded={companyOpen}
              >
                Company
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{
                    transition: "transform 0.2s ease",
                    transform: companyOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path d="M2 4l4 4 4-4" />
                </svg>
              </button>

              <AnimatePresence>
                {companyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="nav-dropdown"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 12px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      borderRadius: "var(--radius-sm)",
                      padding: "8px",
                      minWidth: "160px",
                      zIndex: 200,
                    }}
                  >
                    {companyLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/contact"
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
              Contact Us
            </Link>

            <style>{`
              .book-btn:hover {
                background: rgba(200, 184, 154, 0.1) !important;
                box-shadow: 0 0 16px rgba(200, 184, 154, 0.12);
              }
              .nav-link:hover, .desktop-nav button.nav-link:hover {
                color: var(--text-primary) !important;
              }
              .nav-dropdown {
                background: rgb(245, 242, 236);
                border: 1px solid rgba(200, 184, 154, 0.22);
                box-shadow: 0 8px 28px rgba(0, 0, 0, 0.09);
              }
              [data-theme=dark] .nav-dropdown {
                background: rgb(15, 15, 22);
                border: 1px solid rgba(255, 255, 255, 0.09);
                box-shadow: 0 8px 28px rgba(0, 0, 0, 0.4);
              }
              .nav-dropdown a {
                color: var(--text-secondary);
                font-size: 15px;
                padding: 10px 20px;
                display: block;
                border-radius: 4px;
                text-decoration: none;
                font-family: var(--font-inter), sans-serif;
                font-weight: 500;
                transition: color 0.2s ease;
              }
              .nav-dropdown a:hover {
                color: var(--accent) !important;
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
              <span
                style={{
                  height: "2px",
                  background: menuOpen ? "var(--accent)" : "var(--text-primary)",
                  transition: "all 0.3s ease",
                  transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
                  display: "block",
                }}
              />
              <span
                style={{
                  height: "2px",
                  background: menuOpen ? "var(--accent)" : "var(--text-primary)",
                  transition: "all 0.3s ease",
                  opacity: menuOpen ? 0 : 1,
                  display: "block",
                }}
              />
              <span
                style={{
                  height: "2px",
                  background: menuOpen ? "var(--accent)" : "var(--text-primary)",
                  transition: "all 0.3s ease",
                  transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
                  display: "block",
                }}
              />
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
            className="mobile-menu-overlay"
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
            {mobileLinks.map((link, i) => (
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
              transition={{ delay: mobileLinks.length * 0.07 }}
            >
              <Link
                href="/contact"
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
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
