"use client";

import { useState, useEffect } from "react";

/* ─── Tech icon SVGs ─────────────────────────────────────── */
const ReactIcon = () => (
  <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="3.5" fill="#61DAFB" />
    <ellipse cx="20" cy="20" rx="17" ry="6.5" stroke="#61DAFB" strokeWidth="2" />
    <ellipse cx="20" cy="20" rx="17" ry="6.5" stroke="#61DAFB" strokeWidth="2" transform="rotate(60 20 20)" />
    <ellipse cx="20" cy="20" rx="17" ry="6.5" stroke="#61DAFB" strokeWidth="2" transform="rotate(120 20 20)" />
  </svg>
);

const NextIcon = () => (
  <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#0a0a0a" />
    <path d="M13 29 L13 11 L29 29 L29 11" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="miter" fill="none" />
  </svg>
);

const VercelIcon = () => (
  <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
    <polygon points="20,5 37,35 3,35" fill="white" />
  </svg>
);

const SquareIcon = () => (
  <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
    <rect x="3" y="3" width="34" height="34" rx="6" stroke="white" strokeWidth="2.5" />
    <rect x="14" y="14" width="12" height="12" rx="2" fill="white" />
  </svg>
);

const ShopifyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
    <path
      d="M27,12 C26,8 22,7 19,8 C15,9 12,13 14,17 C16,20 21,22 23,26 C25,29 22,34 18,34 C15,34 12,32 11,29"
      stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"
    />
  </svg>
);

const SupabaseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
    <path d="M23,3 L11,22 L21,22 L17,37 L29,17 L19,17 Z" fill="#3ECF8E" />
  </svg>
);

/* ── Three new icons ── */
const TwilioIcon = () => (
  <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#F22F46" />
    <circle cx="14" cy="14" r="3.5" fill="white" />
    <circle cx="26" cy="14" r="3.5" fill="white" />
    <circle cx="14" cy="26" r="3.5" fill="white" />
    <circle cx="26" cy="26" r="3.5" fill="white" />
  </svg>
);

const TailwindIcon = () => (
  <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
    <path d="M5,15 C8,8 14,8 20,15 C26,22 32,22 35,15" stroke="#38BDF8" strokeWidth="3.2" strokeLinecap="round" />
    <path d="M5,24 C8,17 14,17 20,24 C26,31 32,31 35,24" stroke="#38BDF8" strokeWidth="3.2" strokeLinecap="round" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="22" height="22" viewBox="0 0 40 40" fill="white">
    <path d="M20,3 C10.6,3 3,10.6 3,20 C3,27.4 7.8,33.6 14.5,35.7 C15.4,35.9 15.7,35.3 15.7,34.9 L15.7,31.8 C11,32.8 10,29.4 10,29.4 C9.2,27.3 8,26.7 8,26.7 C6.3,25.6 8.1,25.6 8.1,25.6 C9.9,25.7 10.9,27.5 10.9,27.5 C12.5,30.2 15.3,29.4 16.3,28.9 C16.5,27.7 16.9,26.9 17.4,26.4 C13.4,25.9 9.2,24.4 9.2,17.4 C9.2,15.4 9.9,13.8 11,12.5 C10.8,12 10.1,10.2 11.2,7.7 C11.2,7.7 12.8,7.2 15.7,9.5 C17,9.1 18.5,8.9 20,8.9 C21.5,8.9 23,9.1 24.3,9.5 C27.2,7.2 28.8,7.7 28.8,7.7 C29.9,10.2 29.2,12 29,12.5 C30.1,13.8 30.8,15.4 30.8,17.4 C30.8,24.4 26.6,25.9 22.6,26.4 C23.2,27 23.8,28.1 23.8,29.8 L23.8,34.9 C23.8,35.3 24.1,35.9 25,35.7 C31.7,33.6 36.5,27.4 36.5,20 C36.5,10.6 28.9,3 20,3 Z" />
  </svg>
);

const ICONS = [
  { name: "React",    bg: "#20232A", Ico: ReactIcon    },
  { name: "Next.js",  bg: "#0a0a0a", Ico: NextIcon     },
  { name: "Vercel",   bg: "#111111", Ico: VercelIcon   },
  { name: "Square",   bg: "#2d3135", Ico: SquareIcon   },
  { name: "Shopify",  bg: "#3d6b1f", Ico: ShopifyIcon  },
  { name: "Supabase", bg: "#1a1a2e", Ico: SupabaseIcon },
  { name: "Twilio",   bg: "#8B0B1A", Ico: TwilioIcon   },
  { name: "Tailwind", bg: "#0c4a6e", Ico: TailwindIcon },
  { name: "GitHub",   bg: "#161b22", Ico: GitHubIcon   },
];

/* ─── Taskbar pinned apps ────────────────────────────────── */
const TaskbarApps = [
  <svg key="folder" width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path d="M2,5 L8,5 L9.5,3 L18,3 L18,17 L2,17 Z" fill="rgba(200,184,154,0.55)" />
    <path d="M2,7 L18,7" stroke="rgba(200,184,154,0.3)" strokeWidth="1" />
  </svg>,
  <svg key="term" width="14" height="14" viewBox="0 0 20 20" fill="none">
    <rect x="1" y="2" width="18" height="16" rx="2" stroke="rgba(200,184,154,0.5)" strokeWidth="1.4" />
    <path d="M5,8 L9,11 L5,14" stroke="rgba(200,184,154,0.65)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M11,14 L15,14" stroke="rgba(200,184,154,0.5)" strokeWidth="1.4" strokeLinecap="round" />
  </svg>,
  <svg key="browser" width="14" height="14" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="rgba(200,184,154,0.5)" strokeWidth="1.4" />
    <path d="M2,10 L18,10" stroke="rgba(200,184,154,0.4)" strokeWidth="1.2" />
    <path d="M10,2 Q14,6 14,10 Q14,14 10,18 Q6,14 6,10 Q6,6 10,2 Z" stroke="rgba(200,184,154,0.4)" strokeWidth="1.2" fill="none" />
  </svg>,
];

/* ─── Component ──────────────────────────────────────────── */
export default function DesktopMockup() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="desktop-mockup-root"
      style={{
        width: "330px",
        borderRadius: "12px",
        overflow: "hidden",
        background: "rgba(245, 242, 236, 0.72)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        border: "1px solid rgba(255, 255, 255, 0.68)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {/* ── Windows-style title bar ── */}
      <div
        style={{
          height: "30px",
          background: "rgba(22, 18, 12, 0.88)",
          display: "flex",
          alignItems: "center",
          padding: "0 0 0 12px",
          flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <span
          style={{
            flex: 1,
            fontSize: "10px",
            color: "rgba(200,184,154,0.65)",
            fontFamily: "var(--font-inter), sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          Packisher Dev Environment
        </span>
        {["−", "□", "×"].map((c, i) => (
          <div
            key={i}
            style={{
              width: "34px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: i === 2 ? "13px" : "11px",
              color: "rgba(200,184,154,0.45)",
              borderRadius: i === 2 ? "0 12px 0 0" : undefined,
            }}
          >
            {c}
          </div>
        ))}
      </div>

      {/* ── Desktop area ── */}
      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(150deg, rgba(228,222,210,0.55) 0%, rgba(210,200,185,0.45) 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          padding: "14px 10px 12px",
          minHeight: "300px",
        }}
      >
        {/* 3-column icon grid, right-aligned */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 48px)",
            columnGap: "8px",
            rowGap: "10px",
          }}
        >
          {ICONS.map(({ name, bg, Ico }) => (
            <div
              key={name}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.24)",
                }}
              >
                <Ico />
              </div>
              <span
                style={{
                  fontSize: "8.5px",
                  color: "rgba(30,20,10,0.7)",
                  fontFamily: "var(--font-inter), sans-serif",
                  textAlign: "center",
                  lineHeight: 1.2,
                  textShadow: "0 1px 2px rgba(255,255,255,0.85)",
                  maxWidth: "46px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Windows taskbar ── */}
      <div
        style={{
          height: "40px",
          background: "rgba(18, 14, 9, 0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
          gap: "6px",
          flexShrink: 0,
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* Windows logo */}
        <div
          style={{
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "5px",
            background: "rgba(200,184,154,0.08)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="0" y="0" width="6" height="6" rx="0.5" fill="rgba(200,184,154,0.75)" />
            <rect x="8" y="0" width="6" height="6" rx="0.5" fill="rgba(200,184,154,0.75)" />
            <rect x="0" y="8" width="6" height="6" rx="0.5" fill="rgba(200,184,154,0.75)" />
            <rect x="8" y="8" width="6" height="6" rx="0.5" fill="rgba(200,184,154,0.75)" />
          </svg>
        </div>

        {/* Search pill */}
        <div
          style={{
            flex: 1,
            height: "24px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            padding: "0 9px",
            gap: "5px",
          }}
        >
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="4" stroke="rgba(200,184,154,0.4)" strokeWidth="1.3" />
            <path d="M8 8 L11 11" stroke="rgba(200,184,154,0.4)" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "9px", color: "rgba(200,184,154,0.32)", fontFamily: "var(--font-inter), sans-serif" }}>
            Search
          </span>
        </div>

        {/* Pinned apps */}
        {TaskbarApps.map((icon, i) => (
          <div
            key={i}
            style={{
              width: "26px",
              height: "26px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {icon}
          </div>
        ))}

        {/* System tray */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "4px" }}>
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M1,3.5 Q6,0 11,3.5" stroke="rgba(200,184,154,0.3)" strokeWidth="1.1" fill="none" />
            <path d="M2.5,5.5 Q6,3 9.5,5.5" stroke="rgba(200,184,154,0.45)" strokeWidth="1.1" fill="none" />
            <path d="M4,7.5 Q6,6 8,7.5" stroke="rgba(200,184,154,0.62)" strokeWidth="1.1" fill="none" />
            <circle cx="6" cy="9.2" r="0.85" fill="rgba(200,184,154,0.72)" />
          </svg>
          <span
            style={{
              fontSize: "9px",
              color: "rgba(200,184,154,0.55)",
              fontFamily: "var(--font-inter), sans-serif",
              letterSpacing: "0.03em",
              minWidth: "30px",
              textAlign: "right",
            }}
          >
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}
