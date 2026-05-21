import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { parcelSchema } from "@/lib/schemas/parcel";
import { calculateParcelPrice } from "@/config/rates";
import { assignRunSlot } from "@/lib/runs";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function getDistanceKm(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
): Promise<number> {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) throw new Error("Maps server key not configured");

  const url =
    `https://maps.googleapis.com/maps/api/distancematrix/json` +
    `?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&units=metric&key=${key}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Distance Matrix request failed");
  const json = await res.json();
  const element = json?.rows?.[0]?.elements?.[0];
  if (element?.status !== "OK") throw new Error("No route found");
  return element.distance.value / 1000;
}

async function createShipdayOrder(payload: {
  orderNumber: string;
  senderName: string;
  senderPhone: string;
  pickupAddress: string;
  receiverName: string;
  receiverPhone: string;
  dropoffAddress: string;
  itemDescription: string;
  fragility: string;
  vehicleType: string;
  pickupNotes: string;
  expectedDeliveryDate: string;
  expectedPickupTime: string;
  expectedDeliveryTime: string;
  price: number;
}): Promise<string | null> {
  const key = process.env.SHIPDAY_API_KEY;
  if (!key) return null;
  try {
    const body = {
      orderNumber:          payload.orderNumber,
      customerName:         payload.receiverName,
      customerAddress:      payload.dropoffAddress,
      customerPhone:        payload.receiverPhone,
      restaurantName:       "Packisher Logistics",
      restaurantAddress:    payload.pickupAddress,
      restaurantPhone:      payload.senderPhone,
      expectedDeliveryDate: payload.expectedDeliveryDate,
      expectedPickupTime:   payload.expectedPickupTime,
      expectedDeliveryTime: payload.expectedDeliveryTime,
      orderSource:          "packisher.com",
      additionalDetails:    `${payload.itemDescription} | Fragility: ${payload.fragility} | Vehicle: ${payload.vehicleType} | Notes: ${payload.pickupNotes}`,
    };
    const res = await fetch("https://api.shipday.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${key}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return String(data?.orderId ?? data?.id ?? "");
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!rateLimit(ip).allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 400 },
    );
  }

  const parsed = parcelSchema.safeParse(body);
  if (!parsed.success) {
    console.log("[parcels/route] Request body:", JSON.stringify(body, null, 2));
    console.log("[parcels/route] Zod errors:", JSON.stringify(parsed.error.format(), null, 2));
    return NextResponse.json(
      { success: false, message: "Invalid booking data", errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    // Server-side distance + price — never trust client
    const distanceKm  = await getDistanceKm(data.pickup_lat, data.pickup_lng, data.dropoff_lat, data.dropoff_lng);
    const quotedPrice = calculateParcelPrice(distanceKm, data.timing, data.vehicle_type);

    // Run slot assignment
    const run = assignRunSlot(data.timing, new Date());
    if (!run.eligible) {
      return NextResponse.json({ success: false, message: run.message }, { status: 400 });
    }

    const today           = new Date().toISOString().split("T")[0];
    const preferredRun    = data.timing === "scheduled" ? (data.preferred_run ?? null) : run.slot;
    const preferredDate   = data.timing === "scheduled" ? (data.preferred_date ?? null) : today;
    const dispatchTime    = run.dispatchTime?.toISOString() ?? new Date().toISOString();
    const deliveryTime    = new Date(
      (run.dispatchTime ?? new Date()).getTime() + 2 * 60 * 60_000,
    ).toISOString();
    const reference       = `PKS-P-${Date.now()}`;
    const bookingId       = randomUUID();

    const supabase = getSupabase();

    const insertData = {
      id: bookingId,
      reference,
      sender_name:      data.sender_name,
      sender_phone:     data.sender_phone,
      receiver_name:    data.receiver_name,
      receiver_phone:   data.receiver_phone,
      pickup_address:   data.pickup_address,
      pickup_lat:       data.pickup_lat,
      pickup_lng:       data.pickup_lng,
      pickup_notes:     data.pickup_notes     ?? null,
      dropoff_address:  data.dropoff_address,
      dropoff_lat:      data.dropoff_lat,
      dropoff_lng:      data.dropoff_lng,
      dropoff_notes:    data.dropoff_notes    ?? null,
      item_description: data.item_description,
      fragility:        data.fragility,
      estimated_value:  data.estimated_value  ?? null,
      vehicle_type:     data.vehicle_type,
      timing:           data.timing,
      preferred_run:    preferredRun,
      preferred_date:   preferredDate,
      additional_notes: data.additional_notes ?? null,
      quoted_price:     quotedPrice,
      distance_km:      Math.round(distanceKm * 10) / 10,
      status:           "pending",
      shipday_order_id: null,
    };

    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Inserting into table: parcels_bookings");
    console.log("Insert payload:", JSON.stringify(insertData, null, 2));

    const { error: insertError } = await supabase
      .from("parcels_bookings")
      .insert(insertData);

    if (insertError) {
      console.error("[parcels/route] insert error:", JSON.stringify(insertError, null, 2));
      return NextResponse.json(
        { success: false, message: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }

    // Create Shipday order (non-blocking — failure never fails the booking)
    const shipdayId = await createShipdayOrder({
      orderNumber:          reference,
      senderName:           data.sender_name,
      senderPhone:          data.sender_phone,
      pickupAddress:        data.pickup_address,
      receiverName:         data.receiver_name,
      receiverPhone:        data.receiver_phone,
      dropoffAddress:       data.dropoff_address,
      itemDescription:      data.item_description,
      fragility:            data.fragility,
      vehicleType:          data.vehicle_type,
      pickupNotes:          data.pickup_notes    ?? "",
      expectedDeliveryDate: preferredDate ?? today,
      expectedPickupTime:   dispatchTime,
      expectedDeliveryTime: deliveryTime,
      price:                quotedPrice,
    });

    // Update Shipday ID and confirm status
    await supabase
      .from("parcels_bookings")
      .update({ shipday_order_id: shipdayId ?? null, status: "confirmed" })
      .eq("id", bookingId);

    // Notification email
    const resendKey = process.env.RESEND_API_KEY;
    const emailTo   = process.env.CONTACT_EMAIL_TO;
    if (resendKey && emailTo) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from:    "Packisher Bookings <bookings@packisher.com>",
          to:      emailTo,
          subject: `New Parcel Booking — ${reference}`,
          html: `
            <h2>New Parcel Booking</h2>
            <p><strong>Reference:</strong> ${reference}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <hr/>
            <h3>Sender</h3>
            <p>${data.sender_name} · ${data.sender_phone}</p>
            <h3>Pickup</h3>
            <p>${data.pickup_address}${data.pickup_notes ? `<br/><em>${data.pickup_notes}</em>` : ""}</p>
            <h3>Receiver</h3>
            <p>${data.receiver_name} · ${data.receiver_phone}</p>
            <h3>Drop-off</h3>
            <p>${data.dropoff_address}${data.dropoff_notes ? `<br/><em>${data.dropoff_notes}</em>` : ""}</p>
            <h3>Item</h3>
            <p>${data.item_description} · ${data.fragility.replace(/_/g, " ")}${data.estimated_value ? ` · Est. value: KES ${data.estimated_value}` : ""}</p>
            <h3>Vehicle</h3>
            <p>${data.vehicle_type === "boda" ? "Boda (Motorbike)" : "Car"}</p>
            <h3>Timing</h3>
            <p>${data.timing.replace(/_/g, " ")} · Run: ${preferredRun ?? "—"} · Date: ${preferredDate ?? "—"}</p>
            <p><strong>Run:</strong> ${run.message}</p>
            ${data.additional_notes ? `<h3>Notes</h3><p>${data.additional_notes}</p>` : ""}
            <hr/>
            <p><strong>Distance:</strong> ${Math.round(distanceKm * 10) / 10} km</p>
            <p><strong>Quoted Price:</strong> KES ${quotedPrice}</p>
          `,
        });
      } catch {
        // Non-fatal
      }
    }

    return NextResponse.json({
      success:    true,
      reference,
      quotedPrice,
      runMessage: run.message,
      message:    "Booking confirmed. We will confirm via WhatsApp within 15 minutes.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
