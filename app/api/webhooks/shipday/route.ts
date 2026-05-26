import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseServer } from "@/lib/supabaseServer";

const SHIPDAY_STATUS_MAP: Record<string, string> = {
  ORDER_PLACED: "confirmed",
  ASSIGNED:     "dispatched",
  PICKED_UP:    "dispatched",
  DELIVERED:    "delivered",
  CANCELLED:    "pending",
};

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Validate webhook secret if configured
  const secret = process.env.SHIPDAY_WEBHOOK_SECRET;
  if (secret) {
    const sig = req.headers.get("x-shipday-signature") ?? req.headers.get("signature");
    if (sig !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const shipdayOrderId = String(payload.orderId ?? payload.order_id ?? "");
  const shipdayStatus  = String(payload.status ?? payload.orderStatus ?? "");
  const photoUrl       = String(payload.deliveryPhotoUrl ?? payload.delivery_photo_url ?? "");

  if (!shipdayOrderId) return NextResponse.json({ ok: true });

  const status = SHIPDAY_STATUS_MAP[shipdayStatus] ?? null;
  if (!status) return NextResponse.json({ ok: true });

  const supabase = getSupabaseServer();

  const { data: booking } = await supabase
    .from("parcels_bookings")
    .select("id, reference, receiver_name, dropoff_address, pickup_address, item_description, quoted_price")
    .eq("shipday_order_id", shipdayOrderId)
    .single();

  if (!booking) return NextResponse.json({ ok: true });

  const update: Record<string, unknown> = { status };
  if (photoUrl) update.delivery_photo_url = photoUrl;

  await supabase.from("parcels_bookings").update(update).eq("id", booking.id);

  // Send delivery confirmation email on delivered status
  if (status === "delivered") {
    const resendKey = process.env.RESEND_API_KEY;
    const emailTo   = process.env.CONTACT_EMAIL_TO;
    if (resendKey && emailTo) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from:    "Packisher Logistics <bookings@packisher.com>",
          to:      emailTo,
          subject: `Delivery Complete — ${booking.reference}`,
          html: `
            <h2>Delivery Complete</h2>
            <p><strong>Reference:</strong> ${booking.reference}</p>
            <hr/>
            <p><strong>Item:</strong> ${booking.item_description}</p>
            <p><strong>Pickup:</strong> ${booking.pickup_address}</p>
            <p><strong>Delivered to:</strong> ${booking.receiver_name} at ${booking.dropoff_address}</p>
            <p><strong>Price paid:</strong> KES ${booking.quoted_price}</p>
            ${photoUrl ? `<p><strong>Delivery photo:</strong><br/><img src="${photoUrl}" alt="Delivery confirmation" style="max-width:400px;border-radius:8px;" /></p>` : ""}
            <hr/>
            <p>Thank you for choosing Packisher.</p>
          `,
        });
      } catch {
        // Non-fatal
      }
    }
  }

  return NextResponse.json({ ok: true });
}
