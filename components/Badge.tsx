type Variant = "tech" | "live" | "soon" | "retainer" | "active" | "section";

interface BadgeProps {
  variant: Variant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<Variant, React.CSSProperties> = {
  tech: {
    background: "rgba(155, 145, 212, 0.15)",
    color: "var(--accent-2)",
    border: "1px solid rgba(155, 145, 212, 0.25)",
  },
  live: {
    background: "rgba(74, 222, 128, 0.12)",
    color: "var(--status-live)",
    border: "1px solid rgba(74, 222, 128, 0.25)",
  },
  soon: {
    background: "rgba(155, 145, 212, 0.12)",
    color: "var(--status-soon-text)",
    border: "1px solid var(--card-soon-border)",
  },
  retainer: {
    background: "rgba(155, 145, 212, 0.15)",
    color: "var(--accent-2)",
    border: "1px solid rgba(155, 145, 212, 0.25)",
  },
  active: {
    background: "rgba(200, 184, 154, 0.18)",
    color: "var(--accent)",
    border: "1px solid rgba(200, 184, 154, 0.35)",
  },
  section: {
    background: "rgba(100, 100, 100, 0.08)",
    color: "var(--text-muted)",
    border: "1px solid var(--glass-border)",
  },
};

export default function Badge({ variant, children, className = "" }: BadgeProps) {
  return (
    <span
      className={`badge ${className}`}
      style={{
        ...styles[variant],
        padding: "3px 10px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        display: "inline-block",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      {children}
    </span>
  );
}
