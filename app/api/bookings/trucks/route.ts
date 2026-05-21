import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { truckSchema, TruckInquiryInput } from "@/lib/schemas/truck";

const isDev = process.env.NODE_ENV === "development";

// Human-readable labels for email
const MATERIAL_LABELS: Record<string, string> = {
  river_sand:           "River Sand",
  plasta_sand:          "Plasta Sand",
  ballast_machine_cut:  "Ballast (Machine Cut)",
  ballast_manual_cut:   "Ballast (Manual Cut)",
  murram:               "Murram",
  hardcore:             "Hardcore",
  topsoil:              "Topsoil",
  building_stones:      "Building Stones",
  sugarcane:            "Sugarcane",
  maize_bulk:           "Maize (Bulk)",
  other_produce:        "Other Produce",
  construction_debris:  "Construction Debris",
  soil_excavation:      "Soil Excavation",
  land_clearing_waste:  "Land Clearing Waste",
  other:                "Other",
};

const GOODS_LABELS: Record<string, string> = {
  sugarcane_factory:          "Sugarcane (to factory)",
  maize_produce_market:       "Maize / Produce (to market)",
  construction_debris:        "Construction Debris",
  soil_excavation_waste:      "Soil / Excavation Waste",
  sand_ballast_sourced:       "Sand or Ballast (already sourced)",
  building_materials_sourced: "Building Materials (already sourced)",
  other:                      "Other",
};

function buildEmail(data: TruckInquiryInput, reference: string): string {
  const serviceLabel = data.service_type === "material_delivery"
    ? "Deliver Materials to Me"
    : "Move My Goods";

  const contactSection = `
    <h3 style="margin:16px 0 6px;color:#7A5C38;">Contact</h3>
    <p style="margin:0;line-height:1.6;">
      <strong>Name:</strong> ${data.contact_name}<br>
      <strong>Phone / WhatsApp:</strong> ${data.contact_phone}<br>
      <strong>Email:</strong> ${data.contact_email ?? "—"}
    </p>`;

  let detailSection = "";
  let locationSection = "";

  if (data.service_type === "material_delivery") {
    const materialLabel = data.material === "other"
      ? (data.material_other ?? "Other")
      : (MATERIAL_LABELS[data.material] ?? data.material);

    detailSection = `
      <h3 style="margin:16px 0 6px;color:#7A5C38;">Material</h3>
      <p style="margin:0;line-height:1.6;">
        ${materialLabel} × ${data.quantity_trucks} truck${data.quantity_trucks > 1 ? "s" : ""}
      </p>`;

    locationSection = `
      <h3 style="margin:16px 0 6px;color:#7A5C38;">Delivery Location</h3>
      <p style="margin:0;line-height:1.6;">
        ${data.delivery_address}<br>
        <span style="color:#888;font-size:12px;">Coordinates: ${data.delivery_lat}, ${data.delivery_lng}</span>
      </p>
      ${data.delivery_notes ? `<p style="margin:6px 0 0;color:#555;">Notes: ${data.delivery_notes}</p>` : ""}`;
  } else {
    const goodsLabel = data.goods_type === "other"
      ? (data.goods_other ?? "Other")
      : (GOODS_LABELS[data.goods_type] ?? data.goods_type);

    detailSection = `
      <h3 style="margin:16px 0 6px;color:#7A5C38;">Goods</h3>
      <p style="margin:0;line-height:1.6;">
        ${goodsLabel} × ${data.quantity_trucks} truck${data.quantity_trucks > 1 ? "s" : ""}
      </p>`;

    locationSection = `
      <h3 style="margin:16px 0 6px;color:#7A5C38;">Pickup Location</h3>
      <p style="margin:0;line-height:1.6;">
        ${data.pickup_address}<br>
        <span style="color:#888;font-size:12px;">Coordinates: ${data.pickup_lat}, ${data.pickup_lng}</span>
      </p>
      ${data.pickup_notes ? `<p style="margin:6px 0 0;color:#555;">Notes: ${data.pickup_notes}</p>` : ""}
      <h3 style="margin:16px 0 6px;color:#7A5C38;">Dropoff Location</h3>
      <p style="margin:0;line-height:1.6;">
        ${data.dropoff_address}<br>
        <span style="color:#888;font-size:12px;">Coordinates: ${data.dropoff_lat}, ${data.dropoff_lng}</span>
      </p>
      ${data.dropoff_notes ? `<p style="margin:6px 0 0;color:#555;">Notes: ${data.dropoff_notes}</p>` : ""}`;
  }

  const timeLabel = data.preferred_time === "morning" ? "Morning (7am–12pm)" : "Afternoon (12pm–5pm)";

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
      <div style="background:#7A5C38;padding:24px 28px;border-radius:8px 8px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:22px;">New Truck Inquiry</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">${reference}</p>
      </div>
      <div style="border:1px solid #e5e0d8;border-top:none;padding:24px 28px;border-radius:0 0 8px 8px;">

        <h3 style="margin:0 0 6px;color:#7A5C38;">Service</h3>
        <p style="margin:0;line-height:1.6;">${serviceLabel}</p>

        ${contactSection}
        ${detailSection}
        ${locationSection}

        <h3 style="margin:16px 0 6px;color:#7A5C38;">Schedule</h3>
        <p style="margin:0;line-height:1.6;">
          <strong>Date:</strong> ${data.preferred_date}<br>
          <strong>Time:</strong> ${timeLabel}
        </p>

        ${data.additional_notes ? `
        <h3 style="margin:16px 0 6px;color:#7A5C38;">Additional Notes</h3>
        <p style="margin:0;line-height:1.6;">${data.additional_notes}</p>` : ""}

        <hr style="margin:24px 0;border:none;border-top:1px solid #e5e0d8;">
        <p style="margin:0;color:#999;font-size:12px;">
          Packisher Truck Inquiry · ${new Date().toISOString()}
        </p>
      </div>
    </body>
    </html>`;
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!rateLimit(ip).allowed) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or WhatsApp us directly." },
      { status: 400 },
    );
  }

  const parsed = truckSchema.safeParse(body);
  if (!parsed.success) {
    if (isDev) console.error("[trucks/route] validation error:", parsed.error.flatten());
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or WhatsApp us directly." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const reference = `PKS-T-${Date.now()}`;

  try {
    const supabase = getSupabaseServer();

    // Build the insert row for both service types
    const insertRow =
      data.service_type === "material_delivery"
        ? {
            reference,
            service_type:      "material_delivery",
            contact_name:      data.contact_name,
            contact_phone:     data.contact_phone,
            contact_email:     data.contact_email ?? null,
            material:          data.material,
            material_other:    data.material_other ?? null,
            quantity_trucks:   data.quantity_trucks,
            delivery_address:  data.delivery_address,
            delivery_lat:      data.delivery_lat,
            delivery_lng:      data.delivery_lng,
            delivery_notes:    data.delivery_notes ?? null,
            pickup_address:    null,
            pickup_lat:        null,
            pickup_lng:        null,
            pickup_notes:      null,
            preferred_date:    data.preferred_date,
            preferred_time_window: data.preferred_time,
            notes:             data.additional_notes ?? null,
            status:            "pending_quote",
          }
        : {
            reference,
            service_type:      "move_goods",
            contact_name:      data.contact_name,
            contact_phone:     data.contact_phone,
            contact_email:     data.contact_email ?? null,
            goods_type:        data.goods_type,
            goods_other:       data.goods_other ?? null,
            quantity_trucks:   data.quantity_trucks,
            pickup_address:    data.pickup_address,
            pickup_lat:        data.pickup_lat,
            pickup_lng:        data.pickup_lng,
            pickup_notes:      data.pickup_notes ?? null,
            // Dropoff stored in delivery columns
            delivery_address:  data.dropoff_address,
            delivery_lat:      data.dropoff_lat,
            delivery_lng:      data.dropoff_lng,
            delivery_notes:    data.dropoff_notes ?? null,
            preferred_date:    data.preferred_date,
            preferred_time_window: data.preferred_time,
            notes:             data.additional_notes ?? null,
            status:            "pending_quote",
          };

    const { error: insertError } = await supabase
      .from("truck_bookings")
      .insert(insertRow);

    if (insertError) {
      if (isDev) console.error("[trucks/route] insert error:", insertError);
      return NextResponse.json(
        { success: false, message: "Something went wrong. Please try again or WhatsApp us directly." },
        { status: 500 },
      );
    }

    // Notification email — non-blocking, never surfaces errors to client
    const resendKey = process.env.RESEND_API_KEY;
    const emailTo   = process.env.CONTACT_EMAIL_TO;
    if (resendKey && emailTo) {
      try {
        const serviceLabel = data.service_type === "material_delivery"
          ? "Material Delivery"
          : "Move Goods";
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from:    "Packisher Bookings <bookings@packisher.com>",
          to:      emailTo,
          subject: `New Truck Inquiry — ${serviceLabel} — ${reference}`,
          html:    buildEmail(data, reference),
        });
      } catch (e) {
        if (isDev) console.error("[trucks/route] email error:", e);
      }
    }

    return NextResponse.json({ success: true, reference });
  } catch (e) {
    if (isDev) console.error("[trucks/route] unexpected error:", e);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or WhatsApp us directly." },
      { status: 500 },
    );
  }
}
