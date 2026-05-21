import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabaseServer";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const cookieStore   = cookies();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authCookie    = cookieStore.get("admin_auth")?.value;
  if (!adminPassword || authCookie !== adminPassword) redirect("/admin/login");

  const supabase = getSupabaseServer();
  const today    = new Date().toISOString().split("T")[0];

  const [
    { data: parcels },
    { data: trucks },
    { data: todayRuns },
  ] = await Promise.all([
    supabase
      .from("parcels_bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("truck_bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("parcels_bookings")
      .select("*")
      .eq("preferred_date", today)
      .order("preferred_run", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  return (
    <AdminDashboard
      initialParcels={parcels   ?? []}
      initialTrucks={trucks     ?? []}
      todayRuns={todayRuns      ?? []}
    />
  );
}
