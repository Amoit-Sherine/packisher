import { ReactNode, ButtonHTMLAttributes } from "react";
import Link from "next/link";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  href?: string;
  external?: boolean;
  className?: string;
}

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "var(--accent)",
    color: "var(--bg)",
    border: "none",
    fontWeight: 600,
  },
  outline: {
    background: "transparent",
    color: "var(--text-primary)",
    border: "1px solid var(--glass-border)",
    fontWeight: 500,
  },
  ghost: {
    background: "transparent",
    color: "var(--accent)",
    border: "none",
    fontWeight: 500,
    textDecoration: "none",
  },
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  href,
  external,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    ...variantStyles[variant],
    borderRadius: "var(--radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "var(--font-inter), sans-serif",
    letterSpacing: "0.01em",
  };

  const sizeClass = sizeClasses[size];

  if (href && !disabled) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-${variant} ${sizeClass} ${className}`}
          style={baseStyle}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className={`btn-${variant} ${sizeClass} ${className}`}
        style={baseStyle}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`btn-${variant} ${sizeClass} ${className}`}
      style={baseStyle}
      disabled={disabled}
      {...props}
    >
      {children}
      <style>{`
        .btn-primary:hover:not(:disabled) {
          filter: brightness(0.90);
        }
        .btn-outline:hover:not(:disabled) {
          color: var(--accent) !important;
          border-color: var(--accent) !important;
        }
        .btn-ghost:hover:not(:disabled) {
          text-decoration: underline;
        }
      `}</style>
    </button>
  );
}
