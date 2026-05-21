import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabaseServer";

const VALID_STATUSES = ["pending", "confirmed", "dispatched", "delivered"] as const;

const bodySchema = z
  .object({
    status:          z.enum(VALID_STATUSES).optional(),
    assigned_driver: z.string().optional(),
    table:           z.enum(["parcels_bookings", "truck_bookings"]),
  })
  .refine((d) => d.status !== undefined || d.assigned_driver !== undefined, {
    message: "At least one of status or assigned_driver is required",
  });

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  // Auth via httpOnly cookie set at login — no password ever touches the client bundle
  const adminPassword = process.env.ADMIN_PASSWORD;
  const cookie        = req.cookies.get("admin_auth")?.value;
  if (!adminPassword || cookie !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Missing booking id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update data" }, { status: 400 });
  }

  const { status, assigned_driver, table } = parsed.data;

  try {
    const supabase = getSupabaseServer();
    const update: Record<string, string> = {};
    if (status          !== undefined) update.status          = status;
    if (assigned_driver !== undefined) update.assigned_driver = assigned_driver;

    const { error } = await supabase.from(table).update(update).eq("id", id);
    if (error) {
      return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}
