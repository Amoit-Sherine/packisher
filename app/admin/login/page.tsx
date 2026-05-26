"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin/bookings");
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: "24px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "380px",
        background: "rgba(245,242,236,0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--glass-border)",
        borderRadius: "16px",
        padding: "40px 36px",
      }}>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px" }}>
          Packisher
        </p>
        <h1 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "28px", color: "var(--text-primary)", marginBottom: "28px" }}>
          Admin
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.6)",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--radius-sm)",
                padding: "12px 16px",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "15px",
                color: "var(--text-primary)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "#c0392b" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              background: loading || !password ? "rgba(122,92,56,0.4)" : "var(--accent)",
              color: "var(--bg)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "14px",
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              cursor: loading || !password ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Checking…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
