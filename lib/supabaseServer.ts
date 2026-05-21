import { createClient } from "@supabase/supabase-js";

// Server-only — uses service role key, never imported in client components
export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server env vars not configured");
  // Strip trailing slash — a trailing slash produces a double-slash in the
  // PostgREST path (e.g. //rest/v1/parcels_bookings) which triggers PGRST125.
  return createClient(url.replace(/\/$/, ""), key, { auth: { persistSession: false } });
}
