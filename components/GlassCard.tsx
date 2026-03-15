"use client";

import { ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  accent?: "champagne" | "indigo";
  style?: CSSProperties;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  glow = false,
  style,
}: GlassCardProps) {
  const shadow = [
    "0 8px 32px var(--glass-shadow)",
    "inset 0 1px 0 var(--glass-border-top)",
    "inset 0 -1px 0 rgba(0,0,0,0.20)",
    "inset 1px 0 0 var(--glass-inner)",
    "inset -1px 0 0 var(--glass-inner)",
  ].join(", ");

  const shadowHover = [
    glow
      ? "0 16px 48px var(--glass-shadow), 0 0 28px rgba(200,184,154,0.12)"
      : "0 16px 48px var(--glass-shadow)",
    "inset 0 1px 0 var(--glass-border-top)",
    "inset 0 -1px 0 rgba(0,0,0,0.20)",
    "inset 1px 0 0 var(--glass-inner)",
    "inset -1px 0 0 var(--glass-inner)",
  ].join(", ");

  return (
    <motion.div
      className={className}
      style={{
        position: "relative",
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "var(--backdrop)",
        WebkitBackdropFilter: "var(--backdrop)",
        borderRadius: "var(--radius-md)",
        boxShadow: shadow,
        overflow: "hidden",
        ...style,
      }}
      whileHover={
        hover
          ? {
              y: -6,
              scale: 1.01,
              boxShadow: shadowHover,
              borderColor: "rgba(200,184,154,0.30)",
            }
          : undefined
      }
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
    >
      {/* Specular gradient overlay — bright top edge catching light */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40%",
          background:
            "linear-gradient(to bottom, var(--glass-specular) 0%, transparent 100%)",
          borderRadius: "var(--radius-md) var(--radius-md) 0 0",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Content sits above the specular layer */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </motion.div>
  );
}
