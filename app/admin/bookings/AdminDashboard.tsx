"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ParcelRow = {
  id: string;
  reference: string | null;
  sender_name: string;
  sender_phone: string;
  receiver_name: string;
  receiver_phone: string;
  pickup_address: string;
  dropoff_address: string;
  item_description: string;
  fragility: string;
  vehicle_type: string;
  timing: string;
  preferred_run: string | null;
  preferred_date: string | null;
  quoted_price: number;
  distance_km: number;
  status: string;
  created_at: string;
};

type TruckRow = {
  id: string;
  reference: string | null;
  contact_name: string;
  contact_phone: string;
  material: string;
  material_other: string | null;
  quantity_trucks: number;
  delivery_address: string;
  preferred_date: string;
  preferred_time_window: string;
  quoted_price: number;
  distance_km: number;
  status: string;
  assigned_driver: string | null;
  created_at: string;
};

const STATUSES = ["pending", "confirmed", "dispatched", "delivered"] as const;

const statusColor: Record<string, string> = {
  pending:    "rgba(217,119,6,0.12)",
  confirmed:  "rgba(22,163,74,0.12)",
  dispatched: "rgba(37,99,235,0.12)",
  delivered:  "rgba(122,92,56,0.12)",
};
const statusText: Record<string, string> = {
  pending:    "#b45309",
  confirmed:  "#15803d",
  dispatched: "#1d4ed8",
  delivered:  "var(--accent)",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      padding: "3px 10px",
      borderRadius: "999px",
      background: statusColor[status] ?? "rgba(0,0,0,0.06)",
      color: statusText[status] ?? "var(--text-muted)",
      fontFamily: "var(--font-inter), sans-serif",
      fontSize: "11px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}

function shortRef(ref: string | null, id: string) {
  return ref ? ref.replace("PKS-P-", "P-").replace("PKS-T-", "T-") : id.slice(0, 8).toUpperCase();
}

function fmt(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

const thStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--text-muted)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  padding: "10px 14px",
  textAlign: "left",
  whiteSpace: "nowrap",
  background: "rgba(122,92,56,0.04)",
  borderBottom: "1px solid var(--glass-border)",
};

const tdStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "13px",
  color: "var(--text-primary)",
  padding: "10px 14px",
  borderBottom: "1px solid rgba(122,92,56,0.06)",
  verticalAlign: "top",
  maxWidth: "220px",
  wordBreak: "break-word",
};

const selectStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "12px",
  padding: "4px 8px",
  borderRadius: "6px",
  border: "1px solid var(--glass-border)",
  background: "rgba(255,255,255,0.7)",
  cursor: "pointer",
  color: "var(--text-primary)",
};

export default function AdminDashboard({
  initialParcels,
  initialTrucks,
  todayRuns,
}: {
  initialParcels: ParcelRow[];
  initialTrucks: TruckRow[];
  todayRuns: ParcelRow[];
}) {
  const router = useRouter();
  const [tab,     setTab]     = useState<"today" | "parcels" | "trucks">("today");
  const [parcels, setParcels] = useState(initialParcels);
  const [trucks,  setTrucks]  = useState(initialTrucks);
  const [runs,    setRuns]    = useState(todayRuns);

  const patch = async (
    id: string,
    table: "parcels_bookings" | "truck_bookings",
    update: { status?: string; assigned_driver?: string },
  ) => {
    await fetch(`/api/admin/bookings/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...update, table }),
    });
  };

  const handleStatusChange = async (
    id: string,
    table: "parcels_bookings" | "truck_bookings",
    status: string,
    list: "parcels" | "trucks" | "runs",
  ) => {
    await patch(id, table, { status });
    if (list === "runs") {
      setRuns((prev)    => prev.map((r) => r.id === id ? { ...r, status } : r));
      setParcels((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    } else if (list === "parcels") {
      setParcels((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    } else {
      setTrucks((prev)  => prev.map((r) => r.id === id ? { ...r, status } : r));
    }
  };

  const handleDriverChange = async (id: string, assigned_driver: string) => {
    await patch(id, "truck_bookings", { assigned_driver });
    setTrucks((prev) => prev.map((r) => r.id === id ? { ...r, assigned_driver } : r));
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const morningRuns = runs.filter((r) => r.preferred_run === "morning");
  const eveningRuns = runs.filter((r) => r.preferred_run === "evening");
  const urgentRuns  = runs.filter((r) => r.preferred_run === "urgent");

  function RunCard({ row, list }: { row: ParcelRow; list: "runs" }) {
    return (
      <div style={{
        background: "rgba(255,255,255,0.6)",
        border: "1px solid var(--glass-border)",
        borderRadius: "10px",
        padding: "14px 16px",
        marginBottom: "10px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, fontSize: "13px", color: "var(--accent)" }}>
            {shortRef(row.reference, row.id)}
          </span>
          <StatusBadge status={row.status} />
        </div>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "var(--text-primary)", marginBottom: "2px" }}>
          {row.sender_name} → {row.receiver_name}
        </p>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
          {row.pickup_address.split(",").slice(0, 2).join(",")}
        </p>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
          {row.item_description} · {row.vehicle_type.toUpperCase()} · KES {row.quoted_price?.toLocaleString()}
        </p>
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, "parcels_bookings", e.target.value, list)}
          style={selectStyle}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "32px 24px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "4px" }}>
              Packisher Admin
            </p>
            <h1 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "clamp(24px, 4vw, 36px)", color: "var(--text-primary)" }}>
              Bookings
            </h1>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: "transparent", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", padding: "10px 18px", fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", cursor: "pointer" }}
          >
            Sign out
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "rgba(122,92,56,0.06)", padding: "4px", borderRadius: "10px", width: "fit-content" }}>
          {([
            ["today",   "Today's Runs"],
            ["parcels", `Parcels (${parcels.length})`],
            ["trucks",  `Trucks (${trucks.length})`],
          ] as const).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 20px",
                borderRadius: "7px",
                border: "none",
                background: tab === t ? "var(--bg)" : "transparent",
                boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "13px",
                fontWeight: tab === t ? 700 : 500,
                color: tab === t ? "var(--accent)" : "var(--text-muted)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── TODAY'S RUNS ── */}
        {tab === "today" && (
          <div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px" }}>
              {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            {runs.length === 0 ? (
              <div style={{ padding: "48px", textAlign: "center", background: "rgba(255,255,255,0.5)", border: "1px solid var(--glass-border)", borderRadius: "12px" }}>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", color: "var(--text-muted)" }}>
                  No bookings scheduled for today.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                {/* Morning run */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
                    <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "18px", color: "var(--text-primary)" }}>
                      Mid-Morning Run
                    </h2>
                    <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                      10:00am
                    </span>
                  </div>
                  {morningRuns.length === 0 ? (
                    <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "var(--text-muted)", padding: "20px 0" }}>
                      No morning bookings.
                    </p>
                  ) : (
                    morningRuns.map((row) => <RunCard key={row.id} row={row} list="runs" />)
                  )}
                </div>

                {/* Evening run */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#6366f1" }} />
                    <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "18px", color: "var(--text-primary)" }}>
                      Evening Run
                    </h2>
                    <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                      5:30pm
                    </span>
                  </div>
                  {eveningRuns.length === 0 ? (
                    <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "var(--text-muted)", padding: "20px 0" }}>
                      No evening bookings.
                    </p>
                  ) : (
                    eveningRuns.map((row) => <RunCard key={row.id} row={row} list="runs" />)
                  )}
                </div>

                {/* Urgent (if any) */}
                {urgentRuns.length > 0 && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
                      <h2 style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "18px", color: "var(--text-primary)" }}>
                        Urgent
                      </h2>
                      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", color: "#b91c1c", fontWeight: 600 }}>
                        Within 1 hr
                      </span>
                    </div>
                    {urgentRuns.map((row) => <RunCard key={row.id} row={row} list="runs" />)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── ALL PARCELS ── */}
        {tab === "parcels" && (
          <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.55)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Ref", "Sender", "Phone", "Pickup → Dropoff", "Item", "Vehicle", "Timing", "Run", "Price", "Status", "Created"].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parcels.length === 0 && (
                  <tr>
                    <td colSpan={11} style={{ ...tdStyle, textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
                      No parcel bookings yet.
                    </td>
                  </tr>
                )}
                {parcels.map((row) => (
                  <tr key={row.id}>
                    <td style={{ ...tdStyle, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, color: "var(--accent)", fontSize: "12px", whiteSpace: "nowrap" }}>
                      {shortRef(row.reference, row.id)}
                    </td>
                    <td style={tdStyle}>{row.sender_name}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{row.sender_phone}</td>
                    <td style={{ ...tdStyle, maxWidth: "260px" }}>
                      <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>FROM</span>{" "}
                      {row.pickup_address}
                      <br />
                      <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>TO</span>{" "}
                      {row.dropoff_address}
                    </td>
                    <td style={tdStyle}>
                      {row.item_description}
                      <br />
                      <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>{row.fragility.replace(/_/g, " ")}</span>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap", textTransform: "capitalize" }}>{row.vehicle_type}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{row.timing.replace(/_/g, " ")}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                      {row.preferred_run ?? "—"}
                      {row.preferred_date && (
                        <><br /><span style={{ color: "var(--text-muted)", fontSize: "11px" }}>{row.preferred_date}</span></>
                      )}
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap", fontWeight: 600 }}>KES {row.quoted_price?.toLocaleString()}</td>
                    <td style={tdStyle}>
                      <select
                        value={row.status}
                        onChange={(e) => handleStatusChange(row.id, "parcels_bookings", e.target.value, "parcels")}
                        style={selectStyle}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <div style={{ marginTop: "6px" }}><StatusBadge status={row.status} /></div>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap", color: "var(--text-muted)" }}>{fmt(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── ALL TRUCKS ── */}
        {tab === "trucks" && (
          <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.55)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Ref", "Contact", "Phone", "Material", "Qty", "Delivery Location", "Date", "Time Window", "Price", "Status", "Driver", "Created"].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trucks.length === 0 && (
                  <tr>
                    <td colSpan={12} style={{ ...tdStyle, textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
                      No truck bookings yet.
                    </td>
                  </tr>
                )}
                {trucks.map((row) => (
                  <tr key={row.id}>
                    <td style={{ ...tdStyle, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 700, color: "var(--accent)", fontSize: "12px", whiteSpace: "nowrap" }}>
                      {shortRef(row.reference, row.id)}
                    </td>
                    <td style={tdStyle}>{row.contact_name}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{row.contact_phone}</td>
                    <td style={tdStyle}>
                      {row.material === "other" ? (row.material_other ?? "Other") : row.material.replace(/_/g, " ")}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{row.quantity_trucks}</td>
                    <td style={{ ...tdStyle, maxWidth: "200px" }}>{row.delivery_address}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{row.preferred_date}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap", textTransform: "capitalize" }}>{row.preferred_time_window}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap", fontWeight: 600 }}>KES {row.quoted_price?.toLocaleString()}</td>
                    <td style={tdStyle}>
                      <select
                        value={row.status}
                        onChange={(e) => handleStatusChange(row.id, "truck_bookings", e.target.value, "trucks")}
                        style={selectStyle}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <div style={{ marginTop: "6px" }}><StatusBadge status={row.status} /></div>
                    </td>
                    <td style={tdStyle}>
                      <input
                        defaultValue={row.assigned_driver ?? ""}
                        placeholder="Assign driver…"
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          if (val !== (row.assigned_driver ?? "")) handleDriverChange(row.id, val);
                        }}
                        style={{ ...selectStyle, width: "120px", padding: "5px 8px" }}
                      />
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap", color: "var(--text-muted)" }}>{fmt(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px", color: "var(--text-muted)", marginTop: "16px", textAlign: "center" }}>
          {tab !== "today" ? "Showing last 50 bookings. Refresh to see new entries." : "Refresh to see new entries."}
        </p>
      </div>
    </div>
  );
}
