import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { getSupabase } from "@/lib/supabase";

const MATERIALS = ["Ballast", "River Sand", "Plasta Sand", "Murram", "Hardcore", "Topsoil"] as const;
const URGENCY = ["urgent", "scheduled", "flexible"] as const;
const TIME_WINDOWS = ["morning", "afternoon"] as const;

const WK_BOUNDS = { minLat: 0.0, maxLat: 1.8, minLng: 33.5, maxLng: 35.5 };

const KE_PHONE_RE = /^(?:\+254|254|0)(7\d{8}|1\d{8})$/;

const bookingSchema = z
  .object({
    material: z.enum(MATERIALS),
    quantity: z.number().int().min(1).max(10),
    deliveryLocation: z.string().min(1).max(300),
    deliveryLat: z.number().min(WK_BOUNDS.minLat).max(WK_BOUNDS.maxLat),
    deliveryLng: z.number().min(WK_BOUNDS.minLng).max(WK_BOUNDS.maxLng),
    urgency: z.enum(URGENCY),
    preferredDate: z.string().optional(),
    timeWindow: z.enum(TIME_WINDOWS),
    fullName: z.string().min(2).max(100),
    phone: z.string().refine((v) => KE_PHONE_RE.test(v.replace(/\s+/g, "")), "Invalid Kenyan phone"),
    email: z.string().email().max(200),
    notes: z.string().max(500).optional().nullable(),
  })
  .refine(
    (d) => {
      if (d.urgency !== "scheduled") return true;
      if (!d.preferredDate) return false;
      const dt = new Date(d.preferredDate);
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return !Number.isNaN(dt.getTime()) && dt >= tomorrow;
    },
    { message: "Scheduled bookings need a future date", path: ["preferredDate"] }
  );

// TODO: replace with Redis rate limiting in production
const ipHits = new Map<string, { count: number; resetAt: number }>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const limit = 10;
  const e = ipHits.get(ip);
  if (!e || now > e.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (e.count >= limit) return false;
  e.count++;
  return true;
}

function sanitize(s: string): string {
  return s.replace(/[<>]/g, "").trim();
}

function normalisePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("254")) return `+${digits}`;
  if (digits.startsWith("0")) return `+254${digits.slice(1)}`;
  return `+254${digits}`;
}

function generateReference(): string {
  // 4 chars, base32 from random bytes
  const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(4);
  let out = "";
  for (let i = 0; i < 4; i++) out += ALPHA[bytes[i] % ALPHA.length];
  return `PKH-${out}`;
}

async function sendConfirmationEmail(args: {
  to: string;
  reference: string;
  fullName: string;
  material: string;
  quantity: number;
  deliveryLocation: string;
  scheduleSummary: string;
  timeWindowLabel: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const waLink = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}` : "";

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#1A1814;max-width:560px;margin:0 auto;padding:24px;">
      <h1 style="font-family:'Barlow Condensed',Arial,sans-serif;color:#7A5C38;letter-spacing:0.08em;text-transform:uppercase;font-size:22px;margin:0 0 24px;">Packisher Tipper</h1>
      <h2 style="font-size:24px;margin:0 0 8px;">We received your booking.</h2>
      <p style="color:#3D3830;font-size:15px;line-height:1.6;margin:0 0 24px;">Hi ${args.fullName}, thank you for choosing Packisher.</p>
      <table style="width:100%;border-collapse:collapse;background:#F5F2EC;border-radius:8px;padding:16px;margin:0 0 24px;">
        <tr><td style="padding:8px 12px;color:#6B6358;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Reference</td><td style="padding:8px 12px;font-weight:700;font-size:18px;color:#7A5C38;">${args.reference}</td></tr>
        <tr><td style="padding:8px 12px;color:#6B6358;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Material</td><td style="padding:8px 12px;">${args.material}</td></tr>
        <tr><td style="padding:8px 12px;color:#6B6358;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Trucks</td><td style="padding:8px 12px;">${args.quantity}</td></tr>
        <tr><td style="padding:8px 12px;color:#6B6358;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Location</td><td style="padding:8px 12px;">${args.deliveryLocation}</td></tr>
        <tr><td style="padding:8px 12px;color:#6B6358;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Schedule</td><td style="padding:8px 12px;">${args.scheduleSummary}</td></tr>
        <tr><td style="padding:8px 12px;color:#6B6358;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Time</td><td style="padding:8px 12px;">${args.timeWindowLabel}</td></tr>
      </table>
      <p style="color:#3D3830;font-size:15px;line-height:1.6;margin:0 0 16px;">Our team will contact you on WhatsApp within 2 hours to confirm your booking and discuss payment.</p>
      ${waLink ? `<p style="margin:0 0 24px;"><a href="${waLink}" style="display:inline-block;padding:12px 22px;background:#7A5C38;color:#F5F2EC;text-decoration:none;border-radius:8px;font-weight:600;">Chat with us on WhatsApp</a></p>` : ""}
      <p style="color:#6B6358;font-size:13px;line-height:1.6;margin:24px 0 0;">support@packisher.com</p>
    </div>
  `;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Packisher <bookings@packisher.com>",
        to: [args.to],
        subject: `Booking Received — Ref ${args.reference}`,
        html,
      }),
    });
  } catch (err) {
    console.error("Resend error:", err);
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests, please try again later." }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first ? `${first.path.join(".")}: ${first.message}` : "Invalid input" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const reference = generateReference();
  const phone = normalisePhone(data.phone);
  const fullName = sanitize(data.fullName);
  const notes = data.notes ? sanitize(data.notes) : null;

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Booking service unavailable" }, { status: 503 });
  }

  const { error: dbError } = await supabase.from("haul_bookings").insert({
    booking_reference: reference,
    material: data.material,
    quantity: data.quantity,
    delivery_location: data.deliveryLocation,
    delivery_lat: data.deliveryLat,
    delivery_lng: data.deliveryLng,
    urgency: data.urgency,
    preferred_date: data.urgency === "scheduled" ? data.preferredDate : null,
    time_window: data.timeWindow,
    full_name: fullName,
    phone,
    email: data.email,
    notes,
    payment_status: "pending",
    status: "received",
  });

  if (dbError) {
    console.error("Supabase insert error:", dbError);
    return NextResponse.json({ error: "Could not save booking" }, { status: 500 });
  }

  const scheduleSummary =
    data.urgency === "scheduled" && data.preferredDate
      ? data.preferredDate
      : data.urgency === "urgent"
      ? "Urgent (same/next day)"
      : "Flexible (within the week)";
  const timeWindowLabel = data.timeWindow === "morning" ? "Morning 7am–11am" : "Afternoon 12pm–4pm";

  await sendConfirmationEmail({
    to: data.email,
    reference,
    fullName,
    material: data.material,
    quantity: data.quantity,
    deliveryLocation: data.deliveryLocation,
    scheduleSummary,
    timeWindowLabel,
  });

  // TODO: Trigger Mpesa STK Push here
  // IntaSend API call
  // Phone: validated phone from form (variable: phone)
  // Amount: deposit amount from pricing config (not yet set)
  // Reference: booking reference (variable: reference)
  // On success: update payment_status to 'paid' in haul_bookings

  return NextResponse.json({ success: true, bookingReference: reference });
}
